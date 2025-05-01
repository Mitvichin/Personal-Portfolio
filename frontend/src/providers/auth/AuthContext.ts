import { createContext, useContext } from 'react';
import { AuthContextProps } from '../../types/AuthContextProps';

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  csrfToken: '',
  setUser: () => {},
  deleteUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
