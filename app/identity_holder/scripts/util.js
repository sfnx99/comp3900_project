import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { isDate } from 'date-fns';
import PropTypes from 'prop-types';

/**
 * Renders an icon from MaterialCommunityIcons.
 * See https://static.enapter.com/rn/icons/material-community.html
 * for icons.
 *
 * @param {string} name - The name of the icon to render.
 * @param {*} props - Extra props to add to the button.
 * @returns a react element with the rendered icon.
 */
export const renderIconByName = (name, onPress, props = null) => ({ color, size }) => (
  <MaterialCommunityIcons
    name={name}
    color={color}
    size={size}
    onPress={onPress}
    {...props}
  />
);

/**
 * Prop validation function when prop is a Date object from date-fns.
 */
export const isValidDate = (props, propName, componentName) => {
  if (!isDate(props[propName])) {
    return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a valid date object.`);
  }
  return null;
};

export const credentialPropType = PropTypes.exact({
  id: PropTypes.string.isRequired,
  iss: PropTypes.string.isRequired,
  cred: PropTypes.shape({
    credName: PropTypes.string,
    expiryDate: isValidDate,
  }).isRequired,
});

export const notificationPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  detail: PropTypes.string,
  timestamp: isValidDate,
  type: PropTypes.oneOf(['approval', 'pending', 'location', 'location-preview']),
});

/**
 * Save a key-value pair in expo secure store.
 * @param {string} key - the key of the key-value pair.
 * @param {*} value - the value belonging to the key.
 */
export const save = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

/**
 * Retrieve a value from expo secure store by key.
 * @param {string} key - key of the value being retrieved.
 * @returns value of the key from secure storage.
 */
export const getValueFor = async (key) => {
  const value = await SecureStore.getItemAsync(key);
  return value;
};
