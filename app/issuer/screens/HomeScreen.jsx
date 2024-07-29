import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useContext } from 'react';

import TextButton from '../components/TextButton';
import ActivityPreview from '../components/ActivityPreview';
import { notificationPropType } from '../scripts/util';
import { useTheme } from '../context/ThemeContext';
import { createHomeScreenStyles } from '../styles/homeScreenStyles';
import { UserPreferenceContext } from '../context/UserPreferencesContext';

import Logo from '../images/nswgov-logo.png';

const HomeScreen = ({ activities }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { displayName } = useContext(UserPreferenceContext);
  const styles = createHomeScreenStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStylestyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>
        <View style={styles.imageSection}>
          <View style={styles.logoContainer}>
            <Image
              source={Logo}
              style={styles.image}
            />
          </View>
          <TextButton
            text="Register User to Receive Credential"
            onPress={() => navigation.navigate('Register User')}
            style={styles.button}
          />
        </View>
        <View style={styles.activitySection}>
          <Text style={styles.recentActivity}>Recent Issued Credentials</Text>
          <ActivityPreview activities={activities} />
          <TextButton
            text="View All Issued Credentials"
            onPress={() => navigation.navigate('ActivityHistory')}
            inverted
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

HomeScreen.propTypes = {
  activities: PropTypes.arrayOf(notificationPropType),
};

export default HomeScreen;
