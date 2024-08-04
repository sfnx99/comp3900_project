import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import theme from '../styles/colors';
// Change colour when pressing
const TextButton = ({
  text,
  onPress,
  inverted = false,
  style,
}) => {
  const backgroundColour = inverted ? theme.background : theme.primary;
  const { width } = Dimensions.get('window');

  const styles = StyleSheet.create({
    view: {
      padding: 10,
      alignContent: 'center',
      backgroundColor: backgroundColour,
      borderColor: theme.primary,
      borderWidth: 1,
      borderRadius: 10,
      width: width * 0.85,
      justifyContent: 'center',
    },
    text: {
      color: theme.text,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <View
        style={[styles.view, style ? { ...style } : null]}
      >
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

TextButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  inverted: PropTypes.bool,
  style: PropTypes.shape(),
};

export default TextButton;
