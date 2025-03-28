import { createBrowserRouter, redirect } from "react-router";
import { ContanctMe } from "../pages/ContactMe";
import { SideProjects } from "../pages/SideProjects";
import { WorkExperience } from "../pages/WorkExperience";
import { routes } from "./routes";
import { Register } from "../pages/Register";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      { path: routes.experience, Component: WorkExperience },
      { path: routes.sideProject, Component: SideProjects },
      { path: routes.contactMe, Component: ContanctMe },
      { path: "/", loader: () => redirect(routes.experience) },
      { path: "*", element: <div> Page not found 404! </div> },
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
]);
