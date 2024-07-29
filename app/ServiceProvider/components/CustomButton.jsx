import PropType from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ style, title, onPress }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'normal',
  },
});

CustomButton.propTypes = {
  style: PropType.shape({
    backgroundColor: PropType.string,
    paddingVertical: PropType.number,
    paddingHorizontal: PropType.number,
    marginVertical: PropType.number,
    borderRadius: PropType.number,
    width: PropType.number,
    alignItems: PropType.string,
  }),
  title: PropType.string,
  onPress: PropType.func,
};

export default CustomButton;
