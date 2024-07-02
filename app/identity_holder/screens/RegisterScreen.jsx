import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import TextInputField from '../components/TextInputField';
import { useTheme } from '../context/ThemeContext';
import TextButton from '../components/TextButton';
import { registerUser } from '../scripts/api';

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const submitForm = async () => {
    // Check all fields filled and password matches
    if (!email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords don\'t match.');
      return;
    }

    try {
      await registerUser(email, password);
      clearForm();
      navigation.navigate('MainApp', { screen: 'Home' });
    } catch (error) {
      Alert.alert(String(error));
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      marginTop: 20,
    },
    inputContainer: {
      marginHorizontal: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInputField
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
        />
        <TextInputField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
        />
      </View>

      <TextButton
        text="Submit"
        onPress={submitForm}
      />
    </View>
  );
};

export default RegisterScreen;
