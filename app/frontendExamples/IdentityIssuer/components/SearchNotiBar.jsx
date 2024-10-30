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
        placeholder="Search Notification..."
        placeholderTextColor="black"
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
    backgroundColor: '#F6F8FA',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D6EE41',
  },
});

export default SearchBar;
