import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {getIssuers} from '../scripts/api'
import styles from '../styles/request';
import RequestSuccessModal from '../components/modals/RequestSuccessModal';
import ErrorMessage from '../components/ErrorMessage'; // Ensure correct import path

const RequestCredentialScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [typeofID, setID] = useState('');
  const [docnumb, setdocnumb] = useState('');
  const [FullName, setFullName] = useState('');
  const [Pnumber, setPnumber] = useState('');
  const [address, setAddress] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [error, setError] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);

  const clearForm = () => {
    setID('');
    setdocnumb('');
    setFullName('');
    setPnumber('');
    setAddress('');
    setError('');
    setEmptyFields([]);  // Clear the fields tracking array
  };

  const handleSubmit = () => {
    const fields = [];
    if (!typeofID) fields.push('Type of ID');
    if (!docnumb) fields.push('Document number');
   
    if (fields.length > 0) {
      setError(`Please fill the following fields: ${fields.join(', ')}`);
      setEmptyFields(fields);
      return;  
    }

    setError('');
    setEmptyFields([]);
    clearForm();
    setModalVisible(!modalVisible);
  };

  const clearError = () => {
    setError('');
    setEmptyFields([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <RequestSuccessModal
        modalVisible={modalVisible}
        handleModalClose={() => {
          clearForm();
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Form Of Identification Required</Text>
            <TextInput
              style={[
                styles.input,
                emptyFields.includes('Type of ID') && styles.inputError,
              ]}
              value={typeofID}
              onChangeText={setID}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Document Number</Text>
            <TextInput
              style={[
                styles.input,
                emptyFields.includes('Document number') && styles.inputError,
              ]}
              value={docnumb}
              onChangeText={setdocnumb}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, isPressed && styles.buttonHover]}
          onPress={handleSubmit}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        >
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

RequestCredentialScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default RequestCredentialScreen;
