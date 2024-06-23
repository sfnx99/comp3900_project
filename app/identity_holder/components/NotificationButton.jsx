import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import theme from '../styles/colors';
import ToggleSwitch from './ToggleSwitch';

const NotificationButton = ({
  text,
  toggle,
  setToggle,
}) => {
  const handleOnPress = () => {
    setToggle(!toggle);
  };

  return (
    <TouchableOpacity
      onPress={handleOnPress}
    >
      <View
        style={styles.viewOuter}
      >
        <View style={styles.viewInner}>
          <MaterialCommunityIcons
            name="bell-outline"
            color={theme.accent}
            size={20}
          />
          <Text
            style={styles.text}
          >
            {text}
          </Text>
        </View>
        <ToggleSwitch
          toggle={toggle}
          setToggle={handleOnPress}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewOuter: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 10,
    backgroundColor: theme.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: theme.text,
  },
});

NotificationButton.propTypes = {
  text: PropTypes.string.isRequired,
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired,
};

export default NotificationButton;
