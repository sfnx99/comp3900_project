import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ErrorMessage = ({ message, onPress }) => {
  if (!message) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(00, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'grey',
    padding: 20,
    borderRadius: 10,
    maxWidth: '80%',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'normal',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default ErrorMessage;
