import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const EditInfo = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
          source={require('../images/logo3.png')} 
          style={styles.logo}
        />
      <Text style={styles.text}>Credential Request Successfully Submitted</Text>
      <Text style={styles.text2}>Your Request is Being Processed, Please Return Back to Home</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    color: 'white'
  },
  text2: {
    marginTop: 20,
    fontSize: 16,
    color: '#D6EE41', 
    textAlign: 'center'
  },
  logo: {
    marginTop: height * -0.05, 
    width: width * 0.5,       
    height: width * 0.5,
  }
});

export default EditInfo;