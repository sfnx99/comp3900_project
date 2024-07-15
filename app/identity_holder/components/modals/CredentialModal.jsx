import React, { useContext } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CredentialsContext } from '../../context/CredentialsContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CredentialModal = ({ modalVisible, handleModalClose, credentialId }) => {
  const { removeCredential } = useContext(CredentialsContext);
  const navigation = useNavigation();

  const handleDelete = () => {
    navigation.navigate('Wallet');
    try {
      removeCredential(credentialId);
    } catch (error) {
      Alert.alert('Error', error)
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        handleModalClose();
      }}
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
};

export default CredentialModal;