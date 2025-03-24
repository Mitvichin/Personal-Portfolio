import { Home } from "./pages/Home";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <div className="px-5 bg-gray-100 flex justify-center">
        <Home />
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
    </>
  );
}

export default App;
