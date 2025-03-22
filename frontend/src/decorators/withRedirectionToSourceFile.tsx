import { downloadRepoFile } from "../services.ts/github";
import { WithRedirectionToSourceFileProps } from "../types/WithRedirectionToSourceFileProps";

const getCorrectOccurrenceOfString = (
  e: React.MouseEvent<HTMLElement>,
  wordSelection: Selection | null
) => {
  const target = e.target as HTMLElement;
  const searchString = wordSelection?.toString().trim() || "";
  const wordSelectionOffset = wordSelection?.anchorOffset || 0;

  target.id = "temp-search-id";
  const parentIndex = e.currentTarget.innerHTML.indexOf(target.id);
  const sentanceIndexStart =
    e.currentTarget.innerHTML.indexOf(">", parentIndex) + 1;
  const targetWordIndex = sentanceIndexStart + wordSelectionOffset;

  let currentIndex = -1;
  const searchWordIndexes = [];

  // Find index of correct searchString in case of multiple present
  while (
    (currentIndex = e.currentTarget.innerHTML.indexOf(
      searchString,
      currentIndex + 1
    )) !== -1
  ) {
    searchWordIndexes.push(currentIndex);
    if (currentIndex === targetWordIndex) break;
  }

  target.id = "";

  return searchWordIndexes.length ? searchWordIndexes.length : -1;
};

const getIndexOfStringInSourceFile = (
  fileContent: string,
  searchString: string,
  wordCount: number
): number => {
  const jsxOffset = fileContent.search("<.*>");
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

  if (i === -1) throw Error("404 Word not found");

  return i;
};

const getLineInSourceFile = (fileContent: string, stringIndex: number) => {
  let newLinesCount = 0;
  let i = -1;

  while ((i = fileContent.indexOf("\n", i + 1)) >= 0) {
    if (i >= stringIndex) break;
    newLinesCount++;
  }

  return newLinesCount + 1;
};

const redirectToLineInSourceFile = async (
  e: React.MouseEvent<HTMLElement>,
  fileName: string
) => {
  e.stopPropagation();
  const stringSelection = window.getSelection();
  const searchString = stringSelection?.toString().trim() || "";

  const stringCount = getCorrectOccurrenceOfString(e, stringSelection);

  try {
    const { content: fileContent, url } = await downloadRepoFile(
      searchString,
      fileName
    );

    const stringIndexInSourceFile = getIndexOfStringInSourceFile(
      fileContent,
      searchString,
      stringCount
    );

    const lineInSource = getLineInSourceFile(
      fileContent,
      stringIndexInSourceFile
    );

    window.open(`${url}#L${lineInSource}`, `_newtab-#L${lineInSource}`);
  } catch {
    alert("404 Could not find a match for the clicked word.");
  }
};

export const withRedirectionToSourceFiles = <
  P extends WithRedirectionToSourceFileProps
>(
  WrappedComponent: React.FC<P>
) => {
  return (props: P) => {
    return (
      <WrappedComponent
        {...props}
        redirectToLineInSourceFile={redirectToLineInSourceFile}
      />
    );
  };
};
