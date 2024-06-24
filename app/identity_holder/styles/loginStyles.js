import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    text: {
      fontSize: 24,
      marginBottom: 20,
      color: '#fff',
    },
    logo: {
      width: 250,
      height: 250,
      marginBottom: 20,
    },
    button: {
        backgroundColor: '#D6EE41', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 20 ,
        borderRadius: 5,
        width: width * 0.95, 
        alignItems: 'center',
      },
  });
  
export default styles;
