import { LoginForm } from "../types/LoginForm";
import { RegisterForm } from "../types/RegisterForm";
import { User } from "../types/User";
import { appFetch } from "../utils/appFetch";

export const register = async (data: RegisterForm) => {
  try {
    const res = await appFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong! Try again later!");
  }
};

export const login = async (data: LoginForm): Promise<User> => {
  try {
    const res = await appFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong! Try again later!");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await appFetch("/api/auth/logout", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong! Try again later!");
  }
};

export const verifyAuth = async (): Promise<User> => {
  try {
    const res = await appFetch("/api/auth/verify-authentication", {
      method: "GET",
    });

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Something went wrong! Try again later!");
  }
};
