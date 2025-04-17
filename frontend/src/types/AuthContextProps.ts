import { User } from "./User";

export type AuthContextProps = {
  user: User | null;
  csrfToken: string;
  setUser: (user: User) => void;
  deleteUser: () => void;
};
