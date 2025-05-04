import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../../types/User';
import { useAuthService } from '../../services/auth';
import { getCSRFToken } from '../../services/getCSRFToken';
import { toast } from 'react-toastify';
import { AppError } from '../../types/AppError';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { verifyAuth } = useAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const deleteUser = useMemo(() => () => setUser(null), []);

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        setIsLoading(true);
        const user = await verifyAuth();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuthentication();
  }, [verifyAuth]);

  useEffect(() => {
    const retrieveCSRFToken = async () => {
      try {
        await getCSRFToken();
      } catch (err: unknown) {
        if (err instanceof AppError) {
          toast.error(err.message);
          return;
        }

        toast.error('Something went wrong! Please try again later!');
      }
    };

    retrieveCSRFToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, deleteUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
