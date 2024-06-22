/* eslint-disable react/prop-types */
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
