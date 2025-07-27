import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (jwt, payload) => {
    setToken(jwt);
    setRole(payload.role);
    setUsername(payload.username);
    localStorage.setItem('token', jwt);
    localStorage.setItem('role', payload.role);
    localStorage.setItem('username', payload.username);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  };

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    const u = localStorage.getItem('username');
    if (t && r && u) {
      setToken(t);
      setRole(r);
      setUsername(u);
    }
    setLoading(false); 
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, username, login, logout, loading }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}
