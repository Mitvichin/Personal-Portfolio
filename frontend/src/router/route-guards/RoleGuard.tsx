import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../providers/auth/AuthContext';
import { Role } from '../../types/Roles';

export const AuthGuard: React.FC<{ allowedRoles: Role[] }> = ({
  allowedRoles,
}) => {
  const { user, isLoading } = useAuthContext();

  if (!user && !isLoading) {
    return null;
  } else if (user) {
    return allowedRoles.includes(user.role) ? (
      <Outlet />
    ) : (
      <Navigate to="/forbidden" replace />
    );
  }

  return null;
};
