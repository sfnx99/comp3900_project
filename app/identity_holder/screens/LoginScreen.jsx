import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

import styles from '../styles/loginStyles';
import Logo from '../images/logo3.png';
import TextInputField from '../components/TextInputField';
import { tokenActive, loginUser } from '../scripts/api';
import TextButton from '../components/TextButton';
import ErrorMessage from '../components/ErrorMessage';
import { AccountContext } from '../context/AccountContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { bindedEmail, bindEmail } = useContext(AccountContext);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [email, setEmail] = useState(bindedEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sessionValid, setSessionValid] = useState(false);

  useEffect(() => {
    /**
     * Checks the token is still active to allow biometrics or not.
     */
    const checkSessionActive = async () => {
      const tokenExists = await tokenActive();
      if (tokenExists) {
        setSessionValid(true);
      }
    };

    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();

    checkSessionActive();
  }, []);

  useEffect(() => {
    setEmail(bindedEmail);
  }, [bindedEmail]);

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID',
        fallbackLabel: 'Enter Password',
      });

      if (result.success) {
        navigation.replace('MainApp');
      } else {
        setError('Authentication Failed, Please try again.');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  const login = async () => {
    try {
      if (!email || !password) {
        setError('Please fill in all fields!');
        return;
      }

      await loginUser(email, password);
      bindEmail(email);
      navigation.replace('MainApp');
    } catch (error) {
      setError(`Could not login: ${error.message}`);
    }
  };

  const clearError = () => {
    setError('');
  };

  return (
    <TouchableWithoutFeedback onPress={clearError}>
      <View style={styles.container}>
        <Image
          source={Logo}
          style={styles.logo}
        />
        <Text style={styles.text}>BW Credentials</Text>

        {!bindedEmail &&
          <TextInputField
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
          />
        }
        <TextInputField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          isPassword
        />

        <Modal
          visible={!!error}
          transparent={true}
          animationType="fade"
        >
          <ErrorMessage message={error} onPress={clearError} />
        </Modal>

        <View>
          <TextButton
            style={styles.button}
            text="Login"
            onPress={login}
          />
          {isBiometricSupported && sessionValid && (
            <TextButton
              style={styles.buttonInverted}
              text="Login with Face ID"
              onPress={authenticate}
              inverted
            />
          )}
          {!bindedEmail &&
            <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
