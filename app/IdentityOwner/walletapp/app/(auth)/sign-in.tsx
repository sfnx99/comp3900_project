import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native'; // Replaced TouchableOpacity with Pressable
import Header from './Header';  // Importing the Header
import { useRouter } from 'expo-router';  // Correct hook for navigation
import axios from 'axios';


import IPconfig from '../config.json';
const wallet_url= JSON.stringify(IPconfig.wallet_url);
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  // User needs to sign in after scanning QR code to access their credentials for submission

  const params = new URL(location.href).searchParams;
  const verifier_url = params.get('verifier_url');
  const requestStep = params.get('request');
  const handleSignIn = async () => {

    // Please implement sign-in step to get a token

    // Navigate to the home page upon sign in
    const res = await fetch("http://localhost:8081/v2/auth/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json", // Ensure the content type is JSON
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    // Parse the JSON response
    const data = await res.json();
    console.log(data)
    // Get the token from the response
    const token = data.token;

    if (requestStep === 'True' && res.status === 200) {
      router.push(`/access?verifier_url=${verifier_url}&token=${token}`)
    } else if (requestStep != 'True' && res.status === 200){
      router.push('/(tabs)/home');
    } else {
      alert("Invalid login")
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
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
