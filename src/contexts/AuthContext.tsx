import React, { createContext, useContext, useState } from 'react';

type UserRole = 'admin' | 'officer' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  username: string;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    username: '',
  });

  const login = async (username: string, password: string, role: UserRole) => {
    // Mock authentication logic
    // In a real application, this would make an API call to verify credentials
    const validCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      officer: { username: 'officer', password: 'officer123' },
    };

    const isValid = role === 'admin' 
      ? username === validCredentials.admin.username && password === validCredentials.admin.password
      : username === validCredentials.officer.username && password === validCredentials.officer.password;

    if (isValid) {
      setAuthState({
        isAuthenticated: true,
        role: role,
        username: username,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      role: null,
      username: '',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};