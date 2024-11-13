import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, SafeAreaView, StatusBar, Linking } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import {  useLocalSearchParams, useRouter } from 'expo-router';
import { getToken }from '../script.js'
const router = useRouter()
const IPconfig = require('../config.json');

const IPaddress = IPconfig.IPaddress;
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

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      setScanned(true);
      setTimeout(async () => {
        await Linking.openURL(data);
        qrLock.current = false;
      }, 500);
    }
    try {
      const wallet_url = `http://${IPaddress}:8081`;
      const issuer_did_res = await fetch(`http://${IPaddress}:8082`, {});
      // const auth_res = await fetch(`http://${IPaddress}:8082/v2/authorize`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }, 
      //   body: JSON.stringify({
      //     application: {
      //       client_id: "bob@test.com",
      //       credentialType: "UNSWCredential"
      //     },
      //     client_id: "bob@test.com",
      //     client_secret: "wahoo", // Not sure what purpose of this is client_secret is here
      //     redirect_uri: wallet_url,
      //     state: "xyz",
      //     scope: "UNSWCredential"
      //   })
      // });
      // // These must be held onto by the issuer for next step of issuance
      // const res_data = await auth_res.json();
      const auth_code = "7khypg9jrh";
      const licenseType = "UNSWCredential";

      const data = await issuer_did_res.json();
      const issuer_id = data.did_uri;
      const token = await getToken();
      const res = await fetch(`http://${IPaddress}:8081/v2/issue`, {
        method: 'POST',
        body: JSON.stringify({
          issuer_id: issuer_id,
          auth_code: auth_code,
          redirect_uri: wallet_url,
          type: licenseType
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }, 
      });
      if (res.status === 200) {
        router.push({
          pathname: '/home',
        })
      } else {
        router.push('/(tabs)/scan')
      }
    } catch (err){
      // console.log(err)
    }
  };
  console.log("In credential scan page")
  handleBarCodeScanned({data: ""})
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
