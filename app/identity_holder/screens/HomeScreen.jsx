import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';
import { credentialPropType, notificationPropType } from '../scripts/util';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = ({ credentials, activities }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const { width } = Dimensions.get('window');
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 20,
      },
      backgroundColor: theme.backgroundColor,
      padding: width * 0.05,
    },
    header: {
      marginTop: 10,
      marginBottom: 10,
      flex: 0.1,
      justifyContent: 'center',
    },
    welcomeText: {
      fontSize: 21,
      fontWeight: 'bold',
      color: theme.text,
    },
    nameText: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 24,
      color: theme.text,
    },
    credentialsSection: {
      width: width * 0.9,
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    activitySection: {
      justifyContent: 'space-between',
      marginBottom: 20, // -height * 0.05,
    },
    recentActivity: {
      color: theme.text,
      marginTop: 20,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    button: {
      marginTop: 8,
      marginBottom: 20,
    },
  });

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
          <ActivityPreview activities={activities.slice(0, 2)} />
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
