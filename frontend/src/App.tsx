import { RouterProvider } from 'react-router';
import { router } from './router';
import { AuthProvider } from './providers/auth/AuthProvider';
import { APP_CONTAINER_ID, TOAST_PROPS } from './utils/constants';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <AuthProvider>
        <div
          id={APP_CONTAINER_ID}
          className="px-5 flex justify-start flex-col max-w-[1200px] m-auto"
        >
          <RouterProvider router={router} />
        </div>
        <ToastContainer {...TOAST_PROPS} />
      </AuthProvider>
    </>
  );
}

export default App;
