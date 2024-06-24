import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from '../styles/request';

const RequestCredentialScreen = ({ navigation }) => {
  const [typeofID, setID] = useState('');
  const [docnumb, setdocnumb] = useState('');
  const [FullName, setFullName] = useState('');
  const [Pnumber, setPnumber] = useState('');
  const [address, setAddress] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = () => {
    const tmpEmptyFields = [];
    if (!typeofID) tmpEmptyFields.push('typeofID');
    if (!docnumb) tmpEmptyFields.push('docnumb');
    if (!FullName) tmpEmptyFields.push('FullName');
    if (!Pnumber) tmpEmptyFields.push('Pnumber');
    if (!address) tmpEmptyFields.push('address');

    if (tmpEmptyFields.length > 0) {
      setEmptyFields(tmpEmptyFields);
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    setEmptyFields([]);
    navigation.navigate('SuccessfullySubmitted');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Form Of Identification Required</Text>
            <TextInput
              style={[
                styles.input,
                emptyFields.includes('typeofID') && styles.inputError,
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
                emptyFields.includes('docnumb') && styles.inputError,
              ]}
              value={docnumb}
              onChangeText={setdocnumb}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                emptyFields.includes('FullName') && styles.inputError,
              ]}
              value={FullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                emptyFields.includes('Pnumber') && styles.inputError,
              ]}
              value={Pnumber}
              onChangeText={setPnumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[
                styles.input,
                emptyFields.includes('address') && styles.inputError,
              ]}
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, isPressed && styles.buttonHover]}
          // onPress={() => navigation.navigate("SuccessfullySubmitted")}
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
