import { createContext, useEffect, useMemo, useState } from 'react';
import { getCredential, getCredentials } from '../scripts/api';
import { getValueFor, save } from '../scripts/util';

const CredentialsContext = createContext();

const CredentialsProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([]);

  // TODO: Uncomment API functions when v2 is implemented.
  const fetchCredentials = async () => {
    /*
    const tempCredentials = [];
    const credentialIds = await getCredentials();

    const credentialPromises = credentialIds.map(async (id) => {
      try {
        const credential = await getCredential(id);
        tempCredentials.push(credential);
      } catch (error) {
        console.error(error.message);
      }
    });

    await Promise.all(credentialPromises);

    // Add credential_id and favourite: false here
    setCredentials(tempCredentials);
    setCredentials([{
      id: 'id',
      favourite: false,
      issuer: 'issue',
      type: 'DriverLicenceCredential',
      cryptosuite: 'string',
      credential: {
        id: '0123456789',
        firstName: 'Jessica',
        lastName: 'Brown',
      },
    }]);
    */

    return [
      {
        id: '1',
        favourite: false,
        type: 'NSWDriverLicense',
        issuer: 'String',
        cryptosuite: 'string',
        credential: {
          id: 'a1234',
          firstName: 'Jessica',
          lastName: 'Brown'
        }
      },
      {
        id: '2',
        favourite: false,
        type: 'BoatingLicense',
        issuer: 'String',
        cryptosuite: 'string',
        credential: {
          id: 'b1234',
          firstName: 'Jessica',
          lastName: 'Brown'
        }
      },
    ];
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
      return loadedCredentials ? JSON.parse(localStorage) : [];
    } catch (error) {
      console.error('Could not load local credentials:', error);
      return [];
    }
  }

  /**
   * Saves credentials locally to the device.
   * @param {Array} credentials - the updated array of credentials.
   */
  const saveCredentialsLocally = async (credentials) => {
    try {
      await save('credentials', JSON.stringify(credentials));
    } catch (error) {
      console.error('Could not save credentials locally:', error);
    }
  }

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

export { CredentialsContext, CredentialsProvider };
