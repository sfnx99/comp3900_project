import { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Share,
  Modal,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import SettingButton from '../components/SettingButton';
import NotificationButton from '../components/NotificationButton';
import { ThemeContext } from '../context/ThemeContext';
import { logoutUser } from '../scripts/api';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { toggleTheme } = useContext(ThemeContext);
  const [modalfirstVisible, setfirstModalVisible] = useState(false);
  const [modalsecondVisible, setsecondModalVisible] = useState(false);
  const [modalthirdVisible, setthirdModalVisible] = useState(false);

  // TODO: Remove this once all the settings have been implemented
  const dummyFunctions = () => {};

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
      console.error('Error sharing the app:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
  <View style={styles.view}>
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
      text="Logout"
      onPress={() => navigation.reset({
        index: 0,
        routes: [{ name: 'Authentication' }],
      })}
      icon="logout"
    />
  </View>
</ScrollView>

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

                <Text style={{fontStyle: 'italic'}}>Last Updated: July 8, 2024 {'\n\n'}</Text>

                Welcome to BW Credentials, developed by Bookworms. We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our application. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> 1. Information We Collect {'\n\n'} </Text>

                We may collect the following types of information: {'\n\n'}

                Personal Information: Information that you provide to us, such as your name, email address, and other contact details when you create an account. {'\n\n'}
                Usage Data: Information about how you use our app, such as the features you interact with, the time spent on the app, and the pages visited. {'\n\n'}
                Device Information: Information about the device you use to access our app, including device type, operating system, and unique device identifiers. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> 2. How We Use Your Information {'\n\n'} </Text>
                We use the information we collect for various purposes, including: {'\n\n'}

                To provide and maintain our app. {'\n\n'}
                To improve and personalize your experience. {'\n\n'}
                To communicate with you, including sending updates and notifications. {'\n\n'}
                To analyze usage patterns and improve our services. {'\n\n'}
                To protect the security and integrity of our app. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}>3. Sharing Your Information {'\n\n'}</Text>  
                We do not sell or share your personal information with third parties except in the following circumstances:{'\n\n'}

                <Text style={{fontWeight: 'bold'}}>4. Contact Us {'\n\n'}</Text>
                If you have any questions or concerns about this Privacy Policy, please contact us at: {'\n\n'}

                Email: z5309136@ad.unsw.edu.au {'\n\n'}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setfirstModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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

                <Text style={{fontStyle: 'italic'}}>Last Updated: July 8, 2024 {'\n\n'}</Text>

                Welcome to BW Credentials, developed by Bookworms. By using our application, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> 1. Acceptance of Terms {'\n\n'} </Text>

                We may collect the following types of information: {'\n\n'}

                By accessing and using BW Credentials, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the app. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> 2. Use of the app {'\n\n'} </Text>
                You agree to use the app only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the app {'\n\n'}

                You also agree not to misuse the app or engage in any activity that could damage, disable, overburden, or impair any Bookworms server or the networks connected to any Bookworms server. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}>3. User Accounts {'\n\n'}</Text>  
                To access certain features of the app, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account {'\n\n'}
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}>4. Intellectual Property {'\n\n'}</Text>
                All content and materials available on the app, including but not limited to text, graphics, website name, code, images, and logos are the intellectual property of Bookworms and are protected by applicable copyright and trademark law.{'\n\n'}
                Any inappropriate use, including but not limited to the reproduction, distribution, display, or transmission of any content on this site is strictly prohibited unless specifically authorized by Bookworms. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}>5. Privacy Policy{'\n\n'}</Text>
                Your use of the app is also subject to our Privacy Policy. Please review our Privacy Policy, which explains how we collect, use, and protect your personal information.{'\n\n'}

                <Text style={{fontWeight: 'bold'}}>6. Changes to Terms{'\n\n'}</Text>
                We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page with an updated revision date. By continuing to use the app after any changes, you accept and agree to the modified Terms and Conditions.{'\n\n'}

              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setsecondModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

                <Text style={{fontStyle: 'italic'}}>Last Updated: July 8, 2024 {'\n\n'}</Text>

                This Cookies Policy explains how BW Credentials, developed by Bookworms, uses cookies and similar technologies when you use our app. By continuing to use our app, you agree to our use of cookies as described in this policy. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> 1. What Are Cookies? {'\n\n'}</Text>
                Cookies are small text files that are placed on your device when you visit a website or use an app. {'\n\n'}
                They are widely used to make websites and apps work more efficiently, as well as to provide information to the owners of the site or app. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> 2. How We Use Cookies? {'\n\n'}</Text>

                We use cookies for various reasons, including: {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> Authentication: </Text>  To keep you logged in and recognize you when you return to our app. {'\n\n'}
                <Text style={{fontWeight: 'bold'}}> Preferences: </Text> To remember your settings and preferences. {'\n\n'}

                They are widely used to make websites and apps work more efficiently, as well as to provide information to the owners of the site or app. {'\n\n'}

                <Text style={{fontWeight: 'bold'}}> 3. Types of Cookies We Use? {'\n\n'}</Text>

                <Text style={{fontWeight: 'bold'}}> Essential Cookies: </Text>  These cookies are necessary for the app to function and cannot be switched off in our systems. {'\n\n'}
                <Text style={{fontWeight: 'bold'}}> Performance Cookies </Text> These cookies help us understand how users interact with our app by collecting and reporting information anonymously. {'\n\n'}
                <Text style={{fontWeight: 'bold'}}> Functionality Cookies </Text> These cookies allow the app to remember choices you make and provide enhanced, more personalized features. {'\n\n'}


              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setthirdModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c9897',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'top',
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
