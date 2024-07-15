import { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import { CredentialsContext } from '../context/CredentialsContext';
import TextButton from '../components/TextButton';
import { formatCamelCase } from '../scripts/util';
import { postPresentation } from '../scripts/api';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const SelectCredentialScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { presentData, url } = route.params;
  const { credentials } = useContext(CredentialsContext);
  const [presentingCredential, setPresentingCredential] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  useEffect(() => {
    /**
     * Load the credential with the matching type of the presentation.
     */
    const loadPresentingCredential = () => {
      const credential = credentials.find((cred) => (
        cred.type.includes(presentData.type)
      ));
      setPresentingCredential(credential);

      // TODO: Give message if there is no credential!
      if (!presentingCredential) {
        //Alert.alert('ERROR', 'You do not own the necessary credential for this presentation.');
      }
    };

    loadPresentingCredential();
  }, [presentData]);

  useEffect(() => {
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
  
    loadAttributes();
  }, [presentingCredential]);

  const handlePress = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID',
        fallbackLabel: 'Enter Password',
      });

      if (result.success) {
        // TODO: uncomment once the service provider is implemented
        // await postPresentation(presentingCredential.id, url);
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
      presentingCredential ? (
        <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.text}>Use your credential, {presentingCredential.type} to present the following information?</Text>
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

export default SelectCredentialScreen;
