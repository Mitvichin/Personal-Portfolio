import { createBrowserRouter, redirect } from "react-router";
import { PageOutlet } from "../components/nav/PageOutlet";
import { ContanctMe } from "../pages/ContactMe";
import { SideProjects } from "../pages/SideProjects";
import { WorkExperience } from "../pages/WorkExperience";
import { routes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PageOutlet,
    children: [
      { path: routes.experience, Component: WorkExperience },
      { path: routes.sideProject, Component: SideProjects },
      { path: routes.contactMe, Component: ContanctMe },
      { path: "/", loader: () => redirect(routes.experience) },
      { path: "*", element: <div> Page not found 404! </div> },
    ],
  },
]);
