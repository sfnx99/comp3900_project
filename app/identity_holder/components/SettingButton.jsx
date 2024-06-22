import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import theme from '../styles/colors';

const SettingButton = ({ text, onPress, icon = null }) => (
  <TouchableOpacity
    onPress={onPress}
  >
    <View
      style={styles.view}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          color={theme.accent}
          size={20}
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

const styles = StyleSheet.create({
  view: {
    padding: 10,
    paddingBottom: 15,
    backgroundColor: theme.background,
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
  },
  text: {
    color: theme.text,
  },
});

SettingButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
};

export default SettingButton;
