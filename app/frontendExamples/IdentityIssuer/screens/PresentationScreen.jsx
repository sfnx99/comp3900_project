import React, { useState, useLayoutEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ErrorMessage from '../components/ErrorMessage';
import TextInputField from '../components/TextInputField';
import TextButton from '../components/TextButton';
import { renderIconByName } from '../scripts/util';

const PresentationScreen = () => {
  const navigation = useNavigation();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), {
        paddingTop: 25,
        size: 30,
        color: 'black',
      }),
    });
  }, [navigation]);

  const clearError = () => {
    setError('');
  };

  const submit = () => {
    if (!url) {
      const errorMessage = 'No issuer data found';
      setError('Failed to fetch issuers: ' + errorMessage);
      return;
    }

    setUrl('');

    navigation.navigate('Home', {
      screen: 'SelectCredentialScreen',
      params: {
        presentData: {
          type: 'CredentialType1',
          requiredAttributes: ['firstName', 'lastName'],
        },
        url,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      <Text style={styles.text}>Verify your credential at a service provider by inputting their URL below</Text>
        <TextInputField
          value={url}
          onChangeText={setUrl}
          placeholder={"Enter URL..."}
        />
        <TextButton
          text="Submit"
          onPress={submit}
        />
      </View>
      {error && (
        <View style={styles.fullScreenError}>
          <ErrorMessage message={error} onPress={clearError} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 23,
    marginTop: 20,
  },
  fullScreenError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontWeight: 'normal',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default PresentationScreen;
