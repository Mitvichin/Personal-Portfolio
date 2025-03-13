import { AboutMeTabs } from "../../../types/enums";

export const Tabs: React.FC<{
  onTabClick: (tab: AboutMeTabs) => void;
}> = ({ onTabClick }) => {
  return (
    <div className="h-[30px] flex w-full text-center align-middle shadow-sm rounded-2xl border border-gray-300">
      <div
        onClick={() => onTabClick(AboutMeTabs.WorkExperience)}
        className="flex-1 flex text-base border-r hover:scale-110 hover:cursor-pointer transition-all border-gray-300"
      >
        <p className="m-auto">Experience</p>
      </div>
      <div
        onClick={() => onTabClick(AboutMeTabs.SideProjects)}
        className="flex-1 flex border-r hover:scale-110 hover:cursor-pointer transition-all border-gray-300"
      >
        <p className="m-auto">Side Projects</p>
      </div>
      <div
        onClick={() => onTabClick(AboutMeTabs.ContactMe)}
        className="flex-1 flex hover:scale-110 hover:cursor-pointer transition-all"
      >
        <p className="m-auto">Contact Me</p>
      </div>
    </div>
  );
};
