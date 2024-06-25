import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

import styles from '../styles/loginStyles';
import CustomButton from '../components/CustomButton'; // Adjust the path as necessary
import Logo from '../images/logo3.png';

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
        source={Logo}
        style={styles.logo}
      />
      <Text style={styles.text}> BW Credentials</Text>
      {isBiometricSupported && (
        <CustomButton
          style={styles.button}
          title="Login with Face ID"
          onPress={authenticate}
        />
      )}
      <CustomButton
        style={styles.button}
        title="Proceed without login (for computer testing)"
        onPress={() => navigation.replace('MainApp')}
      />
      <CustomButton
        style={styles.button}
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default LoginScreen;
