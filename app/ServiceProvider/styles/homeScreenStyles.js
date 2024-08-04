import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const createHomeScreenStyles = (theme) => (
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#7f8382',
      padding: width * 0.05,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 20,
    },
    header: {
      marginTop: 10,
      marginBottom: 10,
      flex: 0.1,
      justifyContent: 'flex-start',
      width: '100%',
      paddingHorizontal: 16,
    },
    welcomeText: {
      fontSize: 21,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'left',
    },
    nameText: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      color: 'white',
      textAlign: 'left',
    },
    map: {
      width: width * 0.9,
      height: height * 0.3,
      marginBottom: -194,
      borderRadius: 20,
    },
    credentialsSection: {
      width: width * 0.9,
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    activitySection: {
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    recentActivity: {
      color: 'white',
      marginTop: 10,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    button: {
      marginTop: 8,
      marginBottom: 0,
      width: width * 0.9,
    },
    presentationItem: {
      width: width * 0.9,
      padding: 16,
      marginBottom: 16,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#cccccc',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    presentationContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    presentationText: {
      marginBottom: 4,
      fontSize: 16,
      color: '#333333',
    },
    boldText: {
      fontWeight: 'bold',
    },
    timestamp: {
      fontSize: 14,
      color: '#666666',
      marginBottom: 8,
    },
    scanIcon: {
      width: 24,
      height: 24,
      marginLeft: 16,
    },
  })
);
