import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import CredentialCard from '../components/CredentialCard';

const WalletScreen = ({ credentials }) => (
  <ScrollView style={styles.container}>
    {credentials.map((credential) => (
      <CredentialCard
        key={credential.id}
        credential={credential}
      />
    ))}
  </ScrollView>
);

WalletScreen.propTypes = {
  credentials: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    iss: PropTypes.string,
    cred: PropTypes.shape(),
  })).isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 21,
  },
});

export default WalletScreen;
