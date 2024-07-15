import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ThemeContext } from '../context/ThemeContext';
import { credentialPropType, formatCamelCase } from '../scripts/util';

import Card from '../images/Credential.png';

const CredentialCard = ({ credential }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  // Static variable to keep track of sequence numbers
  CredentialCard.sequenceCounter = (CredentialCard.sequenceCounter || 0) + 1;
  const sequenceNumber = CredentialCard.sequenceCounter;

  const handlePress = () => {
    navigation.navigate('WalletStack', {
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
      marginTop: 5,
      marginBottom: 10,
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
        <Text style={styles.text}>{formatCamelCase(credential.type[0])}</Text>
      </View>
    </View>
  );
};

CredentialCard.propTypes = {
  credential: PropTypes.shape({
    id: PropTypes.string.isRequired,
    issuer: PropTypes.string.isRequired,
    type: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    favourite: PropTypes.bool,
    cryptosuite: PropTypes.string.isRequired,
    credential: PropTypes.shape({
      id: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CredentialCard;
