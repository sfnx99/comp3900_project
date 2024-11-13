import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'; // Replaced TouchableOpacity with Pressable
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Header from './Header';  // Import the Header component

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

//   function stripFirstAndLastChar(str: string) {
//     // Check if the string length is greater than 1
//     if (str.length > 1) {
//         return str.slice(1, -1); // Remove first and last character
//     }
//     return str; // Return the original string if length is 1 or less
// }
  const IPconfig = require('../config.json')
  const IPaddress = IPconfig.IPaddress
  const wallet_url= IPconfig.wallet_url;

  const handleSignUp = async () => {
    const res = await fetch(`http://${IPaddress}:8081/v2/auth/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json", // Ensure the content type is JSON
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    });

    if (res.status === 200) {
      const data = await res.json();
      // Get the token from the response
      const { token } = data.token;
      router.push({
        pathname: '/(tabs)/home',
        params: {
          token: token
        }
      });
    } else {
      alert("Invalid details")
    }
  };

  return (
    <View style={styles.container}>
      <Header /> 
      <View style={styles.formContainer}> 
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#888"  // Set placeholder text color to gray
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#888"  // Set placeholder text color to gray
        />
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
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#888"  // Set placeholder text color to gray
        />

       
        <Pressable onPress={handleSignUp} style={styles.button}>
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
  formContainer: {
    padding: 20,
    marginTop: 20, // Add space below the header
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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

export default SignUp;
