import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';

import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import { notificationPropType } from '../scripts/util';
import { getPresentations } from '../scripts/api';
import { useTheme } from '../context/ThemeContext';
import { createHomeScreenStyles } from '../styles/homeScreenStyles';
import { CredentialsContext } from '../context/CredentialsContext';
import { UserPreferenceContext } from '../context/UserPreferencesContext';

const HomeScreen = ({ activities }) => {
  const [presentations, setPresentations] = useState([]);
  const navigation = useNavigation();
  const theme = useTheme();
  const { credentials } = useContext(CredentialsContext);
  const { displayName, coordinates } = useContext(UserPreferenceContext);
  const styles = createHomeScreenStyles(theme);

  const favoriteCredentials = credentials.filter((cred) => cred.favourite);

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const data = await getPresentations();
        const presentationsWithTimestamp = data.map(presentation => ({
          ...presentation,
          timestamp: new Date().toLocaleString(),
        }));
        setPresentations(presentationsWithTimestamp);
      } catch (error) {
        console.error("Error fetching presentations:", error);
      }
    };

    fetchPresentations();
  }, []);

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
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
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
          <View style={styles.presentationsList}>
            {presentations.map((presentation, index) => (
              <View key={index} style={styles.presentationItem}>
                <View style={styles.presentationContent}>
                  <View>
                  <Text style={styles.timestamp}>Received at: {presentation.timestamp}</Text>
                    <Text style={styles.presentationText}>
                      First Name: <Text style={styles.boldText}>{presentation.credential.firstName}</Text>
                    </Text>
                    <Text style={styles.presentationText}>
                    Last Name: <Text style={styles.boldText}>{presentation.credential.lastName}</Text>
                    </Text>
                    <Text style={styles.presentationText}>
                    Type: <Text style={styles.boldText}>{presentation.type}</Text>
                    </Text>
                  </View>
                  <Image
                    style={styles.scanIcon}
                    source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmvM5oJa7b1fwcuZHm956ZExwr3gWl0VZppg&s' }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

HomeScreen.propTypes = {
  activities: PropTypes.arrayOf(notificationPropType),
};

export default HomeScreen;
