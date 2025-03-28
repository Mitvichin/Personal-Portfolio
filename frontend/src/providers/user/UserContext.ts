import { createContext, useContext } from "react";
import { UserContextProps } from "../../types/UserContextProps";

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  deleteUser: () => {},
});
export const useUserContext = () => useContext(UserContext);
