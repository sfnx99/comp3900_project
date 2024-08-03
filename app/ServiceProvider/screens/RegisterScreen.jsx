import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TextInputField from '../components/TextInputField';
import { useTheme } from '../context/ThemeContext';
import TextButton from '../components/TextButton';
import { registerUser } from '../scripts/api';
import { UserPreferenceContext } from '../context/UserPreferencesContext';

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { updateDisplayName, updateLocation } = useContext(UserPreferenceContext);
  const [location, setLocation] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearForm = () => {
    setDisplayName('');
    setLocation('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitForm = async () => {
    if (!displayName || !location || !email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Invalid email address.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('The passwords do not match.');
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      Alert.alert('Password must be at least 8 characters long and include a number and special character.');
      return;
    }

    try {
      await registerUser(email, password);
      await updateDisplayName(displayName);
      await updateLocation(location);
      clearForm();
      navigation.navigate('MainApp', { screen: 'Home' });
    } catch (error) {
      Alert.alert(String(error));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#7f8382',
      marginTop: -100,
      justifyContent: 'center',
    },
    inputContainer: {
      marginHorizontal: 24,
    },
    buttonContainer: {
      alignItems: 'center', 
      marginTop: 10,
    },
    labelStyle: {
      color: 'white',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInputField
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          labelStyle={styles.labelStyle}
        />
        <TextInputField
          label="Location"
          value={location}
          onChangeText={setLocation}
          labelStyle={styles.labelStyle}
        />
        <TextInputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          labelStyle={styles.labelStyle}
        />
        <TextInputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
          labelStyle={styles.labelStyle}
        />
        <TextInputField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          labelStyle={styles.labelStyle}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TextButton
          text="Submit"
          onPress={submitForm}
        />
      </View>
    </View>
  );
};

export default RegisterScreen;
