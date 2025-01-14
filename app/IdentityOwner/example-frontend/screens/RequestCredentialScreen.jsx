import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { AuthorizeIssue, getIssuers, getIssue, PostIssue } from '../scripts/api';
import styles from '../styles/request';
import RequestSuccessModal from '../components/modals/RequestSuccessModal';
import ErrorMessage from '../components/ErrorMessage';
import * as Linking from 'expo-linking';


const { width } = Dimensions.get('window');

const RequestCredentialScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [issuerConfirmationVisible, setIssuerConfirmationVisible] = useState(false);
  const [docnumb, setDocnumb] = useState('');
  const [issuers, setIssuers] = useState([]);
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState('');
  const [detailsPickerVisible, setDetailsPickerVisible] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [loggedInEmail, setLoggedInEmail] = useState(''); 
  const [authCode, setAuthCode] = useState('');
  

  useEffect(() => {
    // API Call to laod issuers from backend
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
    loadIssuers();
  }, []);
// Modal picker function to select the issuer and type of credential you want from the api call options
  const handleIssuerSelection = async (itemValue) => {
    setSelectedIssuer(itemValue);
    if (itemValue === 'NSW Government') {
      const data = await getIssuers();
      const issuerDID = data.issuers[0];
      setPickerVisible(false);
      setIssuerConfirmationVisible(true);
      try {
        const details = await getIssue(issuerDID);
        if (details && details.types) {
          setAdditionalDetails(details.types);
          setDetailsPickerVisible(true);
        } else {
          throw new Error('No details found for this issuer');
        }
      } catch (error) {
        let errorMessage = 'Failed to fetch details';
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage += `: ${error.response.data.error}`;
        } else if (error.message) {
          errorMessage += `: ${error.message}`;
        } else {
          errorMessage += ': An unknown error occurred';
        }
        setError(errorMessage);
      }
    }
  };
// Login Function 
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setErrorMessage('Please fill in all fields!');
        return;
      }
      setLoggedInEmail(email);
      setSuccessMessage('Successfully Consented to Issuance');
    } catch (error) {
      setLoginModalVisible(false); 
      setErrorMessage(`Could not login: ${error.message}`); 
    }
  };
