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

/**
 * Formats a camel case string into human readable text.
 * E.g. firstName to First Name.
 * @param {string} str - the string to be formatted
 * @returns the original string formatted
 */
export const formatCamelCase = (str) => {
  let formattedStr = str.replace(/([A-Z])([a-z])/g, ' $1$2');
  formattedStr = formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
  return formattedStr;
};

export const credentialPropType = PropTypes.exact({
  id: PropTypes.string.isRequired,
  issuer: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  favourite: PropTypes.bool,
  cryptosuite: PropTypes.string.isRequired,
  credential: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
});

export const notificationPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  detail: PropTypes.string,
  timestamp: isValidDate,
  type: PropTypes.oneOf(['approval', 'pending', 'location', 'location-preview']),
});
