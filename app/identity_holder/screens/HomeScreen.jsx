import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';
import { credentialPropType, notificationPropType } from '../scripts/util';

const HomeScreen = ({ credentials, activities }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <ActivityPreview activities={activities} />
        <TextButton
          text="View All Activity History"
          onPress={() => navigation.navigate('ActivityHistory')}
          inverted
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 16,
    marginHorizontal: 24,
  },
  header: {
    flex: 0.15,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  credentialsSection: {
    flex: 0.35,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  activitySection: {
    flex: 0.5,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
});

HomeScreen.propTypes = {
  credentials: PropTypes.arrayOf(credentialPropType),
  activities: PropTypes.arrayOf(notificationPropType),
};

export default HomeScreen;
