import { NavLink, NavLinkRenderProps } from "react-router";
import { routes } from "../../router";

export const Navbar: React.FC = () => {
  const getClassName = ({ isActive }: NavLinkRenderProps) =>
    `flex-1 flex group hover:cursor-pointer transition-all duration-500 ${
      isActive ? "bg-blue-100" : ""
    }`;
  return (
    <div className="h-[30px] flex w-full text-center overflow-hidden align-middle shadow-sm rounded-2xl border border-gray-300">
      <NavLink
        viewTransition
        to={routes.experience}
        className={(data) => {
          const className = getClassName(data);
          return `${className} border-r border-gray-300`;
        }}
      >
        <p className="m-auto group-hover:scale-110 transition-all">
          Experience
        </p>
      </NavLink>
      <NavLink
        viewTransition
        to={routes.sideProject}
        className={(data) => {
          const className = getClassName(data);
          return `${className} border-r border-gray-300`;
        }}
      >
        <p className="m-auto group-hover:scale-110 transition-all">
          Side Projects
        </p>
      </NavLink>
      <NavLink viewTransition to={routes.contactMe} className={getClassName}>
        <p className="m-auto group-hover:scale-110 transition-all">
          Contact Me
        </p>
      </NavLink>
    </div>
  );
};
