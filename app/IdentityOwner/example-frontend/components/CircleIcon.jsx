import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CircleIcon = ({
  name,
  size,
  color,
  backgroundColor,
  padding = 10,
}) => {
  const circleSize = size + padding;

  const styles = StyleSheet.create({
    circle: {
      justifyContent: 'center',
      alignItems: 'center',
      width: circleSize,
      height: circleSize,
      borderRadius: 100,
      backgroundColor,
    },
  });

  return (
    <View
      style={styles.circle}
    >
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
};

CircleIcon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  padding: PropTypes.number,
};

export default CircleIcon;
