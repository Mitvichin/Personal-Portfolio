import { RouterProvider } from "react-router";
import { Bounce, ToastContainer } from "react-toastify";
import { router } from "./router";
import { UserProvider } from "./providers/user/UserProvider";

function App() {
  return (
    <>
      <UserProvider>
        <div className="px-5 bg-gray-100 flex justify-start flex-col min-h-[100vh]">
          <RouterProvider router={router} />
        </div>
        <ToastContainer
          position="bottom-right"
          aria-label={"notification"}
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
      </UserProvider>
    </>
  );
}

export default App;
