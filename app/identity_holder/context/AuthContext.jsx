import { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = () => {
  const [token, setToken] = useState();

  return (
    <AuthContext.Provider value={}>

    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };