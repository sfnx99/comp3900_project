import { useEffect, useState } from 'react';
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

const PresentCredentialScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { presentData, url, credential } = route.params;
  const [attributes, setAttributes] = useState([]);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [error, setError] = useState('');

  /**
   * Check if the device is compatible for biometrics for the authentication
   * prio to the presentation.
   */
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

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
  const handlePress = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID',
        fallbackLabel: 'Enter Password',
      });

      if (result.success) {
        await postPresentation(credential.id, url);
        Alert.alert('Success', 'Verification success!');
        navigation.navigate('Home', { screen: 'PresentationScreen' });
      } else {
        setError('Authentication Failed, Please try again.');
      }
    } catch (err) {
      setError(err.message);
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
            onPress={handlePress}
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