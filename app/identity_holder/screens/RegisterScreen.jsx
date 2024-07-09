import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import TextInputField from '../components/TextInputField';
import { useTheme } from '../context/ThemeContext';
import TextButton from '../components/TextButton';
import { registerUser } from '../scripts/api';
import { UserPreferenceContext } from '../context/UserPreferencesContext';

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { updateDisplayName } = useContext(UserPreferenceContext);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearForm = () => {
    setDisplayName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const submitForm = async () => {
    // Check all fields filled and password matches
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords don\'t match.');
      return;
    }

    try {
      await registerUser(email, password);
      await updateDisplayName(displayName);
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

      <TextButton
        text="Submit"
        onPress={submitForm}
      />
    </View>
  );
};

export default RegisterScreen;
