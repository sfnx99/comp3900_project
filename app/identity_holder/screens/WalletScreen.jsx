import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import CredentialCard from '../components/CredentialCard';
import { CredentialsContext } from '../context/CredentialsContext';
import SearchBar from '../components/SearchBar';
import SearchButton from '../components/SearchButton';

const WalletScreen = ({ navigation }) => {
  const { credentials } = useContext(CredentialsContext);
  const [filteredCredentials, setFilteredCredentials] = useState(credentials);

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

  return (
    <>
      <SearchBar onChange={handleSearch} />
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
});

export default WalletScreen;
