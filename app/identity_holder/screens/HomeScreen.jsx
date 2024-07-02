import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';
import { credentialPropType, notificationPropType } from '../scripts/util';
import { useTheme } from '../context/ThemeContext';
import { createHomeScreenStyles } from '../styles/homeScreenStyles';

const HomeScreen = ({ credentials, activities }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createHomeScreenStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStylestyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>Jessica</Text>
        </View>
        <View style={styles.credentialsSection}>
          <CredentialsCarousel credentials={credentials} />
          <TextButton
            text="View All Credentials"
            onPress={() => navigation.navigate('Wallet')}
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
    </SafeAreaView>
  );
};

HomeScreen.propTypes = {
  credentials: PropTypes.arrayOf(credentialPropType),
  activities: PropTypes.arrayOf(notificationPropType),
};

export default HomeScreen;
