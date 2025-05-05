import { useLocation, Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../providers/auth/AuthContext';
import { routes } from '../routes';

export const AuthGuard: React.FC = () => {
  const location = useLocation();
  const { user, isLoading } = useAuthContext();

  if (!user?.id && !isLoading) {
    return (
      <Navigate to={`/${routes.login}`} replace state={{ from: location }} />
    );
  } else if (user?.id) {
    return <Outlet />;
  }
};
