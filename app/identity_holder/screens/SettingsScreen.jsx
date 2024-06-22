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
      />
      <SettingButton
        text="Activity Share Preferences"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Select ID Displayed Information"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Dark Mode"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Share App"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Privacy Policy"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Terms and Conditions"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Cookie Policy"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Support"
        onPress={dummyFunctions}
      />
      <SettingButton
        text="Logout"
        onPress={dummyFunctions}
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
