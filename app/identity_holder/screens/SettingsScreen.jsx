import { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SettingButton from '../components/SettingButton';
import NotificationButton from '../components/NotificationButton';
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [toggle, setToggle] = useState(false);
  const { toggleTheme } = useContext(ThemeContext);

  // TODO: Remove this once all the settings have been implemented
  const dummyFunctions = () => {};

  // TODO: Still WIP until authentication is implemented
  const logout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.view}>
          <NotificationButton
            text="Notifications"
            icon="bell-outline"
            toggle={toggle}
            setToggle={() => setToggle(!toggle)}
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
            onPress={toggleTheme}
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
            onPress={logout}
            icon="logout"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  view: {
    // marginTop: -height * 0.04,
    marginHorizontal: 21,
    alignContent: 'center',
  },
});

export default SettingsScreen;
