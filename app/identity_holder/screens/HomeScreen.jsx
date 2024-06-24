import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';
import { credentialPropType, notificationPropType } from '../scripts/util';
import { ScrollView } from 'react-native-gesture-handler';


const HomeScreen = ({ credentials, activities }) => {
  const navigation = useNavigation();

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
        <ActivityPreview activities={activities.slice(0,2)} />
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

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundColor: '#F7F7F7',
    padding: width* 0.05,
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
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  credentialsSection: {
    width: width * 0.9,
    flex: 0.4,
    justifyContent: 'space-between',
    marginBottom: 24,
    
  },
  activitySection: {
    flex: 0.5,
    justifyContent: 'space-between',
    marginBottom: -height * 0.05,
  },
  recentActivity: {
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

HomeScreen.propTypes = {
  credentials: PropTypes.arrayOf(credentialPropType),
  activities: PropTypes.arrayOf(notificationPropType),
};

export default HomeScreen;
