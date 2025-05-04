import { useCallback } from 'react';
import { useAppFetch } from '../hooks/useAppFetch';
import { LoginForm } from '../types/LoginForm';
import { RegisterForm } from '../types/RegisterForm';
import { User } from '../types/User';
import { BASE_API_ULR } from '../utils/constants';
import { getCSRFToken } from './getCSRFToken';

export const useAuthService = () => {
  const appFetch = useAppFetch();

  const registerUser = async (data: RegisterForm): Promise<void> => {
    const res = await appFetch(`${BASE_API_ULR}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.json();
  };

  const login = async (data: LoginForm): Promise<User> => {
    const res = await appFetch(`${BASE_API_ULR}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    await getCSRFToken();

    return res.json();
  };

  const logout = async (): Promise<void> => {
    await appFetch(`${BASE_API_ULR}/auth/logout`, {
      method: 'GET',
    });

    await getCSRFToken();
  };

  const verifyAuth = useCallback(async (): Promise<User> => {
    const res = await appFetch(`${BASE_API_ULR}/auth/verify-authentication`, {
      method: 'GET',
    });

    return res.json();
  }, [appFetch]);

  return { registerUser, login, logout, verifyAuth };
};
