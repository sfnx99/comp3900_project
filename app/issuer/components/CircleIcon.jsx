import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CircleIcon = ({
  name,
  size,
  color,
  backgroundColor,
}) => {
  const circleSize = size + 10;
  return (
    <View
      style={[styles.circle, {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        backgroundColor,
      }]}
    >
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

CircleIcon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default CircleIcon;
