import { PersonalPagesNavbar } from './PersonalPagesNavbar';
import { PersonalPagesContainer } from './PersonalPagesContainer';

export const PersonalPagesOutlet: React.FC = () => {
  return (
    <div className="flex w-full md:w-5/6 h-4/5 grow justify-center place-items-center bg-white rounded-xl overflow-hidden shadow-md p-4 gap-4 lg:gap-8 flex-col">
      <PersonalPagesNavbar />
      <PersonalPagesContainer />
    </div>
  );
};
