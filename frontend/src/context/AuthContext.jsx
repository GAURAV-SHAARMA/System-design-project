import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const demoAdmin = {
  email: 'admin@insurance.com',
  password: 'Admin@123'
};

const demoUser = {
  email: 'user@insurance.com',
  password: 'User@123'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('insurance-user');
    return saved ? JSON.parse(saved) : null;
  });

  const updateAuth = (authResponse) => {
    localStorage.setItem('insurance-token', authResponse.token);
    const nextUser = {
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      roles: authResponse.roles
    };
    localStorage.setItem('insurance-user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('insurance-token');
    localStorage.removeItem('insurance-user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, updateAuth, logout, demoAdmin, demoUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
