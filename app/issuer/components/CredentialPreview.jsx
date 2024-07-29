import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Credential from './Credential';
import { CredentialsContext } from '../context/CredentialsContext';

const CredentialPreview = () => {
  const [displayed, setDisplayed] = useState([]);
  const { credentials } = useContext(CredentialsContext);

  useEffect(() => {
    if (credentials.count > 5) {
      const newDisplayed = credentials.slice(0, 5);
      setDisplayed(newDisplayed);
    } else {
      setDisplayed(credentials);
    }
  }, [credentials]);

  return (
    <ScrollView style={styles.container}>
      {displayed.map((cred) => (
        <Credential key={cred.credential.id} credential={cred} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
  },
});

export default CredentialPreview;
