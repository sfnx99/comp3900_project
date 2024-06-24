import {
  Modal,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '../images/logo3.png';

const { width, height } = Dimensions.get('window');

const RequestSuccessModal = ({ modalVisible, handleModalClose }) => (
  <Modal
    animationType="slide"
    transparent
    visible={modalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
      handleModalClose();
    }}
  >
    <SafeAreaView style={[styles.container, styles.modalView]}>
      <Image
        source={Logo}
        style={styles.logo}
      />
      <Text style={styles.text}>Credential Request Successfully Submitted</Text>
      <TouchableOpacity style={styles.button} onPress={handleModalClose}>
        <Text style={styles.buttonText}>Go Home</Text>
      </TouchableOpacity>

    </SafeAreaView>
  </Modal>
);

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#F6F8FA',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    color: 'black',
  },
  logo: {
    marginTop: height * -0.05,
    width: width * 0.5,
    height: width * 0.5,
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
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

RequestSuccessModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
};

export default RequestSuccessModal;
