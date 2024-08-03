import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TextInputField from '../components/TextInputField';
import TextButton from '../components/TextButton';
import { registerUser } from '../scripts/api';
import { UserPreferenceContext } from '../context/UserPreferencesContext';
import ErrorMessage from '../components/ErrorMessage';
import { AccountContext } from '../context/AccountContext';
import PinSetupModal from '../components/modals/PinSetupModal';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { updateDisplayName } = useContext(UserPreferenceContext);
  const { bindEmail } = useContext(AccountContext);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [pinModalVisible, setPinModalVisible] = useState(false);

  const clearForm = () => {
    setDisplayName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const clearError = () => {
    setError('');
  };

  const isEmailValid = (checkingEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(checkingEmail);
  };

  const navigateToHome = () => {
    navigation.navigate('MainApp', { screen: 'Home' });
  };

  const submitForm = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isEmailValid(email)) {
      setError('Invalid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords don't match.");
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('Password must be at least 8 characters long and include a number and special character.');
      return;
    }

    try {
      await registerUser(email, password);
      await updateDisplayName(displayName);
      bindEmail(email);
      clearForm();

      setPinModalVisible(true);
    } catch (err) {
      setError(`Could not register: ${err.message}`);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={clearError}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInputField
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
            />
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

          <Modal visible={!!error} transparent animationType="fade">
            <ErrorMessage message={error} onPress={clearError} />
          </Modal>

          <View style={styles.buttonContainer}>
            <TextButton text="Submit" onPress={submitForm} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <PinSetupModal
        modalVisible={pinModalVisible}
        onRequestClose={() => setPinModalVisible(false)}
        onSuccess={() => {
          setPinModalVisible(false);
          navigateToHome();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    flex: 1,
  },
  inputContainer: {
    marginHorizontal: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default RegisterScreen;
