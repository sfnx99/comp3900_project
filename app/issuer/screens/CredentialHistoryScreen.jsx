import { useContext } from 'react';
import { ScrollView } from 'react-native';

import { CredentialsContext } from '../context/CredentialsContext';
import CredentialCard from '../components/CredentialCard';

const CredentialHistoryScreen = () => {
  const { credentials } = useContext(CredentialsContext);

  return (
    <ScrollView>
      {credentials.map((cred, index) => {
        const key = `${cred.client_id}-${index}`;
        return (
          <CredentialCard key={key} credential={cred} />
        );
      })}
    </ScrollView>
  );
};

export default CredentialHistoryScreen;
