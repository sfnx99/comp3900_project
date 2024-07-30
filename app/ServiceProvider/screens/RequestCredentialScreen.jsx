import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputField from '../components/TextInputField';
import TextButton from '../components/TextButton';
import { getIssuers, PostDefinition } from '../scripts/api'; // Ensure PostDefinition is imported
import styles from '../styles/request';

const { width } = Dimensions.get('window');

const RequestCredentialScreen = ({ navigation }) => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [FnameChecked, setFnameChecked] = useState(false);
  const [LnameChecked, setLnameChecked] = useState(false);
  const [DOBChecked, setDOBChecked] = useState(false);
  const [photocardChecked, setPhotocardChecked] = useState(false);
  const [driversLicenseChecked, setDriversLicenseChecked] = useState(false);
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const [issuers, setIssuers] = useState([]);

  useEffect(() => {
    loadIssuers();
  }, []);

  const loadIssuers = async () => {
    try {
      const result = await getIssuers();
      if (result && result.issuers) {
        setIssuers(result.issuers);
      } else {
        throw new Error('No issuer data found');
      }
    } catch (error) {
      setError('Failed to fetch issuers: ' + error.message);
    }
  };

  const UserInfo = async () => {
    if (!email || !password || !selectedIssuer) {
      setError('Please fill in all fields');
      return;
    }

    const requiredAttributes = [];
    if (FnameChecked) requiredAttributes.push('firstName');
    if (LnameChecked) requiredAttributes.push('lastName');
    if (DOBChecked) requiredAttributes.push('dob');

    const payload = {
      type: driversLicenseChecked ? "DriverLicenceCredential" : "PhotocardCredential",
      requiredAttributes,
    };

    try {
      const response = await PostDefinition(payload.type, selectedIssuer, requiredAttributes);
      if (response) {
        Alert.alert('Success', 'Your information has been submitted successfully');
      } else {
        setError('Failed to submit information');
      }
    } catch (error) {
      setError('An error occurred: ' + error.message);
    }
  };

  const togglePhotocardSwitch = () => {
    setPhotocardChecked(!photocardChecked);
    if (!photocardChecked) {
      setDriversLicenseChecked(false);
    }
  };

  const toggleDriversLicenseSwitch = () => {
    setDriversLicenseChecked(!driversLicenseChecked);
    if (!driversLicenseChecked) {
      setPhotocardChecked(false);
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

        <Text style={localStyles.text}>Select Details Required From Credential</Text>
        <View style={localStyles.switchContainer}>
          <View style={localStyles.switchRow}>
            <Switch
              value={FnameChecked}
              onValueChange={setFnameChecked}
              trackColor={{ false: '#000', true: '#81b0ff' }}
              thumbColor={FnameChecked ? '#f5dd4b' : '#f4f3f4'}
            />
            <Text style={localStyles.label}>First Name</Text>
          </View>
          <View style={localStyles.switchRow}>
            <Switch
              value={LnameChecked}
              onValueChange={setLnameChecked}
              trackColor={{ false: '#000', true: '#81b0ff' }}
              thumbColor={LnameChecked ? '#f5dd4b' : '#f4f3f4'}
            />
            <Text style={localStyles.label}>Last Name</Text>
          </View>
          <View style={localStyles.switchRow}>
            <Switch
              value={DOBChecked}
              onValueChange={setDOBChecked}
              trackColor={{ false: '#000', true: '#81b0ff' }}
              thumbColor={DOBChecked ? '#f5dd4b' : '#f4f3f4'}
            />
            <Text style={localStyles.label}>Date of Birth</Text>
          </View>
        </View>

        <Text style={localStyles.text}>Choose Credential Type</Text>
        <View style={localStyles.switchContainer}>
          <View style={localStyles.switchRow}>
            <Switch
              value={photocardChecked}
              onValueChange={togglePhotocardSwitch}
              trackColor={{ false: '#000', true: '#81b0ff' }}
              thumbColor={photocardChecked ? '#f5dd4b' : '#f4f3f4'}
            />
            <Text style={localStyles.label}>Photocard</Text>
          </View>
          <View style={localStyles.switchRow}>
            <Switch
              value={driversLicenseChecked}
              onValueChange={toggleDriversLicenseSwitch}
              trackColor={{ false: '#000', true: '#81b0ff' }}
              thumbColor={driversLicenseChecked ? '#f5dd4b' : '#f4f3f4'}
            />
            <Text style={localStyles.label}>Driver's License</Text>
          </View>
        </View>

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
    backgroundColor: '#7f8382', 
    borderRadius: 5,
    marginVertical: 10,
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
  switchContainer: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    margin: 8,
    color: 'white',
  },
});

export default RequestCredentialScreen;
