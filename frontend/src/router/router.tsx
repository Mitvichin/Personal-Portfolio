import { createBrowserRouter, Navigate } from 'react-router';
import { routes } from './routes';
import { AuthGuard } from './route-guards/AuthGuard';
import { SidebarLayout } from '../components/layouts/SidebarLayout';
import { RoleGuard } from './route-guards/RoleGuard';
import { lazy, ReactNode, Suspense } from 'react';

const ContanctMe = lazy(() => import('../pages/ContactMe'));
const SideProjects = lazy(() => import('../pages/SideProjects'));
const WorkExperience = lazy(() => import('../pages/WorkExperience'));
const Forbidden = lazy(() => import('../pages/error-pages/Forbidden'));
const NotFound = lazy(() => import('../pages/error-pages/NotFound'));
const Users = lazy(() => import('../pages/Users'));
const Messages = lazy(() => import('../pages/Messages'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Home = lazy(() => import('../pages/Home'));
const GlobalErorrBoundry = lazy(
  () => import('../pages/error-pages/GlobalErorrBoundry'),
);

const withSuspense = (component: ReactNode) => <Suspense>{component}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SidebarLayout,
    errorElement: withSuspense(<GlobalErorrBoundry />),
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
        path: routes.forbidden,
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
