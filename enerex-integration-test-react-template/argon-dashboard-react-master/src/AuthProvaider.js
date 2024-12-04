import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken); 
    } else {
      localStorage.removeItem('token'); 
    }
  };

  const logout = () => {
    setToken(null); 
    localStorage.removeItem('token'); 
  };

  return (
    <AuthContext.Provider value={{ token, updateToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;