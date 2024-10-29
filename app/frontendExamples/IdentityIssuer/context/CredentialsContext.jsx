import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { getCredentials } from '../scripts/api';

const CredentialsContext = createContext();

const CredentialsProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    const loadCredentials = async () => {
      const loadedCredentials = await getCredentials();
      setCredentials(loadedCredentials);
    };

    loadCredentials();
  }, []);

  const contextValue = useMemo(() => ({ credentials }), [credentials]);

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
