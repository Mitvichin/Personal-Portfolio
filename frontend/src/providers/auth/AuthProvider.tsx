import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../../types/User';
import { useAuthService } from '../../services/auth';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { verifyAuth, getCSRF } = useAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCSRFToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const deleteUser = useMemo(() => () => setUser(null), []);

  useEffect(() => {
    const verifyAth = async () => {
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

    verifyAth();
  }, [verifyAuth]);

  useEffect(() => {
    const getCSRFToken = async () => {
      try {
        const data = await getCSRF();
        setCSRFToken(data.csrfToken);
      } catch {
        console.error('CSRF token retrieval failed');
      }
    };

    getCSRFToken();
  }, [getCSRF]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, deleteUser, csrfToken, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
