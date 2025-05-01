import { User } from './User';

export type AuthContextProps = {
  user: User | null;
  isLoading: boolean;
  csrfToken: string;
  setUser: (user: User) => void;
  deleteUser: () => void;
};
