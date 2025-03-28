import { withRedirectionToSourceFiles } from "../../decorators/withRedirectionToSourceFile";
import { WithRedirectionToSourceFileProps } from "../../types/WithRedirectionToSourceFileProps";

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;

export const PersonalCard: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => {
    return (
      <div
        className="flex w-full md:w-4/6 justify-center place-items-center bg-white rounded-xl overflow-hidden shadow-xl p-4 gap-4 lg:gap-8 flex-col lg:flex-row max-w-4xl"
        onDoubleClick={(e) =>
          redirectToLineInSourceFile?.(e, CURRENT_FILE_PATH)
        }
      >
        <div className="flex-1 flex">
          <img
            className="object-contain max-h-[150px] rounded-xl"
            src="/me.jpg"
            alt="me"
          />
        </div>
        <div className="flex-4 flex place-items-start lg:place-items-center">
          <p className="text-sm text-[14px] sm:text-base lg:text-xl font-medium">
            Hi, I am Ilia Mitvichin a front-end developer with experience in
            creating user-friendly and responsive UI that meets business
            requirements, using modern JS frameworks.
          </p>
        </div>
      </div>
    );
  });
