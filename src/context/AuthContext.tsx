'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types';
import { authApi } from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch {
      Cookies.remove('auth_token');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      refreshUser();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }

    const { user, token } = response.data;
    Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' });
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }

    const { user, token } = response.data;
    Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' });
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      Cookies.remove('auth_token');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      window.location.href = '/login';
    }
  };

  const updateUser = (user: Partial<User>) => {
    setState(prev => ({ ...prev, user: prev.user ? { ...prev.user, ...user } : null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
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
