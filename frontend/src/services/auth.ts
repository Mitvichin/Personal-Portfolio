import { LoginForm } from "../types/LoginForm";
import { RegisterForm } from "../types/RegisterForm";
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

export const login = async (data: LoginForm) => {
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
