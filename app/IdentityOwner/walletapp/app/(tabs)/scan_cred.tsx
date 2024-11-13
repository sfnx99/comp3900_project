import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, SafeAreaView, StatusBar, Linking } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import {  useLocalSearchParams, useRouter } from 'expo-router';

const router = useRouter()

const { width, height } = Dimensions.get('window');

const ScanScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const qrLock = useRef(false);

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

  const { token } = useLocalSearchParams()

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    try {
      const auth_code = JSON.stringify(JSON.parse(data).auth_code)
      const licenseType = JSON.stringify(JSON.parse(data).type)
      const issuer_id = JSON.stringify(JSON.parse(data).issuer_id)
      const wallet_url = JSON.parse(data).redirect_uri
      const res = await fetch(`${wallet_url}/v2/issue`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${token}`
        }, 
        body: JSON.stringify({
          issuer_id: issuer_id,
          auth_code: auth_code,
          redirect_uri: wallet_url,
          type: licenseType
        })
      });
      router.push({
        pathname: '/home',
        params: { 
          token: token,
          verifier_url: ""
        }
      })
    } catch {
      router.push({
        pathname: '/access',
        params: { 
          token: token,
          verifier_url: ""
        }
      })
    }
      // if (res.status === 200) {
      //   router.push('/access')
      // } else {
      //   router.push('/home')
      // }
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
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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
