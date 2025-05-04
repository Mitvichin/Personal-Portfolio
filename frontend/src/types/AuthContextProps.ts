import { User } from './User';

export type AuthContextProps = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  deleteUser: () => void;
};
