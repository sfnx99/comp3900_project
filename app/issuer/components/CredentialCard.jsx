import { useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ThemeContext } from '../context/ThemeContext';
import { credentialPropType } from '../scripts/util';

import Card from '../images/Credential.png';

const CredentialCard = ({ credential }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const handlePress = () => {
    navigation.navigate('Home', {
      screen: 'CredentialInformation',
      params: { credential },
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.card}
      >
        <Image source={Card} style={styles.cardImage} />
      </TouchableOpacity>

      <View style={styles.details}>
        <Text style={styles.text}>{credential.type}</Text>
      </View>
    </View>
  );
};

CredentialCard.propTypes = {
  credential: credentialPropType.isRequired,
};

export default CredentialCard;
