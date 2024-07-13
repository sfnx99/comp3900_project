import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useEffect, useState } from 'react';
import { CredentialsContext } from '../../context/CredentialsContext';
import TextButton from '../TextButton';
import { formatCamelCase } from '../../scripts/util';
import { useTheme } from '../../context/ThemeContext';

const SelectCredentialModal = ({ modalVisible, handleModalClose, presentData }) => {
  const { credentials } = useContext(CredentialsContext);
  const theme = useTheme();
  const [presentingCredential, setPresentingCredential] = useState(null);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const loadPresentingCredential = () => {
      const credential = credentials.find((cred) => (
        cred.type.includes(presentData.type)
      ));
      setPresentingCredential(credential);

      if (!presentingCredential) {
        Alert.alert('ERROR', 'You do not own the necessary credential for this presentation.');
      }
    };

    const loadAttributes = () => {
      if (!presentingCredential) { return; }
      const filteredAttributes = presentData.requiredAttributes.reduce((acc, key) => {
        if (presentingCredential.credential[key] !== undefined) {
          acc[key] = presentingCredential.credential[key];
        }
        return acc;
      }, {});
      setAttributes(filteredAttributes);
    };

    if (presentData) {
      loadPresentingCredential();
      loadAttributes();
    }
  }, [presentData]);

  const styles = StyleSheet.create({
    container: {
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      backgroundColor: '#F6F8FA',
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      color: theme.text,
      fontSize: 16,
      marginBottom: 10,
    },
    field: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    fieldName: {
      fontWeight: 'bold',
    },
  });

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      transparent
      onRequestClose={handleModalClose}
    >
      <SafeAreaView style={styles.container}>
        {attributes ? Object.entries(attributes)
          .map(([key, item]) => (
            <View key={key} style={styles.field}>
              <Text style={[styles.fieldName, styles.text]}>{`${formatCamelCase(key)}:`}</Text>
              <Text style={styles.text}>{item}</Text>
            </View>
          )) : null}
        <TextButton
          text="Cancel"
          onPress={handleModalClose}
        />
      </SafeAreaView>
    </Modal>
  );
};

SelectCredentialModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  presentData: PropTypes.exact({
    type: PropTypes.string,
    requiredAttributes: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SelectCredentialModal;
