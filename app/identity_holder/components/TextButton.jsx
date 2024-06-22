import { Text, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import theme from '../styles/colors';

const TextButton = ({ text, onPress, inverted = false }) => {
  const backgroundColour = inverted ? theme.background : theme.primary;

  const styles = StyleSheet.create({
    view: {
      padding: 10,
      backgroundColor: backgroundColour,
      borderColor: theme.primary,
      borderWidth: 1,
      borderRadius: 10,
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
        style={styles.view}
      >
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

TextButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  inverted: PropTypes.bool.isRequired,
};

export default TextButton;
