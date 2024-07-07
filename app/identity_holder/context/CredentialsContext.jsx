import { createContext, useEffect, useMemo, useState } from 'react';

const CredentialsContext = createContext();

const CredentialsProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([
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
  ]);

  const toggleFavourite = (id) => {
    setCredentials(credentials.map((cred) => (
      cred.id === id ? { ...cred, favourite: !cred.favourite } : cred
    )));
  };

  // TODO: Add delete function + API call here

  const contextValue = useMemo(() => ({ credentials, toggleFavourite }), [credentials]);

  return (
    <CredentialsContext.Provider value={contextValue}>
      {children}
    </CredentialsContext.Provider>
  );
};

export { CredentialsContext, CredentialsProvider };
