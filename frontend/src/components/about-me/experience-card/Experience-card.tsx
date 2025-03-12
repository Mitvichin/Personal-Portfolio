import { Tabs } from "./Tabs";

export const ExperienceCard: React.FC = () => {
  return (
    <div className="flex w-5/6 h-auto md:h-1/4 justify-center place-items-center bg-white rounded-xl overflow-hidden shadow-xl p-4 gap-4 lg:gap-8 flex-col">
      <Tabs />
      <div className="flex-4 flex place-items-start lg:place-items-center">
        <p className="text-sm md:text-base lg:text-2xl font-medium">
          Experience here
        </p>
      </div>
    </div>
  );
};
