import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Role = 'student' | 'admin';

export interface User {
  id: number;
  name: string;
  email?: string;
  matric?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (user: User, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) as User : null;
    } catch (e) {
      return null;
    }
  });

  const [role, setRole] = useState<Role | null>(() => {
    try {
      const r = localStorage.getItem('role');
      return r === 'admin' || r === 'student' ? (r as Role) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (newUser: User, newRole: Role) => {
    setUser(newUser);
    setRole(newRole);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('role', newRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
