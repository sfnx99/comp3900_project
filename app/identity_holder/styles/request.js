import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    marginTop: '20px'
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
    fontSize: 16,
    marginBottom: 5,
    color: '#888', // Label text color
  },
  inputContainer: {
    width: '95%', // 90% of the screen width
    marginBottom: 20,
  },
  input: {
    width: '100%', // 90% of the screen width
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#000000',
    paddingLeft: '10px',
    borderRadius: 0,
    marginBottom: 10,
    backgroundColor: '#F5FFB9',
  },
  placeholder: {
    color: '#888', // Placeholder text color
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 30, // Adjust this value to set the distance from the bottom
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#D6EE41', // Fluoro yellow color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: width * 0.95, // 90% of the screen width
    alignItems: 'center',
  },
  buttonHover: {
    backgroundColor: '#C0C000', // Slightly darker yellow for hover effect
  },
  buttonText: {
    color: '#000', // Black text
    fontSize: 16,
    textAlign: 'center',
  },
});

export default styles;
