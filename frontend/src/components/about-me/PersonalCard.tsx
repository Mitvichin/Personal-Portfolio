import { withRedirectionToSourceFiles } from "../../decorators/withRedirectionToSourceFile";
import { WithRedirectionToSourceFileProps } from "../../types/WithRedirectionToSourceFileProps";

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;

export const PersonalCard: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ onDoubleClick }) => {
    return (
      <div
        className="flex w-full md:w-4/6 h-2/6 sm:h-1/4  justify-center place-items-center bg-white rounded-xl overflow-hidden shadow-xl p-4 gap-4 lg:gap-8 flex-col lg:flex-row max-w-4xl"
        onDoubleClick={(e) => onDoubleClick?.(e, CURRENT_FILE_PATH)}
      >
        <div className="flex-1 md:flex-1  flex place-items-center">
          <img
            className="h-25 w-25 lg:h-48 lg:w-96 object-cover rounded-xl"
            src="/me.jpg"
            alt="me"
          />
        </div>
        <div className="flex-4 flex place-items-start lg:place-items-center">
          <p className="text-sm md:text-base lg:text-2xl font-medium">
            Hi, I am Ilia Mitvichin a front-end developer with experience in
            creating user-friendly and responsive UI that meets business
            requirements, using modern JS frameworks.
          </p>
        </div>
      </div>
    );
  });
