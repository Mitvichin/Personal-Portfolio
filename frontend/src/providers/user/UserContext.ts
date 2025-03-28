import { createContext, useContext } from "react";
import { UserContextProps } from "../../types/UserContextProps";

export const UserContext = createContext<UserContextProps | null>(null);
export const useUserContext = () =>
  useContext(UserContext) ?? { user: null, setUser: () => {} };
