import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import TextButton from '../components/TextButton';
import { formatCamelCase } from '../scripts/util';
import { postPresentation } from '../scripts/api';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const PresentCredentialScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { presentData, url, credential } = route.params;
  const [attributes, setAttributes] = useState([]);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

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
        // TODO: uncomment once the service provider is implemented
        // await postPresentation(credential.id, url);
        Alert.alert('Success', 'Verification success!');
        navigation.navigate('Home', { screen: 'PresentationScreen' });
      } else {
        Alert.alert('Authentication Failed, Please try again.');
      }
    } catch (error) {
      Alert.alert(`Error: ${error.message}`);
    }
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
          <Text style={styles.text}>Use your credential, {credential.type} to present the following information?</Text>
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
      </SafeAreaView>
      ) : null
  );
};

export default PresentCredentialScreen;
