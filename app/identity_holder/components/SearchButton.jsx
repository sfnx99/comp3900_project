import { StyleSheet } from 'react-native';
import { renderIconByName } from '../scripts/util';

const styles = StyleSheet.create({
  searchButton: {
    paddingTop: 25,
  },
});

const SearchButton = (onPress) => renderIconByName('magnify', onPress, { size: 30, style: styles.searchButton });

export default SearchButton;
