import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CredentialCard from '../components/CredentialCard';
import { CredentialsContext } from '../context/CredentialsContext';
import SearchBar from '../components/SearchBar';

const WalletScreen = () => {
  const { credentials, loadCredentials } = useContext(CredentialsContext);
  const [filteredCredentials, setFilteredCredentials] = useState([]);

  useEffect(() => {
    setFilteredCredentials(credentials);
  }, [credentials]);
// Search Bar in the Wallet
  const handleSearch = (query) => {
    if (!query) {
      setFilteredCredentials(credentials);
      return;
    }

    const filtered = credentials.filter((credential) =>
      credential.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCredentials(filtered);
  };
  // Refresh Wallet so new credential appears
  const handleRefresh = async () => {
    try {
      await loadCredentials();
    } catch (error) {
      console.error('Error refreshing credentials:', error);
    }
  };

  return (
    <>
      <SearchBar onChange={handleSearch} />
      <View style={styles.refreshButtonContainer}>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          handleRefresh();
          handleRefresh();
        }}
      >
        <MaterialCommunityIcons name="refresh" size={20} color="black" />
        <Text style={styles.refreshButtonText}>Refresh Wallet</Text>
      </TouchableOpacity> 
      </View>
      <ScrollView style={styles.container}>
        {filteredCredentials.map((credential) => (
          <CredentialCard key={credential.id} credential={credential} />
        ))}
      </ScrollView>
    </>
  );
};

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.05,
    marginHorizontal: 21,
  },
  refreshButtonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6EE41',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  refreshButtonText: {
    marginLeft: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WalletScreen;
