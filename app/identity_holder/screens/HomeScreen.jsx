import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useContext } from 'react';

import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';
import { notificationPropType } from '../scripts/util';
import { useTheme } from '../context/ThemeContext';
import { createHomeScreenStyles } from '../styles/homeScreenStyles';
import { CredentialsContext } from '../context/CredentialsContext';
import { UserPreferenceContext } from '../context/UserPreferencesContext';
import CircleIcon from '../components/CircleIcon';

// Home Screen with display name from User Context, Credentials and Main Navigation
const HomeScreen = ({ activities }) => {
  const navigation = useNavigation();
  const { credentials } = useContext(CredentialsContext);
  const { displayName } = useContext(UserPreferenceContext);

  const theme = useTheme();
  const styles = createHomeScreenStyles(theme);

  const favoriteCredentials = credentials.filter((cred) => cred.favourite);
  // Structure of Home Screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStylestyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>
        <View style={styles.credentialsSection}>
          <CredentialsCarousel credentials={favoriteCredentials} />
          <TextButton
            text="View All Credentials"
            onPress={() => navigation.navigate('WalletStack', { screen: 'Wallet' })}
            style={styles.button}
          />
        </View>
        <View style={styles.activitySection}>
          <Text style={styles.recentActivity}>Recent Activity</Text>
          <ActivityPreview activities={activities} />
          <TextButton
            text="View All Activity History"
            onPress={() => navigation.navigate('ActivityHistory')}
            inverted
            style={styles.button}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('PresentationScreen')}
        style={styles.qrButton}
      >
        <CircleIcon
          name="qrcode-scan"
          size={24}
          backgroundColor="#D6EE41"
          padding={20}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

HomeScreen.propTypes = {
  activities: PropTypes.arrayOf(notificationPropType),
};

export default HomeScreen;
