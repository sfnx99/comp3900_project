import { useContext } from 'react';
import { ScrollView } from 'react-native';

import { CredentialsContext } from '../context/CredentialsContext';
import CredentialCard from '../components/CredentialCard';

const CredentialHistoryScreen = () => {
  const { credentials } = useContext(CredentialsContext);

  return (
    <ScrollView>
      {credentials.map((cred) => (
        <CredentialCard key={cred.credential.id} credential={cred} />
      ))}
    </ScrollView>
  );
};

export default CredentialHistoryScreen;
