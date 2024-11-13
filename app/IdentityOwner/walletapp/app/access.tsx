import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { View, Text, StyleSheet, Button, Modal, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import axios from "axios";
import { useLocalSearchParams } from 'expo-router';
import { getToken } from './script'
const IPconfig = require('./config.json')
const IPaddress = IPconfig.IPaddress

// const { token , verifier_uri } = useLocalSearchParams()
const verifier_uri = `http://${IPaddress}:8083`

const getCredentials = async () => {
  const token = await getToken();
  const res = await fetch(`http://${IPaddress}:8081/v2/credentials`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  // Parse the JSON response
  const data = await res.json();
  console.log(data)
  return data
}

const getMdoc = async (token: string | string[], verifier_url: string| string[]) => {
  const res = await fetch(`http://${IPaddress}:8081/v2/present?verifier_uri=${verifier_url}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    } 
  });
  // Parse the JSON response
  const data = await res.json();
  console.log(data)
  return data

}

export default function accessScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [credential, setCredential] = useState('');
  const [items, setItems] = useState<string[]>([])
  const [haveSet, setHaveSet] = useState<boolean>(false);
  const getInfo = async () => {
    const token = await getToken()
    // const MDoc = await getMdoc(token, verifier_uri);
    const credentials = await getCredentials();
    if (haveSet === false) {
      setItems(credentials)
      setHaveSet(true)
    }
  }
  getInfo()



  // Handle item click
  const handleItemClick = async (title: string) => {
    setSelectedTitle(title);
    setModalVisible(true); // Show the modal
  //   setCredential("1")
  //   res = await axios.post(wallet_url + "/v2/present", {
  //     verifier_uri: verifier_uri,
  //     credential_id: cred_id
  // }, {
  //     headers: {
  //         Authorization: `Bearer ${token}`
  //     }
  // });
  };
  const getCredentialName = () => {

  }
  // Render each item in the list
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleItemClick("item")} style={styles.item}>
      <Text style={styles.title}>{item}</Text>
    </TouchableOpacity>
  );
  const Header = () => {
    return (
      <View style={styles.header}>
        <Image source={{ uri: 'https://www.unsw.edu.au/content/dam/images/graphics/logos/unsw/unsw_0.png' }} style={styles.bannerImage} />
        <View style={styles.iconsContainer}>
          <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
          <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
        </View>
        <Text style={styles.label}>Choose credentials to be used:</Text>
              {/* Modal for displaying item details */}
      </View>      
    );
  };


  async function sendData() {
    const token = await getToken()
    setModalVisible(false);
    const res = await fetch(`http://${IPaddress}:8081/v2/present`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        'verifier_uri': verifier_uri,
        'credential_id': 1,
      }),
    });
  }
  return (
    <>
      <Header/>
      <FlatList<string>
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item}
      />
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedTitle} selected</Text>
            <Text style={styles.modalTitle}>Authorise?</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                 <Button title="Send" onPress={() => sendData()} />
              </View>
              <View style={styles.button}>
                 <Button title="No" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },

  // Header Styles
  header: {
    backgroundColor: '#FFCC00',
    paddingBottom: 10, // Extends header to provide space for the ID card
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    textAlign: 'center'
  },
  modalContainer: {
    width: '80%', // Set the width of the modal
    maxHeight: '50%', // Optional: limit the height
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Android shadow
    textAlign: 'center'
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign:'center'
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2, // For Android shadow
  },

  title: {
    fontSize: 18,
  },

  iconsContainer: {
    flexDirection: 'row',
    position: 'absolute', // Make this position absolute
    right: 15, // Positioning from the right
    top: 40, // Positioning from the top
  },

  icon: {
    marginLeft: 15,
  },

  bannerImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    marginTop: 35,
    marginBottom: 10
  },

  buttonContainer: {
    paddingTop:10,
    flexDirection: 'row',
    position: 'relative',
    
  },

  button: {
    marginHorizontal:10,
  }
});
