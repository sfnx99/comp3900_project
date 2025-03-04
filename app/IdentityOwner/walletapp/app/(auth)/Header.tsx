import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={{ uri: 'https://www.unsw.edu.au/content/dam/images/graphics/logos/unsw/unsw_0.png' }} style={styles.bannerImage} />
      <View style={styles.iconsContainer}>
        <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
        <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo : {
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFCC00',
  },
  bannerImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    marginTop: 35,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  icon: {
    marginLeft: 15,
  }
});


  export default Header;