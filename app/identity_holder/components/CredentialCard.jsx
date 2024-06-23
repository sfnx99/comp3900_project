import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const CredentialCard = ({ credential }) => {
  const { theme } = useContext(ThemeContext);

  const handlePress = () => {
    // TODO: Open the specific credential, passing the credential prop
  };

  const styles = StyleSheet.create({
    credential: {
      marginBottom: 30,
      alignItems: 'center',
    },
    card: {
      height: 190,
      width: '100%',
      backgroundColor: '#F2F8CA',
    },
    details: {
      flexDirection: 'row',
    },
    text: {
      marginVertical: 10,
      color: theme.text,
    },
  });

  return (
    <View style={styles.credential}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.card}
      />

      <View style={styles.details}>
        <Text style={styles.text}>{credential.cred.credName}</Text>
      </View>
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
