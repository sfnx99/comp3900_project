import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import axios from 'axios';
import config from './config.json';
import * as FileSystem from 'expo-file-system';

const VerifyScreen = ({ route }: any) => {
  const { uri } = useLocalSearchParams<{ uri: string}>();  // Access query params from route.params
  const { sp } = useLocalSearchParams<{ sp: string}>();

  const [type, setType] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<any[]>([]);  // Expected attributes to be an array
  const [loading, setLoading] = useState<boolean>(true);
  const [walletData, setWalletData] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + 'response.json';
        const fileContents = await FileSystem.readAsStringAsync(fileUri);
        const data = JSON.parse(fileContents);
        console.log(data);  // Debugging output
        setWalletData(data);  // Set wallet data state
      } catch (error) {
        console.error('Error fetching wallet data:', error.response || error.message);
        Alert.alert('Error', 'Failed to load wallet data.');
      }
    };

    fetchWalletData();
  }, []);  // Runs only once when the component mounts

  // Fetch attributes if walletData is available
  useEffect(() => {
    const fetchAttributes = async () => {
      if (walletData && uri) {
        try {
          const res = await axios.get(`${config.wallet_url}/v2/present?verifier_uri=${uri}`, {
            headers: {
              Authorization: `Bearer ${walletData.token}`  // Ensure token is available
            }
          });

          const { type, requiredAttributes } = res.data;
          setType(type);
          setAttributes(requiredAttributes);  // Expected attributes to be an array
          setLoading(false);  // Set loading to false once the data is fetched
        } catch (error) {
          console.error("Error fetching attributes:", error);
          setLoading(false);
          Alert.alert("Error", "There was an issue fetching the attributes.");
        }
      }
    };

    fetchAttributes();
  }, [walletData, uri]);

  const handleAgree = () => {
    Alert.alert("Agreement", "You have agreed to share the information.");
    // Logic to handle sharing data (e.g., sending data to a backend)
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
      {/* Ensure uri and sp are displayed correctly */}
      <Text>{uri ? `URI: ${uri}` : "No URI received"}</Text>
      <Text>{sp ? `Service Provider: ${sp}` : "No Service Provider received"}</Text>

      {/* Display bullet points for the attributes */}
      <View style={styles.attributesContainer}>
        <Text style={styles.subHeader}>Service Provider is requesting the following fields:</Text>
        {attributes && attributes.length > 0 ? (
          <View>
            {attributes.map((attribute: string, index: number) => (
              <Text key={index} style={styles.attributeItem}>• {attribute}</Text>
            ))}
          </View>
        ) : (
          <Text>No attributes to share.</Text>
        )}
      </View>

      {/* Agree/Deny buttons */}
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
    alignItems: 'center',  // Center the bullets
  },
  attributeItem: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',  // Ensure text is centered
  },
  buttonsContainer: {
    marginTop: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default VerifyScreen;
