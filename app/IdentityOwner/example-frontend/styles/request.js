import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // marginTop: '10px'
  },
  scrollContent: {
    marginTop: 50,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    marginBottom: 5,
    color: 'black',
  },
  inputContainer: {
    width: '95%',
    marginBottom: 20,
    borderRadius: 0,
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 0.2,
    borderColor: '#000000',
    paddingLeft: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5FFB9',
  },
  inputError: {
    borderWidth: 0.5,
    borderColor: 'red',
    borderRadius: '3px',
  },
  placeholder: {
    color: '#888',
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#D6EE41',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
    width: width * 0.95,
    alignItems: 'center',
  },
  buttonHover: {
    backgroundColor: '#C0C000',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  Text: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  Text2: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 0,
    fontWeight: 'light',
  },
});

export default styles;