// Redirect to external Website
  const waitForRedirect = () => {
    return new Promise((resolve) => {
      const handleUrl = (event) => {
        resolve(event.url);
      };
      Linking.addEventListener('url', handleUrl);
    });
  };
  // Handle the authorization of credential to ensure we are correctly authorized credential, this is an API call
  const handleAuthorize = async () => {
    if (selectedIssuer && selectedDetail) {
      try {
        const response_type = "code";
        const redirectUri = Linking.createURL();
  
        await AuthorizeIssue(response_type, email, redirectUri, selectedDetail);
  
        // Wait for the redirect URL
        const redirectUrl = await waitForRedirect();
        const authCode = redirectUrl.split('?')[1].split('&')[0].split('=')[1];
        const data = await getIssuers();
        const issuerDID = data.issuers[0];
        const postResponse = await PostIssue(issuerDID, authCode, redirectUri, selectedDetail);
        if (postResponse) {
          setSuccessMessage('Credential issued successfully');
          setModalVisible(true); 
        } else {
          setErrorMessage('Failed to issue credential');
        }
      } catch (error) {
        console.error('Authorization Error:', error);
        setErrorMessage(`Error: ${JSON.stringify(error)}`);
      }
    } else {
      setErrorMessage('Please select an issuer and a detail.');
    }
  };
  

  const clearError = () => {
    setError('');
    setErrorMessage(''); 
  };
  // Modal pop ups aswell as api calls to get the issuers to ensure you consent then pick both the issuer and type of credential
  return (
    <SafeAreaView style={styles.container}>
      <RequestSuccessModal
        modalVisible={modalVisible}
        handleModalClose={() => {
          setModalVisible(false);
          navigation.navigate('Home');
        }}
      />

      <Modal
        visible={!!error}
        transparent={true}
        animationType="fade"
      >
        <ErrorMessage message={error} onPress={clearError} />
      </Modal>

      <Modal
        visible={pickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={localStyles.modalOverlay}>
            <View style={localStyles.pickerContainer} onStartShouldSetResponder={() => true}>
              <Text style={localStyles.pickerTitle}>Select an Issuer</Text>
              <Picker
                selectedValue={selectedIssuer}
                onValueChange={handleIssuerSelection}
                style={localStyles.pickerStyle}>
                
                <Picker.Item label="NSW Government" value="NSW Government" />
              </Picker>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={detailsPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDetailsPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDetailsPickerVisible(false)}>
          <View style={localStyles.modalOverlay}>
            <View style={localStyles.pickerContainer} onStartShouldSetResponder={() => true}>
              <Text style={localStyles.pickerTitle}>Select Type of Credential</Text>
              <Picker
                selectedValue={selectedDetail}
                onValueChange={(itemValue) => setSelectedDetail(String(itemValue))}
                style={localStyles.pickerStyle}>
                {additionalDetails.map((detail, index) => (
                  <Picker.Item label={detail} value={detail} key={index} />
                ))}
              </Picker>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={loginModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={clearError}>
          <View style={localStyles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => setLoginModalVisible(false)}>
              <View style={localStyles.modalOverlay}>
                <View style={localStyles.loginContainer}>
                  <Text style={localStyles.modalTitle}>Enter Login Details to Consent</Text>
                  <TextInput
                    style={localStyles.input2}
                    placeholder="Email"
                    placeholderTextColor={'black'}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <TextInput
                    style={localStyles.input2}
                    placeholder="Password"
                    placeholderTextColor={'black'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity style={localStyles.button2} onPress={handleLogin}>
                    <Text style={localStyles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {successMessage && (
        <View style={localStyles.successMessageContainer}>
          <Text style={localStyles.successMessage}>{successMessage}</Text>
        </View>
      )}

      {errorMessage && (
        <View style={localStyles.errorMessageContainer}>
          <Text style={localStyles.errorMessage}>{errorMessage}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          localStyles.button,
          pressed ? localStyles.buttonHover : {}
        ]}
        onPress={() => {
          clearError();
          setLoginModalVisible(true);
        }}
      >
        <Text style={localStyles.buttonText}>Consent to Being Issued a Credential</Text>
      </Pressable>
      <Text style={styles.Text2}>Please note you only need to consent per credential for it to be issued</Text>
     
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.Text}>Select Fields for Requested Credential</Text>
        <View style={styles.content}>
          <Pressable
            style={({ pressed }) => [
              localStyles.inputLikePicker,
              pressed ? localStyles.pressed : {}
            ]}
            onPress={() => setPickerVisible(true)}
          >
            <Text style={localStyles.label}>Issuer of Identification Required</Text>
            <Text style={localStyles.inputText}>{selectedIssuer || 'Select an issuer...'}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              localStyles.inputLikePicker,
              pressed ? localStyles.pressed : {}
            ]}
            onPress={() => setDetailsPickerVisible(true)}
          >
            <Text style={localStyles.label}>Type of Credential Required</Text>
            <Text style={localStyles.inputText}>{selectedDetail || 'Select a credential...'}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              localStyles.button,
              pressed ? localStyles.buttonHover : {}
            ]}
            onPress={handleAuthorize}
          >
            <Text style={localStyles.buttonText}>Submit Request</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderColor: '#D6EE41',
    borderWidth: 10,
    padding: 10,
    borderRadius: 10,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    backgroundColor: 'white'
  },
  pickerStyle: {
    width: 330,
    height: 216,
    backgroundColor: 'white',
  },
  inputLikePicker: {
    borderWidth: 0.5,
    width: '95%',
    borderColor: 'gray',
    backgroundColor: '#eeffa1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  inputText: {
    fontSize: 16,
  },
  pressed: {
    // opacity: 0.2
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
  button2: {
    backgroundColor: '#D6EE41',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
    width: width * 0.50,
    alignItems: 'center',
  },
  buttonHover: {
    backgroundColor: '#ffffe8',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  loginContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  input2: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  successMessageContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#62e367', 
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
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
});

export default RequestCredentialScreen;
