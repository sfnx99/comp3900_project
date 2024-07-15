import { useContext, useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../images/Credential.png';

import { CredentialsContext } from '../context/CredentialsContext';
import { formatCamelCase } from '../scripts/util';
import { postPresentation } from '../scripts/api';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const SelectCredentialScreen = ({ route }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { presentData, url } = route.params;
  const { credentials } = useContext(CredentialsContext);

  const [compatibleCredentials, setCompatibleCredentials] = useState([]);

  /**
   * Get all the compatible credentials to the current presentation.
   */
  useEffect(() => {
    const getCompatibleCredentials = () => {
      const compatibleTypes = presentData.type;
      setCompatibleCredentials(credentials.filter((cred) => (cred.type.includes(compatibleTypes))));
    };

    getCompatibleCredentials();
  }, [credentials]);

  /**
   * Handles the press event on a credential. Will send the user to the
   * presentation screen with the selected credential.
   * @param {object} cred - the credential object
   */
  const handlePress = (cred) => {
    navigation.navigate('Home', {
      screen: 'PresentCredentialScreen',
      params: {
        presentData: {
          type: 'CredentialType1',
          requiredAttributes: ['firstName', 'lastName'],
        },
        url,
        credential: cred,
      },
    });
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
    },
    card: {
      height: 190,
      width: '100%',
    },
    cardImage: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    },
    details: {
      marginTop: 10,
      alignItems: 'center',
    },
    text: {
      color: theme.text,
    },
  });

  return (
    <SafeAreaView>
      {compatibleCredentials.map((cred) => (
        <View style={styles.container} key={cred.id}>
          <TouchableOpacity
            onPress={() => handlePress(cred)}
            style={styles.card}
          >
            <Image source={Card} style={styles.cardImage} />
          </TouchableOpacity>

          <View style={styles.details}>
            <Text style={styles.text}>{formatCamelCase(cred.type[0])}</Text>
          </View>
        </View>
      ))}
    </SafeAreaView>
  );
};

export default SelectCredentialScreen;
