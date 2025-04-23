import { AboutMe } from '../components/about-me/AboutMe';
import { AuthNav } from '../components/nav/AuthNav';
import { PageOutlet } from '../components/nav/PageOutlet';

export const Home: React.FC = () => {
  return (
    <>
      <AuthNav />
      <div className="w-full py-2 min-h-screen flex flex-col place-items-center gap-4 md:gap-8">
        <AboutMe />
        <PageOutlet />
      </div>
    </>
  );
};
