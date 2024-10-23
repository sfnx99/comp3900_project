import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';

const ToggleSwitch = ({ toggle, setToggle }) => (
  <View style={styles.view}>
    <Switch
      value={toggle}
      onValueChange={setToggle}
    />
  </View>
);

const styles = StyleSheet.create({
  view: {
    padding: 0,
    margin: 0,
  },
});

ToggleSwitch.propTypes = {
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired,
};

export default ToggleSwitch;
