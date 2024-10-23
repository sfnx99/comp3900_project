import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';

import PropTypes from 'prop-types';
import { ThemeContext } from '../context/ThemeContext';

const SettingButton = ({ text, onPress, icon = null }) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    view: {
      padding: 20,
      paddingLeft: 10,
      paddingBottom: 15,
      backgroundColor: '#6c9897',
      flexDirection: 'row',
      alignContent: 'center',
      gap: 15,
    },
    text: {
      fontSize: 16,
      color: 'white',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <View
        style={styles.view}
      >
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            color={'white'}
            size={23}
          />
        ) : null}
        <Text
          style={styles.text}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

SettingButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
};

export default SettingButton;