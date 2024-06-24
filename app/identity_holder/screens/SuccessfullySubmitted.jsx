import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Success = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image
          source={require('../images/logo3.png')} 
          style={styles.logo}
        />
      <Text style={styles.text}>Credential Request Successfully Submitted</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
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
    color: 'black'
  },
  text2: {
    marginTop: 20,
    fontSize: 16,
    color: '#586411',
    padding: 10, 
    textAlign: 'center'
  },
  logo: {
    marginTop: height * -0.05, 
    width: width * 0.5,       
    height: width * 0.5,
  },
  button: {
    backgroundColor: '#D6EE41', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20 ,
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