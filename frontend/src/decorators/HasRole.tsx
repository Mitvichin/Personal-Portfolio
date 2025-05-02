import { PropsWithChildren } from 'react';
import { Role } from '../types/Roles';
import { useAuthContext } from '../providers/auth/AuthContext';

export const HasRole: React.FC<PropsWithChildren<{ roles: Role[] }>> = ({
  roles,
  children,
}) => {
  const { user } = useAuthContext();

  if (!user || !roles.includes(user.role)) return null;

  return <>{children}</>;
};
