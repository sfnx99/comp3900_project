import PropTypes from 'prop-types';
import {
  View,
  Text,
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

const HomeScreen = ({ activities }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { credentials } = useContext(CredentialsContext);
  const { displayName } = useContext(UserPreferenceContext);
  const styles = createHomeScreenStyles(theme);

  const favoriteCredentials = credentials.filter((cred) => cred.favourite);

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
            text="Authorize a Credential"
            onPress={() => navigation.navigate('Register User')}
            style={styles.button}
          />
        </View>
        <View style={styles.activitySection}>
          <Text style={styles.recentActivity}>Recently Presented Credentials</Text>
          <ActivityPreview activities={activities} />
          <TextButton
            text="View All Credentials Distributed"
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
