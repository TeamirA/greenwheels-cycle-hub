
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
    // For demo: check credentials for admin and staff
    if (email === 'admin@gmail.com' && password === 'password') {
      setAuthState({
        user: {
          id: 'admin-user',
          name: 'Admin User',
          email: email,
          role: 'admin',
          verified: true,
          createdAt: new Date().toISOString()
        },
        isAuthenticated: true,
        role: 'admin',
      });
      return true;
    } else if (email === 'staff@gmail.com' && password === 'password') {
      setAuthState({
        user: {
          id: 'staff-user',
          name: 'Staff User',
          email: email,
          role: 'staff',
          verified: true,
          createdAt: new Date().toISOString()
        },
        isAuthenticated: true,
        role: 'staff',
      });
      return true;
    } else {
      // Check mock users as fallback
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && password === 'password') {
        setAuthState({
          user,
          isAuthenticated: true,
          role: user.role,
        });
        return true;
      }
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
