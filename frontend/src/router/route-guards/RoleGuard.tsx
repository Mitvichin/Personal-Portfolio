import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../providers/auth/AuthContext';
import { Role } from '../../types/Roles';
import { routes } from '../routes';

export const RoleGuard: React.FC<{ allowedRoles: Role[] }> = ({
  allowedRoles,
}) => {
  const { user, isLoading } = useAuthContext();

  if (!user && !isLoading) {
    return null;
  } else if (user) {
    return allowedRoles.includes(user.role) ? (
      <Outlet />
    ) : (
      <Navigate to={`/${routes.forbidden}`} replace />
    );
  }

  return null;
};
