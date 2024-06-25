import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ThemeContext } from '../context/ThemeContext';

const TextInputField = ({
  label,
  value,
  onChangeText,
  textAlign = 'left',
  isPassword = false,
}) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      width: '95%',
      marginBottom: 20,
      borderRadius: 0,
    },
    label: {
      fontSize: 11,
      marginBottom: 5,
      color: theme.text,
      textAlign,
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

TextInputField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  textAlign: PropTypes.oneOf(['center', 'left', 'right', 'justify']),
  isPassword: PropTypes.bool,
};

export default TextInputField;
