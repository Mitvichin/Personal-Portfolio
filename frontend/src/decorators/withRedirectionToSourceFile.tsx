import { useGithubService } from '../services/github';
import { AppError } from '../types/AppError';
import { GetGithubFileContent } from '../types/GetGithubFileContent';
import { WithRedirectionToSourceFileProps } from '../types/WithRedirectionToSourceFileProps';
import { toast } from 'react-toastify';

const getCorrectOccurrenceOfString = (
  e: React.MouseEvent<Element>,
  wordSelection: Selection | null,
) => {
  const target = e.target as HTMLElement;
  const searchString = wordSelection?.toString().trim() || '';
  const wordSelectionOffset = wordSelection?.anchorOffset || 0;

  target.id = 'temp-search-id';
  const parentIndex = e.currentTarget.innerHTML.indexOf(target.id);
  const sentanceIndexStart =
    e.currentTarget.innerHTML.indexOf('>', parentIndex) + 1;
  const targetWordIndex = sentanceIndexStart + wordSelectionOffset;

  let currentIndex = -1;
  const searchWordIndexes = [];

  // Find index of correct searchString in case of multiple present
  while (
    (currentIndex = e.currentTarget.innerHTML.indexOf(
      searchString,
      currentIndex + 1,
    )) !== -1
  ) {
    searchWordIndexes.push(currentIndex);
    if (currentIndex === targetWordIndex) break;
  }

  target.id = '';

  return searchWordIndexes.length ? searchWordIndexes.length : -1;
};

const getIndexOfStringInSourceFile = (
  fileContent: string,
  searchString: string,
  wordCount: number,
): number => {
  const jsxOffset = fileContent.search('<.*>');
  let i = jsxOffset - searchString.length;
  let counter = 0;

  while (
    (i = fileContent.indexOf(searchString, i + searchString.length)) >= 0
  ) {
    counter++;
    if (counter === wordCount) {
      break;
    }
  }

  if (i === -1) throw new AppError(404, 'Not found');

  return i;
};

const getLineInSourceFile = (fileContent: string, stringIndex: number) => {
  let newLinesCount = 0;
  let i = -1;

  while ((i = fileContent.indexOf('\n', i + 1)) >= 0) {
    if (i >= stringIndex) break;
    newLinesCount++;
  }

  return newLinesCount + 1;
};

const redirectToLineInSourceFile = async (
  e: React.MouseEvent<Element>,
  filePath: string,
  fetchDocument: GetGithubFileContent,
) => {
  e.stopPropagation();
  const stringSelection = window.getSelection();
  const searchWord = stringSelection?.toString().trim() || '';
  const stringCount = getCorrectOccurrenceOfString(e, stringSelection);
  const notFoundMsg = 'Could not find a match for the clicked word.';

  try {
    const { content: fileContent, url } = await fetchDocument({
      searchWord,
      filePath,
    });

    const stringIndexInSourceFile = getIndexOfStringInSourceFile(
      fileContent,
      searchWord,
      stringCount,
    );

    const lineInSource = getLineInSourceFile(
      fileContent,
      stringIndexInSourceFile,
    );

    window.open(`${url}#L${lineInSource}`, `_newtab-#L${lineInSource}`);
  } catch (err) {
    if (err instanceof AppError) {
      if (err.code === 404) {
        toast.error(notFoundMsg);
      } else {
        toast.error(err.message);
      }

      return;
    }

    toast.error(notFoundMsg);
  }
};

export const withRedirectionToSourceFiles = <
  P extends WithRedirectionToSourceFileProps,
>(
  WrappedComponent: React.FC<P>,
) => {
  return (props: P) => {
    const { getFileContent } = useGithubService();
    return (
      <WrappedComponent
        {...props}
        redirectToLineInSourceFile={(e, fileName) =>
          redirectToLineInSourceFile(e, fileName, getFileContent)
        }
      />
    );
  };
};
