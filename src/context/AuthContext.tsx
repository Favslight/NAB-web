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
  loginAsGuest: () => void;
}

const GUEST_USER: User = {
  id: 'guest',
  id_no: 'NAB-GUEST-0000',
  full_name: 'Guest User',
  email: 'guest@aibuilders.ng',
  phone: '',
  state: 'Lagos',
  profession: 'Visitor',
  avatar_url: '',
  is_member: false,
  membership_status: 'inactive',
  referral_code: '',
  role: 'user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isGuest: false,
  });

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          isGuest: false,
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
        isGuest: false,
      });
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      refreshUser();
    } else {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
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
      isGuest: false,
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
      isGuest: false,
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
        isGuest: false,
      });
      window.location.href = '/login';
    }
  };

  const updateUser = (user: Partial<User>) => {
    setState((prev: AuthState) => ({ ...prev, user: prev.user ? { ...prev.user, ...user } : null }));
  };

  const loginAsGuest = () => {
    setState({
      user: GUEST_USER,
      isAuthenticated: true,
      isLoading: false,
      isGuest: true,
    });
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
        loginAsGuest,
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
