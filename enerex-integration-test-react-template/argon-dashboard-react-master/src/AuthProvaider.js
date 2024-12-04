import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Intenta obtener el token del localStorage al iniciar
    return localStorage.getItem('token') || null;
  });

  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken); // Guarda el token en localStorage
    } else {
      localStorage.removeItem('token'); // Elimina el token si es null
    }
  };

  const logout = () => {
    setToken(null); // Limpia el token en el estado
    localStorage.removeItem('token'); // Elimina el token del localStorage
  };

  return (
    <AuthContext.Provider value={{ token, updateToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;