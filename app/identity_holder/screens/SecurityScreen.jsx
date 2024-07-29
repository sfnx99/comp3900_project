import { SafeAreaView, Text } from 'react-native';
import { useContext, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import TextButton from '../components/TextButton';
import { AccountContext } from '../context/AccountContext';
import PinSetupModal from '../components/modals/PinSetupModal';

const SecurityScreen = () => {
  const {
    authMethod,
    updateAuthMethod,
    pin,
    updatePin,
  } = useContext(AccountContext);
  const navigation = useNavigation();
  const [pinModalVisible, setPinModalVisible] = useState(false);

  return (
    <SafeAreaView>
      <Text>Choose how to authenticate requests</Text>
      <Picker
        selectedValue={authMethod}
        onValueChange={async (itemValue) => { await updateAuthMethod(itemValue); }}
      >
        <Picker.Item label="Biometrics" value="biometrics" />
        <Picker.Item label="Passcode" value="passcode" />
      </Picker>

      <TextButton
        text={pin ? 'Change Pin' : 'Set Pin'}
        onPress={() => setPinModalVisible(true)}
      />

      <PinSetupModal
        modalVisible={pinModalVisible}
        onRequestClose={() => setPinModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SecurityScreen;
