import { withRedirectionToSourceFiles } from '../decorators/withRedirectionToSourceFile';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';

const CURRENT_FILE_PATH = new URL(import.meta.url).pathname;

export const SideProjects: React.FC<WithRedirectionToSourceFileProps> =
  withRedirectionToSourceFiles(({ redirectToLineInSourceFile }) => (
    <div
      className="flex w-full h-full flex-col text-[14px] sm:text-base"
      onDoubleClick={(e) => redirectToLineInSourceFile?.(e, CURRENT_FILE_PATH)}
    >
      <ul className="list-decimal flex-1">
        <li className="mb-5">
          <p className="font-medium">
            Crossword generator -
            <span className="font-normal">
              Tool that can generate crosswords when provided comma separated
              words. You can check it{' '}
              <a
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href="https://crossword-generator-brown.vercel.app/"
                target="_blank"
              >
                here{' '}
              </a>
              and its repository{' '}
              <a
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href="https://github.com/Mitvichin/SortingVisualiser"
                target="_blank"
              >
                here.
              </a>
              You can also use{' '}
              <a
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href="https://codebeautify.org/random-word-generator"
                target="_blank"
              >
                this word generator
              </a>{' '}
              to generate comma separated words.
            </span>
          </p>
        </li>
        <li className="mb-5">
          <p className="font-medium">
            Sorting Visualise -
            <span className="font-normal">
              Visualises how different sorting algorithms work. You can check
              its repository{' '}
              <a
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href="https://github.com/Mitvichin/SortingVisualiser"
                target="_blank"
              >
                here.
              </a>
            </span>
          </p>
        </li>
      </ul>
      <embed
        src="https://crossword-generator-brown.vercel.app/"
        className="w-full h-full grow hidden md:inline-block"
      />
    </div>
  ));
