import { useContext, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import { AccountContext } from '../../context/AccountContext';
import TextButton from '../TextButton';
import TextInputField from '../TextInputField';

const PinVerificationModal = ({ modalVisible, onRequestClose, onSuccess }) => {
  const { pin } = useContext(AccountContext);
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState('');

  /**
   * Verifies the given pin with the user's pin and executes
   * the onSuccess function if it matches.
   */
  const handleSubmit = () => {
    if (pin === currentPin) {
      onSuccess();

      handleCloseModal();
    } else {
      setError('Incorrect PIN');
    }
  };

  const handleCloseModal = () => {
    setCurrentPin('');
    setError('');
    onRequestClose();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingBottom: 23,
      marginHorizontal: 24,
    },
    text: {
      fontSize: 18,
      marginBottom: 10,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    buttonContainer: {
      gap: 10,
    },
  });

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Enter Your Pin</Text>
        <TextInputField
          value={currentPin}
          onChangeText={setCurrentPin}
          keyboardType="number-pad"
          isPassword
        />
        {error ? <Text style={styles.error}>{error}</Text> : null }
        <View style={styles.buttonContainer}>
          <TextButton
            text="Submit"
            onPress={handleSubmit}
          />
          <TextButton
            text="Cancel"
            onPress={handleCloseModal}
            inverted
          />
        </View>
      </View>
    </Modal>
  );
};

PinVerificationModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default PinVerificationModal;
