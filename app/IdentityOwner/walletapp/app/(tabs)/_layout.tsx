import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import { useRouter } from 'expo-router';  // Correct hook for navigation

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

const TabsLayout = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Header />
      <Tabs>
       
      <Tabs.Screen
          name="scan"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="scan-outline" color={focused ? 'red' : 'black'} size={size} />
            ),
            title: 'Scan',
            headerShown: false, 
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="home-outline" color={focused ? 'red' : 'black'} size={size} />
            ),
            title: 'Home',
            headerShown: false, 
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name="wallet-outline" color={focused ? 'red' : 'black'} size={size} />
            ),
            title: 'Wallet',
            headerShown: false, 
            
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;

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