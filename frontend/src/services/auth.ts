import { useMemo } from 'react';
import { useAppFetch } from '../hooks/useAppFetch';
import { LoginForm } from '../types/LoginForm';
import { RegisterForm } from '../types/RegisterForm';
import { User } from '../types/User';
import { BASE_API_ULR } from '../utils/constants';

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

    return res.json();
  };

  const logout = async (): Promise<void> => {
    await appFetch(`${BASE_API_ULR}/auth/logout`, {
      method: 'GET',
    });
  };

  const verifyAuth = useMemo(
    () => async (): Promise<User> => {
      const res = await appFetch(`${BASE_API_ULR}/auth/verify-authentication`, {
        method: 'GET',
      });

      return res.json();
    },
    [appFetch],
  );

  const getCSRF = useMemo(
    () => async (): Promise<{ csrfToken: string }> => {
      const res = await appFetch(`${BASE_API_ULR}/auth/csrf-token`, {
        method: 'GET',
      });

      return res.json();
    },
    [appFetch],
  );

  return { registerUser, login, logout, verifyAuth, getCSRF };
};
