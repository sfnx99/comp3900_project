import {
  View,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import TextButton from '../components/TextButton';
import { useTheme } from '../context/ThemeContext';
import { createHomeScreenStyles } from '../styles/homeScreenStyles';

import Logo from '../images/nswgov-logo.png';
import CredentialPreview from '../components/CredentialPreview';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createHomeScreenStyles(theme);
// Structure for Home Screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStylestyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>NSW Government</Text>
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
          <CredentialPreview />
          <TextButton
            text="View All Issued Credentials"
            onPress={() => navigation.navigate('CredentialHistory')}
            inverted
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
