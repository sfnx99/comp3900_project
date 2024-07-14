// screens/RequestCredentialScreen.js

import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import styles from '../styles/request';
import RequestSuccessModal from '../components/modals/RequestSuccessModal';
import ErrorMessage from '../components/ErrorMessage'; // Import CustomErrorPopup component

const RequestCredentialScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [typeofID, setID] = useState('');
  const [docnumb, setdocnumb] = useState('');
  const [FullName, setFullName] = useState('');
  const [Pnumber, setPnumber] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');

  const clearForm = () => {
    setID('');
    setdocnumb('');
    setFullName('');
    setPnumber('');
    setAddress('');
  };

  const handleSubmit = () => {
    if (!typeofID || !docnumb || !FullName || !Pnumber || !address) {
      setError('Please fill all the fields');
      return;
    }

    clearForm();
    setModalVisible(!modalVisible);
  };

  const handleModalClose = () => {
    clearForm();
    setModalVisible(false);
    navigation.navigate('Home');
  };

  const clearError = () => {
    setError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <RequestSuccessModal modalVisible={modalVisible} handleModalClose={handleModalClose} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Your input fields */}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Error Message Component */}
      {error ? (
        <ErrorMessage message={error} onPress={clearError} />
      ) : null}
    </SafeAreaView>
  );
};

export default RequestCredentialScreen;
