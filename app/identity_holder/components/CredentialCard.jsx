import { useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ThemeContext } from '../context/ThemeContext';
import { credentialPropType } from '../scripts/util';

const CredentialCard = ({ credential }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const handlePress = () => {
    const serializableCredential = {
      ...credential,
      cred: {
        ...credential.cred,
        expiryDate: credential.cred.expiryDate ? credential.cred.expiryDate.toISOString() : null,
      },
    };

    navigation.navigate('WalletStack', {
      screen: 'CredentialInformation',
      params: { credential: serializableCredential },
    });
  };

  const styles = StyleSheet.create({
    credential: {
      marginBottom: 30,
      alignItems: 'center',
    },
    card: {
      height: 190,
      width: '100%',
      backgroundColor: '#F2F8CA',
    },
    details: {
      flexDirection: 'row',
    },
    text: {
      marginVertical: 10,
      color: theme.text,
    },
  });

  return (
    <View style={styles.credential}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.card}
      />

      <View style={styles.details}>
        <Text style={styles.text}>{credential.cred.credName}</Text>
      </View>
    </View>
  );
};

CredentialCard.propTypes = {
  credential: credentialPropType.isRequired,
};

export default CredentialCard;
