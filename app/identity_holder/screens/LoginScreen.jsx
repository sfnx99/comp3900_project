import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import styles from '../styles/loginStyles';

const LoginScreen = () => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const navigation = useNavigation();
  
    useEffect(() => {
      (async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
      })();
    }, []);
  
    const authenticate = async () => {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with Face ID',
          fallbackLabel: 'Enter Password',
        });
  
        if (result.success) {
          navigation.replace('MainApp');
        } else {
          Alert.alert('Authentication Failed', 'Please try again.');
        } 
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
  
    return (
        <View style={styles.container}>
        <Image
          source={require('../images/logo3.png')} 
          style={styles.logo}
        />
        <Text style={styles.text}>Login Screen</Text>
        {isBiometricSupported && (
          <Button title="Login with Face ID" onPress={authenticate} />
        )}
        <Button
          title="Proceed without login (for computer testing)"
          onPress={() => navigation.replace('MainApp')}
        />
      </View>
    );
  };
  
  export default LoginScreen;
