import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import config from '../config.json';

const getToken = async () => {
  const res = await fetch(`${config.wallet_url}/v2/get-code`, {
    method: 'POST',
  });

  const data = await res.json();
  return data.token;
};

const HomeScreen = () => {
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      console.log("in homepage");
      const fetchedToken = await getToken();
      setToken(fetchedToken); // Store token in state
      console.log(fetchedToken); // Log the token
    };
    fetchToken();
  }, []);

  const handleCredentialPress = () => {
    router.push({
      pathname: '/(tabs)/scan',
    });
  };

  const handleCheckCredential = () => {
    router.push({
      pathname: '/(tabs)/wallet',
    });
  };

  const handleScanPress = () => {
    router.push({
      pathname: '/(tabs)/scan',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcons}></View>
        </View>
      </View>

      <View style={styles.favouritesContainer}>
        <Text style={styles.sectionTitle}>Favourites</Text>
        <View style={styles.idCard}>
          <Text style={styles.cardTitle}>University Credentials</Text>
          <Text>Expiry: 02.02.2027</Text>
          <Text>UNSW</Text>
          <View style={styles.status}>
            <Text style={styles.statusText}>Valid</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <Pressable style={styles.button} onPress={handleCheckCredential}>
          <Text style={styles.buttonText}>Check a license or credential</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleCredentialPress}>
          <Text style={styles.buttonText}>Add a credential</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleScanPress}>
          <Text style={styles.buttonText}>Scan</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header Styles
  header: {
    backgroundColor: '#FFCC00',
    paddingBottom: 80, // Extends header to provide space for the ID card
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    width: 50,
    justifyContent: 'space-between',
  },

  // Favourites Section Styles
  favouritesContainer: {
    marginTop: -50, // Moves the card upwards into the header area
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  idCard: {
    backgroundColor: '#fff',
    borderRadius: 15, // Rounded corners for the ID card look
    padding: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 4, // Keep this for Android
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Services Section Styles
  section: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2, // Keep this for Android
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});
