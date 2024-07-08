import { useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import SettingButton from '../components/SettingButton';
import NotificationButton from '../components/NotificationButton';
import { ThemeContext } from '../context/ThemeContext';
import { logoutUser } from '../scripts/api';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { toggleTheme } = useContext(ThemeContext);

  // TODO: Remove this once all the settings have been implemented
  const dummyFunctions = () => {};

  const logout = async () => {
    try {
      await logoutUser();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Authentication' }],
      });
    } catch (error) {
      Alert.alert(`Could not log out user: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.view}>
          <NotificationButton
            text="Notifications"
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
    marginHorizontal: 21,
    alignContent: 'center',
  },
});

export default SettingsScreen;
