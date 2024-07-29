import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            title="My Location"
            description="Here I am"
          />
        </MapView>
        <View style={styles.credentialsSection}>
          <CredentialsCarousel credentials={favoriteCredentials} />
          <TextButton
            text="Trust A New Credential Issuer"
            onPress={() => navigation.navigate('Trust Issuer')}
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
