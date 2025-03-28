import { User } from "./User";

export type UserContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  deleteUser: () => void;
};
