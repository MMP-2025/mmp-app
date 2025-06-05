
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'patient' | 'provider' | 'non-patient';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isProvider: boolean;
  isPatient: boolean;
  isNonPatient: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate login - in real app, this would call an API
    const getName = (role: UserRole) => {
      switch (role) {
        case 'provider': return 'Dr. Smith';
        case 'patient': return 'John Doe';
        case 'non-patient': return 'Jane Smith';
        default: return 'User';
      }
    };

    const mockUser: User = {
      id: Date.now().toString(),
      name: getName(role),
      email,
      role
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isProvider: user?.role === 'provider',
    isPatient: user?.role === 'patient',
    isNonPatient: user?.role === 'non-patient'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
