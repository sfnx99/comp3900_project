import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { ThemeContext } from '../context/ThemeContext';

const CredentialCard = ({ credential }) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    credential: {
      flexDirection: 'row',
    },
  });

  return (
    <View style={styles.credential}>
      <Text>{credential.id}</Text>
      <Text>{credential.iss}</Text>
      <Text>{credential.cred.name}</Text>
    </View>
  );
};
CredentialCard.propTypes = {
  credential: PropTypes.exact({
    id: PropTypes.string,
    iss: PropTypes.string,
    cred: PropTypes.shape(),
  }).isRequired,
};

export default CredentialCard;
