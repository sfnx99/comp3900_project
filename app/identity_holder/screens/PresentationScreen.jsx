import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useState } from 'react';

import TextInputField from '../components/TextInputField';
import TextButton from '../components/TextButton';
import SelectCredentialModal from '../components/modals/SelectCredentialModal';

const PresentationScreen = () => {
  const [url, setUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [presentData, setPresentData] = useState(null);

  const submit = () => {
    if (!url) {
      Alert.alert('ERROR', 'URL cannot be empty.');
      return;
    }

    setUrl('');
    // Fetch to present
    setPresentData({
      type: 'CredentialType1',
      requiredAttributes: ['firstName', 'lastName'],
    });

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setPresentData(null);
    setModalOpen(false);
  };

  return (
    <>
      {
        presentData ? (
          <SelectCredentialModal
            modalVisible={modalOpen}
            handleModalClose={handleModalClose}
            presentData={presentData}
          />
        ) : null
      }
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 23,
  },
});

export default PresentationScreen;
