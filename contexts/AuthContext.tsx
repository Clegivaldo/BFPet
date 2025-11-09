import { authService } from '@/services/authService';
import { db } from '@/services/db/sqlite';
import { IUser } from '@/types/user.types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and check for existing session
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[AuthContext] 🚀 Inicializando app...');
        await db.initialize();
        const currentUser = await authService.getCurrentUser();
        console.log('[AuthContext] 👤 User atual:', currentUser ? currentUser.email : 'null');
        setUser(currentUser);
        console.log('[AuthContext] ✅ App inicializado. Autenticado:', !!currentUser);
      } catch (error) {
        console.error('[AuthContext] ❌ Erro ao inicializar:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.createAccount(name, email, password);

      if (response.success && response.user) {
        setUser(response.user);
        // Auto-login after signup
        await authService.login(email, password);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
