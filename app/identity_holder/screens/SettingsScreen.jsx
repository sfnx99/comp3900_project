import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Share,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SettingButton from '../components/SettingButton';
import NotificationButton from '../components/NotificationButton';
import { ThemeContext } from '../context/ThemeContext';
import { logoutUser } from '../scripts/api';
import ErrorMessage from '../components/ErrorMessage'; // Import ErrorMessage component

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { toggleTheme } = useContext(ThemeContext);
  const [modalfirstVisible, setfirstModalVisible] = useState(false);
  const [modalsecondVisible, setsecondModalVisible] = useState(false);
  const [modalthirdVisible, setthirdModalVisible] = useState(false);
  const [error, setError] = useState(''); // State for error messages

  // TODO: Remove this once all the settings have been implemented
  const dummyFunctions = () => {};

  const logout = async () => {
    try {
      await logoutUser();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Authentication' }],
      });
    } catch (error) {
      setError(`Could not log out user: ${error}`);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Download BW Credentials',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      setError(`Error sharing the app: ${error.message}`);
    }
  };

  const clearError = () => {
    setError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.view}>
          <NotificationButton
            text="Notifications"
            icon="bell-outline"
          />
          <SettingButton
            text="Activity Share Preferences"
            onPress={dummyFunctions}
            icon="key-variant"
          />
          <SettingButton
            text="Select ID Displayed Information"
            onPress={dummyFunctions}
            icon="lock-outline"
          />
          <SettingButton
            text="Dark Mode"
            onPress={toggleTheme}
            icon="theme-light-dark"
          />
          <SettingButton
            text="Share App"
            onPress={onShare}
            icon="share-variant-outline"
          />
          <SettingButton
            text="Privacy Policy"
            onPress={() => setfirstModalVisible(true)}
            icon="file-document-outline"
          />
          <SettingButton
            text="Terms and Conditions"
            onPress={() => setsecondModalVisible(true)}
            icon="file-find-outline"
          />
          <SettingButton
            text="Cookie Policy"
            onPress={() => setthirdModalVisible(true)}
            icon="email-outline"
          />
          <SettingButton
            text="Support"
            onPress={dummyFunctions}
            icon="message-outline"
          />
          <SettingButton
            text="Logout"
            onPress={logout}
            icon="logout"
          />
        </View>
      </ScrollView>

      {/* Error Message Modals */}
      <Modal
        animationType="none"
        transparent
        visible={modalfirstVisible}
        onRequestClose={() => setfirstModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={{ fontStyle: 'italic' }}>Last Updated: July 8, 2024</Text>
                Welcome to BW Credentials, developed by Bookworms. We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our application.

                {/* Add your Privacy Policy content here */}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setfirstModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        animationType="none"
        transparent
        visible={modalsecondVisible}
        onRequestClose={() => setsecondModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Terms and Conditions</Text>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={{ fontStyle: 'italic' }}>Last Updated: July 8, 2024</Text>
                Welcome to BW Credentials, developed by Bookworms. By using our application, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully.

                {/* Add your Terms and Conditions content here */}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setsecondModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cookie Policy Modal */}
      <Modal
        animationType="none"
        transparent
        visible={modalthirdVisible}
        onRequestClose={() => setthirdModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cookie Policy</Text>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={{ fontStyle: 'italic' }}>Last Updated: July 8, 2024</Text>
                This Cookies Policy explains how BW Credentials, developed by Bookworms, uses cookies and similar technologies when you use our app. By continuing to use our app, you agree to our use of cookies as described in this policy.

                {/* Add your Cookie Policy content here */}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setthirdModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Message Component */}
      <Modal
        animationType="none"
        transparent={true}
        visible={!!error} // Display error modal if error state is not empty
        onRequestClose={clearError}
      >
        <ErrorMessage message={error} onPress={clearError} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  view: {
    marginHorizontal: 21,
    alignContent: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width: '87%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: '#D6EE41',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'normal',
  },
});

export default SettingsScreen;
