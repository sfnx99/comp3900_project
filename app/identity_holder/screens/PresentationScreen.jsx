import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import TextInputField from '../components/TextInputField';
import TextButton from '../components/TextButton';

const PresentationScreen = () => {
  const navigation = useNavigation();
  const [url, setUrl] = useState('');

  const submit = () => {
    if (!url) {
      Alert.alert('ERROR', 'URL cannot be empty.');
      return;
    }

    setUrl('');

    // Fetch to present
    // TODO: call the fetch on the url

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
    <SafeAreaView>
      <View style={styles.container}>
        <TextInputField
          label="URL"
          value={url}
          onChangeText={setUrl}
        />
        <TextButton
          text="Submit"
          onPress={submit}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 23,
  },
});

export default PresentationScreen;
