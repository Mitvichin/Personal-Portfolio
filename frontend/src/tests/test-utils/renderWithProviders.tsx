import { createMemoryRouter, RouterProvider } from 'react-router';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../providers/auth/AuthProvider';
import { ToastContainer } from 'react-toastify';
import { APP_CONTAINER_ID, TOAST_PROPS } from '../../utils/constants';
import { routesDefinition } from '../../router/router';

export const renderWithProviders = (initRoute: string = '/') => {
  const router = createMemoryRouter(routesDefinition, {
    initialEntries: [initRoute],
  });

  return render(
    <div id="root">
      <div id={APP_CONTAINER_ID}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ToastContainer {...TOAST_PROPS} />
      </div>
    </div>,
  );
};
