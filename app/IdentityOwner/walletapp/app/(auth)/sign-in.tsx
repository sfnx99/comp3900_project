import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native'; // Replaced TouchableOpacity with Pressable
import Header from './Header';  // Importing the Header
import { useRouter } from 'expo-router';  // Correct hook for navigation

import IPconfig from '../config.json';
const IPaddress = IPconfig.IPaddress;
const wallet_url= IPconfig.wallet_url;
const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // User needs to sign in after scanning QR code to access their credentials for submission

  const handleSignIn = async () => {
    // Please implement sign-in step to get a token

    // Navigate to the home page upon sign in

    const res = await fetch(`http://${IPaddress}:8081/v2/auth/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json", // Ensure the content type is JSON
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (res.status === 200) {
      // Parse the JSON response
      const data = await res.json();
      console.log(data)
      // Get the token from the response
      const { token } = data.token;
      await fetch(`http://${IPaddress}:8081/v2/save-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token)
      });
      router.push({
        pathname: '/(tabs)/home',
      });
    } else {
      alert("Failed Login")
    }

  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"  // Set placeholder text color to gray
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"  // Set placeholder text color to gray
        />
        
    
        <Pressable onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
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
  formContainer: {
    padding: 20,
    marginTop: 20, // Add space below the header
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FFCC00',  // Yellow background
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',  // Black text
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignIn;
