import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { renderIconByName } from '../scripts/util';

const SearchButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.searchButton}>
    {renderIconByName('magnify', onPress, { size: 30 })}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  searchButton: {
    paddingRight: 15,
  },
});

export default SearchButton;
