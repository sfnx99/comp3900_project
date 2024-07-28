import React, { useContext, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { CredentialsContext } from '../../context/CredentialsContext';
import ErrorMessage from '../ErrorMessage';

const CredentialModal = ({ modalVisible, handleModalClose, credentialId }) => {
  const { removeCredential } = useContext(CredentialsContext);
  const navigation = useNavigation();
  const [error, setError] = useState('');

  const clearError = () => {
    setError('');
  };

  const handleDelete = async () => {
    try {
      await removeCredential(credentialId);
      handleModalClose();
      navigation.navigate('Wallet');
      Alert.alert('Success', 'Credential was successfully removed.');
    } catch (err) {
      setError(`Could not delete credential: ${err}`);
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleModalClose}
              >
                <MaterialCommunityIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.settingsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleDelete}
              >
                <Text style={styles.text}>Delete Credential</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={!!error}
        transparent
        animationType="slide"
      >
        <ErrorMessage
          message={error}
          onPress={clearError}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  settingsContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

CredentialModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  credentialId: PropTypes.string.isRequired,
};

export default CredentialModal;
