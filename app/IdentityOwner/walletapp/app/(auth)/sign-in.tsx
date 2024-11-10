import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native'; // Replaced TouchableOpacity with Pressable
import Header from './Header';  // Importing the Header
import { useRouter } from 'expo-router';  // Correct hook for navigation
import axios from 'axios';
import IPconfig from '../config.json';
const wallet_url = JSON.stringify(IPconfig.wallet_url)

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  // User needs to sign in after scanning QR code to access their credentials for submission
  const searchParams = new URLSearchParams()
 
  const verifier_url = searchParams.get("verifier_url")
  const requestStep = searchParams.get('request')

  const handleSignIn = async () => {
    // Navigate to the home page upon sign in
    const res = await fetch(`${wallet_url}/v2/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    console.log(res)
    // // Parse the JSON response
    // const data = await res.json();

    // // Get the token from the response
    // const token = data.token;
    // console.log(requestStep)
    // if (requestStep === 'True)') {
    //   router.push(`/access?verifier_url=${verifier_url}&token=${token}}`)
    // } else {
    //   router.push('/(tabs)/home');
    // }      
    router.push('/(tabs)/home');
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
