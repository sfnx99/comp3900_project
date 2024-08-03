import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';

import { AccountContext } from '../../context/AccountContext';
import TextButton from '../TextButton';

const PinSetupModal = ({ modalVisible, onRequestClose, onSuccess }) => {
  const { pin, updatePin } = useContext(AccountContext);
  const [verifyPin, setVerifyPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handles pin authentication if there is an existing pin.
   */
  const handleVerifyPin = () => {
    if (verifyPin !== pin) {
      setError('Incorrect pin. Please try again.');
      return;
    }

    setError('');
    setAuthenticated(true);
  };

  /**
   * Handles updating the new pin on pressing the
   * set Pin button.
   */
  const handleSetPin = () => {
    if (currentPin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (currentPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    updatePin(currentPin);
    handleOnClose();
  };

  /**
   * Handles closing the modal while clearing all the states of the modal.
   */
  const handleOnClose = () => {
    setVerifyPin('');
    setCurrentPin('');
    setConfirmPin('');
    setError('');
    setAuthenticated(false);

    if (onSuccess) {
      onSuccess();
    }

    onRequestClose();
  };

  /**
   * Renders the pin setup modal based on what step the user is on.
   * @returns a component based on what state the uuser is in.
   */
  const renderCurrentStep = () => {
    if (pin && !authenticated) {
      return (
        <>
          <Text style={styles.title}>Enter Current Pin</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            value={verifyPin}
            onChangeText={setVerifyPin}
            placeholder="Enter Current PIN"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
          />

          <View style={styles.buttonContainer}>
            <TextButton text="Submit" onPress={handleVerifyPin} />
            <TextButton text="Cancel" onPress={handleOnClose} inverted />
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.title}>
          {pin ? 'Change PIN' : 'Set Up PIN for Authentication' }
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          value={currentPin}
          onChangeText={setCurrentPin}
          placeholder="Enter 4-digit PIN"
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />
        <TextInput
          style={styles.input}
          value={confirmPin}
          onChangeText={setConfirmPin}
          placeholder="Confirm PIN"
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />

        <View style={styles.buttonContainer}>
          <TextButton text="Set PIN" onPress={handleSetPin} />
          <TextButton text="Cancel" onPress={handleOnClose} inverted />
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={handleOnClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {renderCurrentStep()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
});

PinSetupModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default PinSetupModal;
