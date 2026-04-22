'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types';
import { authApi, stateHubApi, userApi } from '@/lib/api';

interface RegisterResult {
  requiresPayment?: boolean;
  userRole?: string;
  message?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
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
  role: 'guest',
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
    // Backend accepts either email or id_no; map based on input
    const identifier = credentials.email || credentials.id_no || '';
    const payload: LoginCredentials =
      identifier.includes('@')
        ? { email: identifier, password: credentials.password }
        : { id_no: identifier, password: credentials.password };

    const response = await authApi.login(payload);
    
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
    // Map state name from form to backend state_id via states list
    const statesResponse = await userApi.getStates();
    if (!statesResponse.success || !statesResponse.data) {
      throw new Error(statesResponse.error || 'Unable to load states');
    }

    const selectedState = statesResponse.data.find(
      (s) =>
        (s.name?.toLowerCase?.() ?? '') === data.state.toLowerCase() ||
        (s.state_code?.toLowerCase?.() ?? '') === data.state.toLowerCase()
    );

    if (!selectedState) {
      throw new Error('Selected state is not available');
    }

    const response = await authApi.register({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      state_id: selectedState.id,
      profession: data.profession,
      password: data.password,
      referral_code: data.referral_code,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }

    const { user, token, requiresPayment } = response.data;
    
    // Store token if provided (even for pending users)
    if (token) {
      Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' });
    }
    
    setState({
      user,
      isAuthenticated: !!token,
      isLoading: false,
      isGuest: false,
    });

    // Return extra info for the UI to handle
    return { requiresPayment, userRole: user.role, message: response.message };
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

  const loginAsGuest = async () => {
    // Pick the first available state hub for guest users
    const statesResponse = await stateHubApi.getAll();
    if (!statesResponse.success || !statesResponse.data || statesResponse.data.length === 0) {
      throw new Error(statesResponse.error || 'Unable to start guest session');
    }

    const defaultState = statesResponse.data[0];

    const response = await authApi.guestLogin({
      full_name: GUEST_USER.full_name,
      state_id: defaultState.id,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Guest login failed');
    }

    const { user, token } = response.data;
    Cookies.set('auth_token', token, { expires: 1, secure: true, sameSite: 'strict' });

    setState({
      user,
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
