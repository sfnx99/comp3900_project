import {
  Modal,
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const CredentialModal = ({ modalVisible, handleModalClose }) => (
  <Modal
    animationType="slide"
    transparent
    visible={modalVisible}
    onRequestClose={handleModalClose}
  >
    <TouchableWithoutFeedback onPress={handleModalClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={[styles.container, styles.modalView]}>
            <Text style={styles.text}>This is the modal content</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Button 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Button 2</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#F6F8FA',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: width * 0.8,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D6EE41',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
    width: width * 0.7,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

CredentialModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
};

export default CredentialModal;
