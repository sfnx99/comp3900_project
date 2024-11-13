import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from './(auth)/Header'; // Import the Header component
import { issueAndVerifyCredential } from './(tabs)/TESTING_API';
import * as FileSystem from 'expo-file-system';  // Import Expo FileSystem


const IndexPage = () => {
  const router = useRouter();

  // const fs = require('fs').promises;

  // const handleIssueAndVerify = async () => {
  //   try {
  //     const resp = await issueAndVerifyCredential();
  //     console.log('Successfully issued and verified');
  
  //     // Convert the response to a JSON string
  //     const jsonString = JSON.stringify(resp, null, 2);
  
  //     // Create a blob from the JSON string
  //     const blob = new Blob([jsonString], { type: 'application/json' });
  
  //     // Create a link element and trigger a download
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = 'response.json';  // The filename for the downloaded file
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  
  //     return resp;
  //   } catch (error) {
  //     console.error('Error during credential issuance and verification:', error);
  //     Alert.alert('Error', 'Failed to issue and save credential.');
  //   }
  // };

  const handleIssueAndVerify = async () => {
    try {
      const resp = await issueAndVerifyCredential();
      console.log('Successfully issued and verified');
  
      // Convert the response to a JSON string
      const jsonString = JSON.stringify(resp, null, 2);
  
      if (typeof document !== 'undefined') {
        // This block will run on Web (Browser)
        // Create a blob from the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });
  
        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'response.json';  // The filename for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // This block will run on iOS/Android (React Native)
        // Save the JSON string to a file using Expo FileSystem
        const fileUri = FileSystem.documentDirectory + 'response.json';
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
        console.log('File written to:', fileUri);

        // Optionally, you could give the user a way to open the file or share it
        Alert.alert('File saved', 'Your response has been saved to "response.json".');
      }

      return resp;
    } catch (error) {
      console.error('Error during credential issuance and verification:', error.response || error.message);
      Alert.alert('Error', 'Failed to issue and save credential.');
    }
  };
  
  handleIssueAndVerify();
  
  const handleSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <View style={styles.container}>
      <Header /> 
      <View style={styles.contentContainer}> 
        <Text style={styles.title}>Welcome to the App</Text>
        <Text style={styles.subtitle}>Start by signing in or signing up.</Text>

        {/* Sign In Button */}
        <Pressable onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>

        {/* Sign Up Button */}
        <Pressable onPress={handleSignUp} style={[styles.button, styles.signUpButton]}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    marginTop: 40, // Move the content closer to the top
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16, // Adjust the spacing
    textAlign: 'left', // Align text to the left
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'left', // Align text to the left
  },
  button: {
    backgroundColor: '#FFCC00',  // Yellow background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,  // Space between buttons
  },
  signUpButton: {
    backgroundColor: '#FFCC00',
  },
  buttonText: {
    color: '#000',  // Black text
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default IndexPage;
