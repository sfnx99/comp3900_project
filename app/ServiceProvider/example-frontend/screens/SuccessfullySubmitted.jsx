import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';

import Logo from '../images/logo3.png';

const { width, height } = Dimensions.get('window');

const Success = () => {
  const navigation = useNavigation();

  /**
   * Send the user home and reset the RequestStack so
   * the user will go back to the form.
   */
  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={Logo}
        style={styles.logo}
      />
      <Text style={styles.text}>Credential Request Successfully Submitted</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Go Home</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F8FA',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    color: 'black',
  },
  /*
  text2: {
    marginTop: 20,
    fontSize: 16,
    color: '#586411',
    padding: 10,
    textAlign: 'center'
  },
  */
  logo: {
    marginTop: height * -0.05,
    width: width * 0.5,
    height: width * 0.5,
  },
  button: {
    backgroundColor: '#D6EE41',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
    width: width * 0.95,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Success;
