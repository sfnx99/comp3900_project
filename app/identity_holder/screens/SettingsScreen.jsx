import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingButton from '../components/SettingButton';

const SettingsScreen = () => {
  const dummyFunctions = () => {
    console.log('Temporary Function');
  };

  return (
    <SafeAreaView style={styles.view}>
      <SettingButton
        text="Notifications"
        onPress={dummyFunctions}
        icon="bell-outline"
      />
      <SettingButton
        text="Activity Share Preferences"
        onPress={dummyFunctions}
        icon="key-variant"
      />
      <SettingButton
        text="Select ID Displayed Information"
        onPress={dummyFunctions}
        icon="lock-outline"
      />
      <SettingButton
        text="Dark Mode"
        onPress={dummyFunctions}
        icon="theme-light-dark"
      />
      <SettingButton
        text="Share App"
        onPress={dummyFunctions}
        icon="share-variant-outline"
      />
      <SettingButton
        text="Privacy Policy"
        onPress={dummyFunctions}
        icon="file-document-outline"
      />
      <SettingButton
        text="Terms and Conditions"
        onPress={dummyFunctions}
        icon="file-find-outline"
      />
      <SettingButton
        text="Cookie Policy"
        onPress={dummyFunctions}
        icon="email-outline"
      />
      <SettingButton
        text="Support"
        onPress={dummyFunctions}
        icon="message-outline"
      />
      <SettingButton
        text="Logout"
        onPress={dummyFunctions}
        icon="logout"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    marginHorizontal: 21,
    alignContent: 'center',
  },
});

export default SettingsScreen;
