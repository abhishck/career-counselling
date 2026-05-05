import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('career_token'));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('career_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = (authToken, nextUser) => {
    localStorage.setItem('career_token', authToken);
    if (nextUser) localStorage.setItem('career_user', JSON.stringify(nextUser));
    setToken(authToken);
    setUser(nextUser || null);
  };

  const logout = () => {
    localStorage.removeItem('career_token');
    localStorage.removeItem('career_user');
    setToken(null);
    setUser(null);
  };

  const login = async (payload) => {
    const { data } = await api.post('/api/auth/login', payload);
    persistSession(data.token, data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    persistSession(data.token, data.user);
    return data;
  };

  const refreshProfile = async () => {
    const { data } = await api.get('/api/user/profile');
    const nextUser = data.user || data;
    setUser(nextUser);
    localStorage.setItem('career_user', JSON.stringify(nextUser));
    return nextUser;
  };

  useEffect(() => {
    const onLogout = () => logout();
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  useEffect(() => {
    let active = true;
    if (!token) {
      setLoading(false);
      return undefined;
    }

    refreshProfile()
      .catch(logout)
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
