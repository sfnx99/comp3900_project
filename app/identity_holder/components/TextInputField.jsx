import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import { ThemeContext } from '../context/ThemeContext';
import show from '../images/hide.png';
import hide from '../images/show.png';

const { height } = Dimensions.get('window');
// Style and values for text input boxes
const TextInputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  textAlign = 'left',
  isPassword = false,
  keyboardType = 'default',
}) => {
  const { theme } = useContext(ThemeContext);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const styles = StyleSheet.create({
    container: {
      width: '97%',
      marginBottom: 20,
      borderRadius: 0,
    },
    label: {
      fontSize: 11,
      marginBottom: 5,
      color: theme.text,
      textAlign,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 0.2,
      borderColor: '#000000',
      borderRadius: 10,
      backgroundColor: '#F5FFB9',
      paddingHorizontal: 10,
      height: height * 0.052,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      color: theme.text,
    },
    toggleButton: {
      paddingHorizontal: 10,
    },
    eyeIcon: {
      width: 24,
      height: 24,
    },
  });

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholder={placeholder}
          placeholderTextColor="#000000"
          keyboardType={keyboardType}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
          >
            <Image
              source={isPasswordVisible ? show : hide}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

TextInputField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  textAlign: PropTypes.oneOf(['center', 'left', 'right', 'justify']),
  isPassword: PropTypes.bool,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
};

export default TextInputField;
