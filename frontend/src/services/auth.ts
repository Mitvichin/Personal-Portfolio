import { useMemo } from "react";
import { useAppFetch } from "../hooks/useAppFetch";
import { LoginForm } from "../types/LoginForm";
import { RegisterForm } from "../types/RegisterForm";
import { User } from "../types/User";

export const useAuthService = () => {
  const appFetch = useAppFetch();

  const register = async (data: RegisterForm) => {
    const res = await appFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return res.json();
  };

  const login = async (data: LoginForm): Promise<User> => {
    const res = await appFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return res.json();
  };

  const logout = async (): Promise<void> => {
    await appFetch("/api/auth/logout", {
      method: "GET",
    });
  };

  const verifyAuth = useMemo(
    () => async (): Promise<User> => {
      const res = await appFetch("/api/auth/verify-authentication", {
        method: "GET",
      });

      return res.json();
    },
    [appFetch]
  );

  return { register, login, logout, verifyAuth };
};
