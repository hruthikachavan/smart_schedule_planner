import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.get('auth_token');
    if (token) {
      // Always verify with backend before trusting stored user.
      // Do NOT setUser(saved) before verify — that causes stale-auth flicker.
      authApi.me()
        .then(r => { setUser(r.data); storage.set('auth_user', r.data); })
        .catch(() => { storage.remove('auth_token'); storage.remove('auth_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    storage.set('auth_token', res.data.token);
    storage.set('auth_user', res.data.user);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    storage.set('auth_token', res.data.token);
    storage.set('auth_user', res.data.user);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    storage.remove('auth_token');
    storage.remove('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};
