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
        path: 'home',
        Component: Home,
        children: [
          { path: routes.experience, Component: WorkExperience },
          { path: routes.sideProject, Component: SideProjects },
          { path: routes.contactMe, Component: ContanctMe },
          {
            index: true,
            element: <Navigate to={routes.experience} replace />,
          },
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
        path: routes.messages,
        Component: AuthGuard,
        children: [
          {
            path: '',
            children: [{ path: '', Component: Messages }],
          },
        ],
      },
    ],
  },
  // catch all
  {
    path: '*',
    Component: NotFound,
  },
]);
