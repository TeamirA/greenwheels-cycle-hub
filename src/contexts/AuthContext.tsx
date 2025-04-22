
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types';
import { users } from '@/data/mockData';

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (roles?: UserRole[]) => boolean;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: null,
};

const AuthContext = createContext<AuthContextProps>({
  authState: defaultAuthState,
  login: async () => false,
  logout: () => {},
  isAuthorized: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check for existing auth state in localStorage
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth);
      } catch (error) {
        console.error('Error parsing auth from localStorage:', error);
        return defaultAuthState;
      }
    }
    return defaultAuthState;
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
  }, [authState]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple demo sign-in: allow any email with password > 8 characters
    if (email.trim() !== '' && password.length > 8) {
      // Default to 'user' role if no matching mock user found
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
        id: 'demo-user',
        name: 'Demo User',
        email: email,
        role: 'user',
        verified: true,
        createdAt: new Date().toISOString()
      };

      setAuthState({
        user,
        isAuthenticated: true,
        role: user.role,
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState(defaultAuthState);
  };

  const isAuthorized = (roles?: UserRole[]): boolean => {
    if (!authState.isAuthenticated) return false;
    if (!roles || roles.length === 0) return true;
    return !!authState.role && roles.includes(authState.role);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};
