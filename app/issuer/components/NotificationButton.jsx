import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import theme from '../styles/colors';
import ToggleSwitch from './ToggleSwitch';
import { UserPreferenceContext } from '../context/UserPreferencesContext';

const NotificationButton = ({ text }) => {
  const { notificationsOn, toggleNotifications } = useContext(UserPreferenceContext);

  return (
    <TouchableOpacity
      onPress={toggleNotifications}
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
          toggle={notificationsOn}
          setToggle={toggleNotifications}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewOuter: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
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
    gap: 15,
  },
  text: {
    color: theme.text,
    fontSize: 16,
  },
});

NotificationButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default NotificationButton;
