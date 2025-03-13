import { AboutMe } from "../components";

export const Home: React.FC = () => {
  return (
    <div className="w-full  py-2 h-screen flex flex-col place-items-center gap-8">
      <AboutMe />
    </div>
  );
};
