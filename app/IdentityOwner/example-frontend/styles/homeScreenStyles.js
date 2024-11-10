import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const createHomeScreenStyles = (theme) => (
  StyleSheet.create({
    container: {
      flex: 1,
      scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 20,
      },
      backgroundColor: theme.backgroundColor,
      padding: width * 0.05,
    },
    header: {
      marginTop: 10,
      marginBottom: 10,
      flex: 0.1,
      justifyContent: 'center',
    },
    welcomeText: {
      fontSize: 21,
      fontWeight: 'bold',
      color: theme.text,
    },
    nameText: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 24,
      color: theme.text,
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
      color: theme.text,
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
    qrButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 1,
    },
  })
);
