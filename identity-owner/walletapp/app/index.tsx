import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Header from './(auth)/Header'; // Import the Header component

const IndexPage = () => {
  const router = useRouter();

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

    
        <Pressable onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>

       
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
    marginTop: 20, // Add space below the header
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
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
