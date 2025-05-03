import { createBrowserRouter, Navigate } from 'react-router';
import { ContanctMe } from '../pages/ContactMe';
import { SideProjects } from '../pages/SideProjects';
import { WorkExperience } from '../pages/WorkExperience';
import { routes } from './routes';
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Messages } from '../pages/Messages';
import { AuthGuard } from './route-guards/AuthGuard';
import { SidebarLayout } from '../components/layouts/SidebarLayout';
import { GlobalErorrBoundry } from '../pages/error-pages/GlobalErorrBoundry';
import { NotFound } from '../pages/error-pages/NotFound';
import { Forbidden } from '../pages/error-pages/Forbidden';
import { Users } from '../pages/Users';
import { RoleGuard } from './route-guards/RoleGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SidebarLayout,
    errorElement: <GlobalErorrBoundry />,
    children: [
      {
        index: true,
        element: (
          <Navigate to={`/${routes.home}/${routes.experience}`} replace />
        ),
      },
      {
        path: routes.home,
        Component: Home,
        children: [
          {
            index: true,
            element: <Navigate to={routes.experience} replace />,
          },
          { path: routes.experience, Component: WorkExperience },
          { path: routes.sideProject, Component: SideProjects },
          { path: routes.contactMe, Component: ContanctMe },
        ],
      },
      {
        path: routes.register,
        Component: Register,
      },
      {
        path: routes.login,
        Component: Login,
      },

      // Auth protected routes
      {
        path: '*',
        Component: AuthGuard,
        children: [
          {
            path: routes.messages,
            children: [{ path: '', Component: Messages }],
          },
          // Admin role protected
          {
            path: '*',
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              {
                path: routes.users,
                children: [{ path: '', Component: Users }],
              },
            ],
          },
        ],
      },
      {
        path: '/forbidden',
        Component: Forbidden,
      },
      // catch all
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);
