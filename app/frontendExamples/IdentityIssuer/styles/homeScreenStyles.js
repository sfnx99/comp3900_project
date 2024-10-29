import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const createHomeScreenStyles = () => (
  StyleSheet.create({
    container: {
      flex: 1,
      scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 20,
      },
      backgroundColor: '#6c9897',
      padding: width * 0.05,
    },
    header: {
      marginTop: 10,
      flex: 0.1,
      justifyContent: 'center',
    },
    welcomeText: {
      fontSize: 21,
      fontWeight: 'bold',
    },
    nameText: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    imageSection: {
      width: '100%',
      alignContent: 'center',
      marginBottom: 24,
    },
    activitySection: {
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    recentActivity: {
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
    logoContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 300,
      height: 300,
    },
  })
);
