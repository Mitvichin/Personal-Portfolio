import { useState } from "react";
import { AboutMeTabs } from "../../../types/enums";
import { Tabs } from "./Tabs";
import { TabsContent } from "./TabsContent";

export const ExperienceCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AboutMeTabs>(
    AboutMeTabs.WorkExperience
  );

  return (
    <div className="flex w-full md:w-5/6 h-4/5 grow justify-center place-items-center bg-white rounded-xl overflow-hidden shadow-xl p-4 gap-4 lg:gap-8 flex-col">
      <Tabs onTabClick={setActiveTab} />
      <TabsContent activeTab={activeTab} />
    </div>
  );
};
