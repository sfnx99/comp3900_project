import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const Wallet = () => {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  const toggleSensitiveInfo = () => {
    setShowSensitiveInfo(!showSensitiveInfo);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student ID Card</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusValid}>
            <Text style={styles.statusText}>Valid</Text>
          </View>
          <Ionicons name="settings-outline" size={24} color="black" style={styles.icon} />
          <Pressable onPress={toggleSensitiveInfo} style={styles.icon}>
            <Ionicons
              name={showSensitiveInfo ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.licenseInfo}>
        <Ionicons name="person-circle-outline" size={80} color="black" style={styles.profileIcon} />
        <Text style={styles.infoText}>
          zID: {showSensitiveInfo ? 'z5555555' : '••••••••'}
        </Text>
        <Text style={styles.infoText}>
          Date of Expiry: 02.02.2027
        </Text>
        <Text style={styles.infoText}>
          Date of Birth: {showSensitiveInfo ? '16 SEP 2003' : '••••••••'}
        </Text>
        <Text style={styles.infoText}>
          Class: C
        </Text>
        <Text style={styles.infoText}>
          Conditions: None
        </Text>
        <Text style={styles.infoText}>
          Address: {showSensitiveInfo ? '42 Wallaby Way, Sydney NSW 2000' : '••••••••••••••••••••••••'}
        </Text>
      </View>

      <View style={styles.qrContainer}>
        <Image 
          source={{ uri: 'https://example-qr-code-link.com' }} 
          style={styles.qrCode}
        />
        <Text style={styles.cardNumber}>Card Number: 2000000000</Text>
      </View>

      <Image
        source={{ uri: 'https://example.com/nsw-logo.png' }} 
        style={styles.logo}
      />
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusValid: {
    backgroundColor: 'green',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
  licenseInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  profileIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  cardNumber: {
    fontSize: 14,
    color: 'gray',
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
  },
});
