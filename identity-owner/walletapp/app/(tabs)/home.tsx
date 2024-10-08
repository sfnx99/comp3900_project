import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>

          <View style={styles.headerIcons}>
      
          </View>
        </View>
      </View>

      {/* Favourites Section */}
      <View style={styles.favouritesContainer}>
        <Text style={styles.sectionTitle}>Favourites</Text>
        <View style={styles.idCard}>
          <Text style={styles.cardTitle}>University Credentials</Text>
          <Text>Expiry: 02.02.2027</Text>
          <Text>UNSW</Text>
          <View style={styles.status}>
            <Text style={styles.statusText}>Valid</Text>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Check a license or credential</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add a credential</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header Styles
  header: {
    backgroundColor: '#FFCC00',
    paddingBottom: 80, // Extends header to provide space for the ID card
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    width: 50,
    justifyContent: 'space-between',
  },

  // Favourites Section Styles
  favouritesContainer: {
    marginTop: -50, // Moves the card upwards into the header area
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  idCard: {
    backgroundColor: '#fff',
    borderRadius: 15, // Rounded corners for the ID card look
    padding: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Services Section Styles
  section: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});
