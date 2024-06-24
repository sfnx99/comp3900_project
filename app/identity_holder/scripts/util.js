/* eslint-disable react/prop-types */
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  }).isRequired,
});

export const notificationPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  detail: PropTypes.string,
  timestamp: isValidDate,
  type: PropTypes.oneOf(['approval', 'pending', 'location', 'location-preview']),
});
