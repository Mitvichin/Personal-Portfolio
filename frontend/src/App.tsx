import { RouterProvider } from 'react-router';
import { Bounce, ToastContainer } from 'react-toastify';
import { router } from './router';
import { AuthProvider } from './providers/auth/AuthProvider';
import { APP_CONTAINER_ID } from './utils/constants';

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
        <ToastContainer
          position="bottom-right"
          aria-label={'notification'}
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </AuthProvider>
    </>
  );
}

export default App;
