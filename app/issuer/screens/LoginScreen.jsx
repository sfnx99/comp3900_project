import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/loginStyles';
import Logo from '../images/logo3.png';
import TextButton from '../components/TextButton';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={Logo}
        style={styles.logo}
      />
      <Text style={styles.text}> BW Credentials</Text>
      <Text style={styles.subtitletext}> Credential Issuer App</Text>

      <View>
        <TextButton
          style={styles.button}
          text="Login"
          onPress={() => navigation.replace('MainApp')}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
