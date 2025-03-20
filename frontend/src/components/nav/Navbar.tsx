import { NavLink } from "react-router";
import { routes } from "../../router";

export const Navbar: React.FC = () => {
  return (
    <div className="h-[30px] flex w-full text-center align-middle shadow-sm rounded-2xl border border-gray-300">
      <NavLink
        to={routes.experience}
        className="flex-1 flex text-base border-r hover:scale-110 hover:cursor-pointer transition-all border-gray-300"
      >
        <p className="m-auto">Experience</p>
      </NavLink>
      <NavLink
        to={routes.sideProject}
        className="flex-1 flex border-r hover:scale-110 hover:cursor-pointer transition-all border-gray-300"
      >
        <p className="m-auto">Side Projects</p>
      </NavLink>
      <NavLink
        to={routes.contactMe}
        className="flex-1 flex hover:scale-110 hover:cursor-pointer transition-all"
      >
        <p className="m-auto">Contact Me</p>
      </NavLink>
    </div>
  );
};
