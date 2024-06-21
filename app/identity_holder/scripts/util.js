import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Renders an icon from MaterialCommunityIcons.
 * See https://static.enapter.com/rn/icons/material-community.html
 * for icons.
 * 
 * @param {string} name - The name of the icon to render.
 * @param {*} props - Extra props to add to the button.
 * @returns a react element with the rendered icon.
 */
export const renderIconByName = (name, props=null) => {
  return ({ color, size }) => (
    <MaterialCommunityIcons
      name={name}
      color={color}
      size={size}
      {...props}
    />
  );
}
