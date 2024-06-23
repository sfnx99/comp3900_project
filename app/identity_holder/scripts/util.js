/* eslint-disable react/prop-types */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isDate } from 'date-fns';

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
