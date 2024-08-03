import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IssueRegisterUser, PostInformation } from '../scripts/api';
import styles from '../styles/request';
import TextInputField from '../components/TextInputField';
import TextButton from '../components/TextButton';

const { width } = Dimensions.get('window');

const RequestCredentialScreen = ({ navigation }) => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [Fname, setFname] = useState('');
  const [Lname, setLname] = useState('');
  const [DOB, setDOB] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
  }, []);

  const registerUser = async () => {
    try {
      if (!email || !password) {
        setError('Please fill in all fields!');
        return;
      }

      await IssueRegisterUser(email, password);
      Alert.alert('Registration Successful');
    } catch (err) {
      setError(`Could not register: ${err.message}`);
    }
  };


  const UserInfo = async () => {
    try {
      if (!email || !Fname || !Lname || !DOB) {
        setError('Please fill in all fields!');
        return;
      }

      await PostInformation(email, Fname, Lname, DOB);
      Alert.alert('Registration Info Successful');
    } catch (err) {
      setError(`Could not register: ${err.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error ? (
          <View style={localStyles.errorMessageContainer}>
            <Text style={localStyles.errorMessage}>{error}</Text>
          </View>
        ) : null}
        <Text style={localStyles.text}>Register User to Receive Credential</Text>
        <TextInputField 
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
        />
        <TextInputField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          isPassword
        />
        <TextButton
          style={styles.button}
          text="Register User"
          onPress={registerUser}
        />
        <Text style={localStyles.text}>Register User Information</Text>
        <TextInputField
          value={Fname}
          onChangeText={setFname}
          placeholder="First Name"
        />
        <TextInputField
          value={Lname}
          onChangeText={setLname}
          placeholder="Last Name"
        />
        <TextInputField
          value={DOB}
          onChangeText={setDOB}
          placeholder="Date of Birth"
        />
        <TextButton
          style={styles.button}
          text="Supply Information"
          onPress={UserInfo}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  errorMessageContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#ff4d4d', 
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  errorMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#D6EE41',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
    width: width * 0.95,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16, 
    marginBottom: 20,
  },
});

export default RequestCredentialScreen;
