import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';

import TextButton from '../components/TextButton';
import { credentialPropType, formatCamelCase } from '../scripts/util';
import { postPresentation } from '../scripts/api';
import { useTheme } from '../context/ThemeContext';
import ErrorMessage from '../components/ErrorMessage';
import { AccountContext } from '../context/AccountContext';
import PinVerificationModal from '../components/modals/PinVerificationModal';

const PresentCredentialScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { presentData, url, credential } = route.params;
  const [attributes, setAttributes] = useState([]);
  const [error, setError] = useState('');
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const { authMethod } = useContext(AccountContext);

  /**
   * Loads the attributes that will be used when the credential is read.
   */
  useEffect(() => {
    const loadAttributes = () => {
      if (!credential) { return; }
      const filteredAttributes = presentData.requiredAttributes.reduce((acc, key) => {
        if (credential.credential[key] !== undefined) {
          acc[key] = credential.credential[key];
        }
        return acc;
      }, {});

      setAttributes(filteredAttributes);
    };

    loadAttributes();
  }, [credential]);

  /**
   * Handles the events following the submit button involving
   * authentication before sending the presentation.
   */
  const handlePressSubmit = async () => {
    try {
      if (authMethod === 'passcode') {
        setPinModalVisible(true);
      } else {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate with Face ID',
          fallbackLabel: 'Enter Password',
        });

        if (result.success) {
          presentCredential();
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Presents the credential and navigates the user back to the presentation screen
   * on a successful presentation.
   */
  const presentCredential = async () => {
    try {
      await postPresentation(credential.id, url);
      Alert.alert('Success', 'Verification success!');

      navigation.navigate('Home');
    } catch (err) {
      setError('Authentication Failed, Please try again.');
    }
  };

  const clearError = () => {
    setError('');
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 23,
      justifyContent: 'space-between',
      height: '100%',
      paddingBottom: 30,
    },
    fields: {
      flex: 1,
      marginTop: 20,
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
    credential ? (
      <>
        <SafeAreaView>
          <View style={styles.container}>
            <Text style={styles.text}>
              {`Use your credential, ${credential.type} to present the following information?`}
            </Text>
            <View style={styles.fields}>
              {attributes ? Object.entries(attributes)
                .map(([key, item]) => (
                  <View key={key} style={styles.field}>
                    <Text style={[styles.fieldName, styles.text]}>{`${formatCamelCase(key)}:`}</Text>
                    <Text style={styles.text}>{item}</Text>
                  </View>
                )) : null}
            </View>
            <TextButton
              text="Submit"
              onPress={handlePressSubmit}
            />
          </View>
          <Modal
            visible={!!error}
            transparent
            animationType="fade"
          >
            <ErrorMessage
              message={error}
              onPress={clearError}
            />
          </Modal>
        </SafeAreaView>

        <Modal
          visible={pinModalVisible}
          transparent
          animationType="slide"
        >
          <PinVerificationModal
            modalVisible={pinModalVisible}
            onRequestClose={() => { setPinModalVisible(false); }}
            onSuccess={presentCredential}
          />
        </Modal>
      </>
    ) : null
  );
};

PresentCredentialScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      presentData: PropTypes.shape({
        requiredAttributes: PropTypes.arrayOf(PropTypes.string),
        type: PropTypes.string,
      }),
      url: PropTypes.string,
      credential: credentialPropType,
    }),
  }),
};

export default PresentCredentialScreen;
