import { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getCredential, getCredentials } from '../scripts/api';
import { getValueFor, save } from '../scripts/util';

const CredentialsContext = createContext();

const CredentialsProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([]);

  /**
   * Fetches all the credentials and formats them with the
   * id and favourite fields.
   */
  const fetchCredentials = async () => {
    const tempCredentials = [];
    const credentialIds = await getCredentials();

    const credentialPromises = credentialIds.map(async (id) => {
      try {
        const credential = await getCredential(id);
        tempCredentials.push({
          id,
          favourite: false,
          credential,
        });
      } catch (error) {
        console.error(error.message);
      }
    });

    await Promise.all(credentialPromises);
    setCredentials(tempCredentials);

    return credentials;
  };

  /**
   * Toggles the favourite field.
   * @param {string} id - the id of the credential (obtained by credential.id).
   */
  const toggleFavourite = (id) => {
    setCredentials(credentials.map((cred) => (
      cred.id === id ? { ...cred, favourite: !cred.favourite } : cred
    )));
  };

  // TODO: Add delete function + API call here

  /**
   * Fetches all the credentials from the local device.
   * @returns array of credentials
   */
  const loadLocalCredentials = async () => {
    try {
      const loadedCredentials = await getValueFor('credentials');
      return loadedCredentials ? JSON.parse(loadedCredentials) : [];
    } catch (error) {
      console.error('Could not load local credentials:', error);
      return [];
    }
  };

  /**
   * Saves credentials locally to the device.
   * @param {Array} credentials - the updated array of credentials.
   */
  const saveCredentialsLocally = async (newCredentials) => {
    try {
      await save('credentials', JSON.stringify(newCredentials));
    } catch (error) {
      console.error('Could not save credentials locally:', error);
    }
  };

  useEffect(() => {
    const loadCredentials = async () => {
      const [apiCredentials, localCredentials] = await Promise.all([
        fetchCredentials(),
        loadLocalCredentials(),
      ]);

      const allCredentials = [...localCredentials, ...apiCredentials];
      setCredentials(allCredentials);
      // saveCredentialsLocally(allCredentials);
    };

    loadCredentials();
  }, []);

  const contextValue = useMemo(() => ({ credentials, toggleFavourite }), [credentials]);

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
