import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as LocalAuthentication from 'expo-local-authentication';

import TextButton from '../components/TextButton';
import { AccountContext } from '../context/AccountContext';
import PinSetupModal from '../components/modals/PinSetupModal';
import { ThemeContext } from '../context/ThemeContext';

const SecurityScreen = () => {
  const {
    authMethod,
    updateAuthMethod,
    pin,
  } = useContext(AccountContext);
  const { theme } = useContext(ThemeContext);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  /**
   * Check if the device is compatible with biometrics to allow
   * the biometric authentication method.
   */
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 24,
    },
    authMethodSection: {
      marginBottom: 10,
    },
    text: {
      color: theme.text,
    },
    picker: {
      backgroundColor: theme.background,
      color: theme.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.authMethodSection}>
        <Text style={styles.text}>Choose how to authenticate requests</Text>
        <Picker
          selectedValue={authMethod}
          onValueChange={async (itemValue) => { await updateAuthMethod(itemValue); }}
          style={styles.picker}
        >
          {isBiometricSupported ? (
            <Picker.Item label="Biometrics" value="biometrics" style={styles.picker} />
          ) : null }
          <Picker.Item label="Passcode" value="passcode" style={styles.picker} />
        </Picker>
      </View>

      {authMethod === 'passcode' ? (
        <TextButton
          text={pin ? 'Change Pin' : 'Set Pin'}
          onPress={() => setPinModalVisible(true)}
        />
      ) : null}

      <PinSetupModal
        modalVisible={pinModalVisible}
        onRequestClose={() => setPinModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SecurityScreen;
