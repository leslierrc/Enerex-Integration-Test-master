import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const updateToken = (newToken, user) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, updateToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider }; 