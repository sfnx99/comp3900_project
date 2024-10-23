import React, { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteCredential, getCredential, getCredentials } from '../scripts/api';
import { deleteItem, getValueFor, save } from '../scripts/util';

const CredentialsContext = createContext();

const CredentialsProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([]);

  const fetchCredentials = async (localCredentials) => {
    const tempCredentials = [];
    const credentialIds = await getCredentials();

    const localCredentialIds = localCredentials.map((cred) => cred.id);

    const credentialPromises = credentialIds
      .filter((id) => !localCredentialIds.includes(id))
      .map(async (id) => {
        try {
          const credential = await getCredential(id);
          tempCredentials.push({
            id,
            favourite: false,
            ...credential,
          });
        } catch (error) {
          console.error(error.message);
        }
      });

    await Promise.all(credentialPromises);

    return tempCredentials;
  };

  const loadLocalCredentials = async () => {
    try {
      const loadedCredentials = await getValueFor('credentials');
      return loadedCredentials ? JSON.parse(loadedCredentials) : [];
    } catch (error) {
      console.error('Could not load local credentials:', error);
      return [];
    }
  };

  const saveCredentialsLocally = async (newCredentials) => {
    try {
      await save('credentials', JSON.stringify(newCredentials));
    } catch (error) {
      console.error('Could not save credentials locally:', error);
    }
  };

  const loadCredentials = async () => {
    try {
      const localCredentials = await loadLocalCredentials();
      const apiCredentials = await fetchCredentials(localCredentials);

      const allCredentials = [...localCredentials, ...apiCredentials];
      setCredentials(allCredentials);
      saveCredentialsLocally(allCredentials);
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const contextValue = useMemo(() => ({
    credentials,
    loadCredentials,  
    toggleFavourite: (id) => {
    
    },
    removeCredential: async (credential_id) => {
      try {
        await deleteCredential(credential_id);
        const updatedCredentials = credentials.filter((cred) => cred.id !== credential_id);
        setCredentials(updatedCredentials);
        saveCredentialsLocally(updatedCredentials);
      } catch (error) {
        console.error('Failed to delete credential:', error);
      }
    },
    wipeCredentialData: async () => {
      setCredentials([]);
      await deleteItem('credentials');
    }
  }), [credentials]);

  return (
    <CredentialsContext.Provider value={contextValue}>
      {children}
    </CredentialsContext.Provider>
  );
};

CredentialsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CredentialsContext, CredentialsProvider };

