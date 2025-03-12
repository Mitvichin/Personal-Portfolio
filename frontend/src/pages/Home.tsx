import { AboutMe } from "../components";

export const Home: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col place-items-center gap-10">
      <AboutMe />
    </div>
  );
};
