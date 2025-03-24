import { RouterProvider } from "react-router";
import { AboutMe } from "../components";
import { router } from "../router/router";

export const Home: React.FC = () => {
  return (
    <div className="w-full py-2 h-screen flex flex-col place-items-center gap-4 md:gap-8">
      <AboutMe />
      <RouterProvider router={router} />
    </div>
  );
};
