// Example of SearchButton component
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

// Button for searching
const SearchButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text></Text>
    </TouchableOpacity>
  );
};

export default SearchButton;
