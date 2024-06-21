import { MaterialCommunityIcons } from "@expo/vector-icons";

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
