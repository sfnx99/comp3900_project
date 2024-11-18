import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const config = require('../config.json');

const ScanScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const qrLock = useRef(false); // Ref to track whether scanning should be locked
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      qrLock.current = false;
      setScanned(false);  // Reset the scanned state when screen is focused
    }, [])
  );

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Prevent scanning if qrLock is true (i.e., if scanning is in progress)
    if (qrLock.current) return;

    // Set the lock to true to prevent further scanning
    qrLock.current = true;

    setScanned(true); // Lock the scanner

    console.log('Scanned QR code data:', data);

    // Check if the data includes the 'walletapp://verify' URL scheme
    if (data.includes('walletapp://verify')) {
      try {
        const parsedUrl = new URL(data); // Parse the URL to extract query parameters
        const uri = parsedUrl.searchParams.get('uri');
        const sp = parsedUrl.searchParams.get('sp');

        if (uri && sp) {
          // Alert to show the scanned service provider data
          Alert.alert('QR Code Scanned', `Service Provider: ${sp}`);

          // Navigate to the VerifyScreen with qrData and sp as query parameters
          router.push(`/verify?uri=${uri}&sp=${sp}`);
        } else {
          // If either qrData or sp is missing, show an alert or fallback message
          Alert.alert('Error', 'Missing or invalid QR data.');
        }
      } catch (error) {
        // Catch any errors that occur during URL parsing
        Alert.alert('Error', 'Failed to parse QR data.');
        console.error('Error parsing URL:', error);
      }
    } else {
      try {
        const jsonData = JSON.parse(data);

        const authCode = jsonData.auth_code;
        const issuerDid = jsonData.issuer_id;
        const licenseType = jsonData.type;

        const response = await fetch(`${config.wallet_url}/v2/get-code`, {
          method: 'POST',
        });

        const tokenResponse = await response.json();
        const token = tokenResponse.token;

        console.log("inside try");
        console.log(authCode);
        console.log(issuerDid);
        console.log(licenseType);
        console.log(token);

        if (!authCode || !issuerDid || !licenseType || !token) {
          throw new Error('QR scan failed');
        }

        const res = await fetch(`${config.wallet_url}/v2/issue`, {
          method: 'POST',
          body: JSON.stringify({
            issuer_id: issuerDid,
            auth_code: authCode,
            redirect_uri: config.wallet_url,
            type: licenseType,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        Alert.alert("Success", "Credential Added");
        console.log("Success. Credential has been added.");
        router.push('/home');
      } catch (err) {
        console.log(err);
        Alert.alert("Invalid QR Code");
      }
    }

    // Re-enable scanning after a delay to prevent quick re-scans
    setTimeout(() => {
      qrLock.current = false; // Release the lock
      setScanned(false); // Unlock the scanner
    }, 2000); // Adjust the delay as needed (2 seconds in this case)
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === 'android' ? <StatusBar hidden /> : null}
      <View style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.instructions}>Center the code in the box below</Text>
        </View>
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={qrLock.current ? undefined : handleBarCodeScanned} // Disable scanning while locked
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    fontSize: width * 0.045,
    marginTop: height * 0.2,
    textAlign: 'center',
    color: 'gray',
  },
  cameraWrapper: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'black',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: height * 0.2,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
