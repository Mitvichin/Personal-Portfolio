import { ExperienceCard } from "./experience-card/Experience-card";
import { PersonalCard } from "./PersonalCard";

export const AboutMe: React.FC = () => {
  return (
    <>
      <PersonalCard />
      <ExperienceCard />
    </>
  );
};
