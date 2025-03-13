import { useEffect, useRef } from "react";
import { AboutMeTabs } from "../../../types/enums";
import { WorkExperience } from "./WorkExperience";
import { SideProjects } from "./SideProjects";
import { ContanctMe } from "./ContactMe";

export const TabsContent: React.FC<{ activeTab: AboutMeTabs }> = ({
  activeTab,
}) => {
  const workExperienceContent = useRef<HTMLDivElement>(null);
  const sideProjectContent = useRef<HTMLDivElement>(null);
  const contactMeContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabMap = {
      [AboutMeTabs.WorkExperience]: workExperienceContent.current,
      [AboutMeTabs.SideProjects]: sideProjectContent.current,
      [AboutMeTabs.ContactMe]: contactMeContent.current,
    };

    tabMap[activeTab]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [activeTab]);

  return (
    <>
      <div className="flex-4 w-full self-start overflow-x-scroll whitespace-nowrap no-scrollbar overflow-y-hidden rounded-xl bg-gray-50 shadow-sm">
        <div
          ref={workExperienceContent}
          className="w-full inline-block h-full whitespace-normal overflow-auto p-10 "
        >
          <WorkExperience />
        </div>
        <div
          ref={sideProjectContent}
          className="w-full inline-block h-full whitespace-normal overflow-auto p-7 md:p-10"
        >
          <SideProjects />
        </div>
        <div
          ref={contactMeContent}
          className="w-full inline-block h-full whitespace-normal overflow-auto p-7 md:p-10"
        >
          <ContanctMe />
        </div>
      </div>
    </>
  );
};
