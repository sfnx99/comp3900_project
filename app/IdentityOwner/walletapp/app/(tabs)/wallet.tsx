import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../script.js'; // Import your token retrieval function
import config from '../config.json';

const Wallet = () => {

  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [credId, setCredId] = useState(null);
  const [token, setToken] = useState(null);

  // Toggle to show sensitive information
  const toggleSensitiveInfo = () => {
    setShowSensitiveInfo(!showSensitiveInfo);
  };

  // Fetch the credentials on component mount
  useEffect(() => {
    const getCredentials = async () => {
      try {
        const token = await getToken();
        setToken(token);
        console.log("tokens", token);
        
        const res = await fetch(`${config.wallet_url}/v2/credentials`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await res.json();
        console.log(data);
        setCredId(data.credentials[0]); // Assuming the credentials array has at least one entry
      } catch (error) {
        console.error('Error fetching credentials:', error.message || error.response);
        Alert.alert('Error', 'Failed to load credentials.');
      }
    };
    getCredentials();
  }, []);

  // Fetch the wallet data when token or credId changes
  useEffect(() => {
    const getCredential = async () => {
      if (!credId || !token) return; // Wait until both token and credId are available

      try {
        console.log("Fetching credential with credId:", credId);

        const res_cred = await fetch(`${config.wallet_url}/v2/credential?credential_id=${credId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const resJson = await res_cred.json();
        const credInfo = resJson.credential;
        setWalletData(credInfo);
        console.log("Fetched wallet data:", credInfo);
      } catch (error) {
        console.error('Error fetching wallet data:', error.message || error.response);
        Alert.alert('Error', 'Failed to load wallet data.');
      }
    };

    getCredential();
  }, [credId, token]); // Depend on both credId and token

  if (!walletData) {
    return <Text>Loading...</Text>; // Show loading state while fetching data
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student ID Card</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusValid}>
            <Text style={styles.statusText}>Valid</Text>
          </View>
          <Ionicons name="settings-outline" size={24} color="black" style={styles.icon} />
          <Pressable onPress={toggleSensitiveInfo} style={styles.icon}>
            {/* <Ionicons
              name={showSensitiveInfo ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="black"
            /> */}
          </Pressable>
        </View>
      </View>

      <View style={styles.licenseInfo}>
        {Object.keys(walletData).map((key, index) => {
          const isSensitive = key !== 'expiryDate'; // Only expiryDate should always be visible
          const value = isSensitive && !showSensitiveInfo ? '••••••••' : walletData[key];

          return (
            <Text key={index} style={styles.infoText}>
              {key}: {value}
            </Text>
          );
        })}
      </View>

      <View style={styles.qrContainer}>
        <Image 
          source={{ uri: 'https://example-qr-code-link.com' }} 
          style={styles.qrCode}
        />
        <Text style={styles.cardNumber}>Card Number: 2000000000</Text>
      </View>

      <Image
        source={{ uri: 'https://example.com/nsw-logo.png' }} 
        style={styles.logo}
      />
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusValid: {
    backgroundColor: 'green',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
  licenseInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  profileIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  cardNumber: {
    fontSize: 14,
    color: 'gray',
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
  },
});
