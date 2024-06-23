import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import CredentialCard from '../components/CredentialCard';

const WalletScreen = ({ credentials }) => (
  <ScrollView>
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

export default WalletScreen;
