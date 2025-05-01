import { AboutMe } from '../components/about-me/AboutMe';
import { PersonalPagesOutlet } from '../components/nav/PersonalPagesOutlet';

export const Home: React.FC = () => {
  return (
    <div className="w-full py-2 min-h-screen flex flex-col place-items-center gap-4 md:gap-8">
      <AboutMe />
      <PersonalPagesOutlet />
    </div>
  );
};
