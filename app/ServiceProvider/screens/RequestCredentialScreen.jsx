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
import { getIssuers, PostDefinition, trustIssuer } from '../scripts/api'; 
import styles from '../styles/request';

const { width } = Dimensions.get('window');

const RequestCredentialScreen = ({ navigation }) => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [IssuerChecked, setIssuerChecked] = useState('');
  const [FnameChecked, setFnameChecked] = useState(false);
  const [LnameChecked, setLnameChecked] = useState(false);
  const [DOBChecked, setDOBChecked] = useState(false);
  const [photocardChecked, setPhotocardChecked] = useState(false);
  const [driversLicenseChecked, setDriversLicenseChecked] = useState(false);
  const [selectedIssuer, setSelectedIssuer] = useState('');

  useEffect(() => {
    
  }, []);

  const UserInfo = async () => {
    // if (!email || !password || !selectedIssuer) {
    //   setSuccessMessage('New Issuer has Been Trusted');
    //   return;
    // }

    const requiredAttributes = [];
    if (FnameChecked) requiredAttributes.push('firstName');
    if (LnameChecked) requiredAttributes.push('lastName');
    if (DOBChecked) requiredAttributes.push('dob');

    const payload = {
      type: driversLicenseChecked ? "DriverLicenceCredential" : "PhotocardCredential",
      requiredAttributes,
    };

    try {
      // get issuer id
      let issuer_id = await getIssuers();
      // make verifier trust it
      await trustIssuer(issuer_id);
      response = await PostDefinition(payload.type, selectedIssuer, requiredAttributes);
      if (response) {
        setSuccessMessage('Your information has been submitted successfully');
        setError('');
      } else {
        setError('Failed to submit information');
        setSuccessMessage('Your information has been submitted with some issues');
      }
    } catch (error) {
      setError('An error occurred: ' + error.message);
      setSuccessMessage('Your information has been submitted with some issues');
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
        {successMessage ? (
          <View style={localStyles.successMessageContainer}>
            <Text style={localStyles.successMessage}>{successMessage}</Text>
          </View>
        ) : null}
        
        {error ? (
          <View style={localStyles.errorMessageContainer}>
            <Text style={localStyles.errorMessage}>{error}</Text>
          </View>
        ) : null}

        <Text style={localStyles.text1}>Select Issuer to Trust</Text>
        <View style={localStyles.switchContainer2}>
          <View style={localStyles.switchRow}>
            <Switch
              value={IssuerChecked}
              onValueChange={setIssuerChecked}
              trackColor={{ false: '#000', true: '#71d444' }}
              thumbColor={IssuerChecked ? 'white' : 'white'}
            />
            <Text style={localStyles.label}>NSW Government</Text>
          </View>
        </View>

        <Text style={localStyles.text}>Select Details Required From Credential</Text>
        <View style={localStyles.switchContainer}>
          <View style={localStyles.switchRow}>
            <Switch
              value={FnameChecked}
              onValueChange={setFnameChecked}
              trackColor={{ false: '#000', true: '#71d444' }}
              thumbColor={FnameChecked ? 'white' : 'white'}
            />
            <Text style={localStyles.label}>First Name</Text>
          </View>
          <View style={localStyles.switchRow}>
            <Switch
              value={LnameChecked}
              onValueChange={setLnameChecked}
              trackColor={{ false: 'white', true: '#71d444' }}
              thumbColor={LnameChecked ? 'white' : 'white'}
            />
            <Text style={localStyles.label}>Last Name</Text>
          </View>
          <View style={localStyles.switchRow}>
            <Switch
              value={DOBChecked}
              onValueChange={setDOBChecked}
              trackColor={{ false: '#000', true: '#71d444' }}
              thumbColor={DOBChecked ? 'white' : 'white'}
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
              trackColor={{ false: '#000', true: '#71d444' }}
              thumbColor={photocardChecked ? 'white' : 'white'}
            />
            <Text style={localStyles.label}>Photocard</Text>
          </View>
          <View style={localStyles.switchRow}>
            <Switch
              value={driversLicenseChecked}
              onValueChange={toggleDriversLicenseSwitch}
              trackColor={{ false: '#000', true: '#71d444' }}
              thumbColor={driversLicenseChecked ? 'white' : 'white'}
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
  successMessageContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#71d444', 
    borderRadius: 5,
    marginVertical: 10,
    marginBottom: 25,
  },
  successMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
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
  text1: {
    color: 'white',
    marginTop: -5,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20, 
    marginBottom: 20,
  },
  text: {
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20, 
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
    backgroundColor: '#D6EE41',
    borderRadius: 20,
  },
  label: {
    margin: 8,
    color: 'black',
  },
});

export default RequestCredentialScreen;
