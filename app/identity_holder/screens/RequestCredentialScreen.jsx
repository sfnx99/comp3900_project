import React, {useState} from 'react';
import { Text, TextInput, TouchableOpacity, Alert, View, ScrollView, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/request';

// const RequestCredentialScreen = () => {
//   const handlePress = () => {
//     Alert.alert('Button Pressed', 'You pressed the button!');
//   };

export default function RequestCredentialScreen({ navigation }) {

  const [typeofID, setID] = useState('');
  const [docnumb, setdocnumb] = useState('');
  const [FullName, setFullName] = useState('');
  const [Pnumber, setPnumber] = useState('');
  const [address, setAddress] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  // const handleSubmit = () => {
  //   console.log('Credential Requested:', { name, email, password });
  // };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>


        <View style={styles.inputContainer}>
            <Text style={styles.label}>Form Of Identification Required</Text>
            <TextInput
              style={styles.input}
              value={typeofID}
              onChangeText={setID}
            />
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>Document Number</Text>
            <TextInput
              style={styles.input}
              value={docnumb}
              onChangeText={setdocnumb}
            />
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={FullName}
              onChangeText={setFullName}
            />
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={Pnumber}
              onChangeText={setPnumber}
              keyboardType="phone-pad"
            />
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          </View>
          <TouchableOpacity 
            style={[styles.button, isPressed && styles.buttonHover]} 
            onPress={() => navigation.navigate("EditInfo")}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}  
          >
            <Text style={styles.buttonText}>Submit Request</Text>
          </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
};

// export default RequestCredentialScreen;
