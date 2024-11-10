import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6c9897',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
  },
  subtitletext: {
    fontSize: 24,
    fontWeight: 'bold',
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
    marginVertical: 5, // 20
    borderRadius: 5,
    width: width * 0.95,
    alignItems: 'center',
  },
  buttonInverted: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10, // 20
    borderRadius: 5,
    width: width * 0.95,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  registerText: {
    color: '#D6EE41',
  },
});

export default styles;
