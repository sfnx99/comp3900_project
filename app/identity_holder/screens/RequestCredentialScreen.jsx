import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  Modal,
  StyleSheet,
  TextInput,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { getIssuers, getIssue } from '../scripts/api'; 
import styles from '../styles/request'; 
import RequestSuccessModal from '../components/modals/RequestSuccessModal';
import ErrorMessage from '../components/ErrorMessage';

const RequestCredentialScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [docnumb, setdocnumb] = useState('');
  const [issuers, setIssuers] = useState([]);
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState('');
  const [detailsPickerVisible, setDetailsPickerVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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

  const handleIssuerSelection = async (itemValue) => {
    setSelectedIssuer(itemValue);
    setPickerVisible(false);
    try {
      const details = await getIssue();
      if (details && details.types) {
        setAdditionalDetails(details.types);
        setDetailsPickerVisible(true);
      } else {
        throw new Error('No details found for this issuer');
      }
    } catch (error) {
      setError('Failed to fetch details: ' + error.message);
    }
  };

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
        <ErrorMessage message={error} onPress={() => setError('')} />
      </Modal>

      <Modal
        visible={pickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable style={localStyles.modalOverlay} onPress={() => setPickerVisible(false)}>
          <View style={localStyles.pickerContainer} onStartShouldSetResponder={() => true}>
            <Text style={localStyles.pickerTitle}>Select an Issuer</Text>
            <Picker
              selectedValue={selectedIssuer}
              onValueChange={handleIssuerSelection}
              style={localStyles.pickerStyle}>
              {issuers.map((issuer, index) => (
                <Picker.Item label={issuer} value={issuer} key={index} />
              ))}
            </Picker>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={detailsPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDetailsPickerVisible(false)}
      >
        <Pressable style={localStyles.modalOverlay} onPress={() => setDetailsPickerVisible(false)}>
          <View style={localStyles.pickerContainer} onStartShouldSetResponder={() => true}>
            <Text style={localStyles.pickerTitle}>Select Type of Credential</Text>
            <Picker
              selectedValue={selectedDetail}
              onValueChange={(itemValue) => setSelectedDetail(itemValue)}
              style={localStyles.pickerStyle}>
              {additionalDetails.map((detail, index) => (
                <Picker.Item label={detail} value={detail} key={index} />
              ))}
            </Picker>
          </View>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              styles.button,
              pressed ? styles.buttonPressed : {}
            ]}
            onPress={() => {
              if (selectedIssuer && selectedDetail) {
                console.log("Submission", { issuer: selectedIssuer, detail: selectedDetail, docNumber: docnumb });
                setModalVisible(true);
              } else {
                setError('Please select an issuer and a detail.');
              }
            }}
          >
            <Text style={styles.buttonText}>Submit Request</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
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
    opacity: 0.5
  }
});

export default RequestCredentialScreen;
