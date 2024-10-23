import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';

import { credentialPropType } from '../scripts/util';
import CredentialCard from './CredentialCard';
import { ThemeContext } from '../context/ThemeContext';

const CredentialsCarousel = ({ credentials }) => {
  const navigation = useNavigation();
  const { darkMode } = useContext(ThemeContext);

  const handleAddCredential = () => {
    // Navigate to the screen for adding a new credential
    navigation.navigate('Request Credentials');
  };

  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View key="add-new" style={styles.addNewContainer}>
        <TouchableOpacity onPress={handleAddCredential} style={styles.card}>
          <Image 
            source={darkMode ? require('../images/AddCredentialDark.png') : require('../images/AddCredential.png')} 
            style={styles.addNewImage}
          />
        </TouchableOpacity>
      </View>
      {credentials.map((credential) => (
        <CredentialCard key={credential.id} credential={credential} />
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    height: 230,
  },
  addNewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    height: 190,
    width: '100%',
  },
  addNewImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});

CredentialsCarousel.propTypes = {
  credentials: PropTypes.arrayOf(credentialPropType).isRequired,
};

export default CredentialsCarousel;