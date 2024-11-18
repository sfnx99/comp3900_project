import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from './script.js';
import config from './config.json';

const VerifyScreen = ({ route }: any) => {
  const { uri } = useLocalSearchParams<{ uri: string }>(); // Access query params from route.params
  const { sp } = useLocalSearchParams<{ sp: string }>();

  const [type, setType] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<any[]>([]); // Expected attributes to be an array
  const [loading, setLoading] = useState<boolean>(true);
  const [credId, setCredId] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        setToken(token); // Set token state to keep track

        console.log("tokens", token);

        // Fetch credentials
        const res = await fetch(`${config.wallet_url}/v2/credentials`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log('DATA', data);

        if (data.credentials.length > 0) {
          setCredId(data.credentials[0]);
        }

        // Now fetch wallet data only after credId is available
        if (credId) {
          const res_cred = await fetch(`${config.wallet_url}/v2/credential?credential_id=${credId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const credResponse = await res_cred.json();
          console.log('credResponse', credResponse);

          const credInfo = credResponse.credential;
          setWalletData(credInfo);
          console.log("Credential Info:", credInfo);
        }

        // Fetch attributes for the credential
        if (uri && token) {
          const resAttributes = await fetch(`${config.wallet_url}/v2/present?verifier_uri=${uri}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const attributeData = await resAttributes.json();
          setType("UNSWCredential");
          setAttributes(["zID", "expiryDate"]); // Update to your required attributes
        }

        setLoading(false); // Set loading to false after fetching all the data
      } catch (error) {
        console.error('Error fetching data:', error.message || error.response);
        Alert.alert('Error', 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [uri, credId]); // Add credId as a dependency to trigger fetching wallet data after it's set

  const handleAgree = async () => {
    if (!walletData) {
      Alert.alert("Error", "No wallet data available.");
      return;
    }

    try {
      const cred_id = walletData.id; // Ensure this is available in walletData
      const token = await getToken();

      console.log("verifier_uri:", uri);
      console.log("credential_id:", cred_id);
      console.log("token", token);

      // Make the POST request
      const res = await axios.post(
        `${config.wallet_url}/v2/present`,
        {
          verifier_uri: uri,
          credential_id: cred_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token stored in walletData
          },
        }
      );

      Alert.alert("Success", "Data shared successfully.");
      router.push('/home'); // Navigate to the 'home' tab after success
    } catch (error) {
      console.error("Error in sharing data:", error.response || error.message);
      Alert.alert("Error", "There was an issue sharing the information.");
    }
  };

  const handleDeny = () => {
    Alert.alert("Denial", "You have denied sharing the information.");
    router.push('/home');
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan Result</Text>
      <Text>{uri ? `URI: ${uri}` : "No URI received"}</Text>
      <Text>{sp ? `Service Provider: ${sp}` : "No Service Provider received"}</Text>

      <View style={styles.attributesContainer}>
        <Text style={styles.subHeader}>Service Provider is requesting the following fields:</Text>
        {attributes.length > 0 ? (
          <View>
            {attributes.map((attribute, index) => (
              <Text key={index} style={styles.attributeItem}>• {attribute}</Text>
            ))}
          </View>
        ) : (
          <Text>No attributes to share.</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <Button title="Agree" onPress={handleAgree} />
        <Button title="Deny" onPress={handleDeny} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attributesContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  attributeItem: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default VerifyScreen;
