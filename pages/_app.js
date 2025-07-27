import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- CORRECT USAGE
import '../styles/globals.css';

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

const REFRESH_INTERVAL_SEC = 840;

export default function App({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef(null);
  const logoutTimeoutRef = useRef(null);

  const login = (jwt, payload) => {
    setToken(jwt);
    setRole(payload.role);
    setUsername(payload.username);
    localStorage.setItem('token', jwt);
    localStorage.setItem('role', payload.role);
    localStorage.setItem('username', payload.username);
  };

  // Logout clears everything and cancels intervals/timeouts
  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    window.location.href = '/';   
  };

  // On mount, load from localStorage
  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    const u = localStorage.getItem('username');
    if (t && r && u) { setToken(t); setRole(r); setUsername(u); }
    setLoading(false);
  }, []);

  // Proactive auto-logout at JWT expiry
  useEffect(() => {
    if (!token) return;
    let decoded;
    try {
      decoded = jwtDecode(token);
      if (decoded.exp) {
        const expireTimeMs = decoded.exp * 1000;
        const msUntilExpire = expireTimeMs - Date.now();
        if (msUntilExpire > 0) {
          logoutTimeoutRef.current = setTimeout(() => {
            logout();
            window.location.href = '/'; // Optionally: display "Session Expired"
          }, msUntilExpire + 500);
        } else {
          logout(); // Already expired
        }
      }
    } catch (e) {
      logout();
    }
    return () => {
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    };
  }, [token]);

  // Auto-refresh JWT every REFRESH_INTERVAL_SEC
  useEffect(() => {
    async function refreshToken() {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          localStorage.setItem('token', data.token);
        } else {
          logout(); // Session expired or invalid
        }
      } catch {
        logout();
      }
    }

    if (token) {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = setInterval(refreshToken, REFRESH_INTERVAL_SEC * 1000);
    }
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, username, login, logout, loading }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}