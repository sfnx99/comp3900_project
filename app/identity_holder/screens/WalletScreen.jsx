import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
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
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginTop: height*0.05,
    marginHorizontal: 21,
  },
});

export default WalletScreen;
