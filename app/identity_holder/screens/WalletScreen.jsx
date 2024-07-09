import { useContext } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import CredentialCard from '../components/CredentialCard';
import { CredentialsContext } from '../context/CredentialsContext';

const WalletScreen = () => {
  const { credentials } = useContext(CredentialsContext);

  return (
    <ScrollView style={styles.container}>
      {credentials.map((credential) => (
        <CredentialCard
          key={credential.credential.id}
          credential={credential}
        />
      ))}
    </ScrollView>
  );
};

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.05,
    marginHorizontal: 21,
  },
});

export default WalletScreen;
