import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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

  /**
   * Toggles the favourite field.
   * @param {string} id - the id of the credential (obtained by credential.id).
   */
  const toggleFavourite = (id) => {
    const newCredentials = credentials.map((cred) => (
      cred.id === id ? { ...cred, favourite: !cred.favourite } : cred
    ));
    setCredentials(newCredentials);
    saveCredentialsLocally(newCredentials);
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
      // await save('credentials', ''); // TODO: Remove - placed here to clear the credentials
      const localCredentials = await loadLocalCredentials();
      const apiCredentials = await fetchCredentials(localCredentials);

      const allCredentials = [...localCredentials, ...apiCredentials];

      setCredentials(allCredentials);
      saveCredentialsLocally(allCredentials);
    };

    // loadCredentials();
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
