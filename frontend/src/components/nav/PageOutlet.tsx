import { Navbar } from "./Navbar";
import { PageContainer } from "./PageContainer";

export const PageOutlet: React.FC = () => {
  return (
    <div className="flex w-full md:w-5/6 h-4/5 grow justify-center place-items-center bg-white rounded-xl overflow-hidden shadow-xl p-4 gap-4 lg:gap-8 flex-col">
      <Navbar />
      <PageContainer />
    </div>
  );
};
