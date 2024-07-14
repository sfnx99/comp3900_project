import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ onChange }) => {
  const [query, setQuery] = useState('');

  const handleChange = (text) => {
    setQuery(text);
    onChange(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Credential..."
        placeholderTextColor="white"
        value={query}
        onChangeText={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#7f8382',
  },
  input: {
    height: 40,
    backgroundColor: '#abaead',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D6EE41',
  },
});

export default SearchBar;
