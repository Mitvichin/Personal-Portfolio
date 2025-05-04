import { NavLink, NavLinkProps } from 'react-router';
import { GET_BUTTON_CLASS_NAME } from '../../utils/constants';

export const AppNavLink: React.FC<
  Omit<NavLinkProps, 'className' | 'viewTransition'> & { className?: string }
> = ({ children, className: classNameProps, ...props }) => {
  const className = GET_BUTTON_CLASS_NAME(classNameProps);

  return (
    <NavLink
      viewTransition
      {...props}
      className={({ isActive }) =>
        `${className} ${isActive ? 'border-y-blue-600 border-x-blue-600' : ''}`
      }
    >
      {children}
    </NavLink>
  );
};
