import { downloadRepoFile } from "../services.ts/github";
import { WithRedirectionToSourceFileProps } from "../types/WithRedirectionToSourceFileProps";

export const withRedirectionToSourceFiles = <
  P extends WithRedirectionToSourceFileProps
>(
  WrappedComponent: React.FC<P>
) => {
  return (props: P) => {
    const redirectToLineInSourceFile = async (
      e: React.MouseEvent<HTMLElement>,
      fileName: string
    ) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const wordSelection = window.getSelection();
      const searchString = wordSelection?.toString().trim() || "";

      target.id = "temp-search-id";
      const parentIndex = e.currentTarget.innerHTML.indexOf(target.id);
      const sentanceIndexStart =
        e.currentTarget.innerHTML.indexOf(">", parentIndex) + 1;

      const wordSelectionOffset = wordSelection?.anchorOffset || 0;
      const targetWordIndex = sentanceIndexStart + wordSelectionOffset;

      let currentIndex = -1;
      const indexes = [];

      while (
        (currentIndex = e.currentTarget.innerHTML.indexOf(
          searchString,
          currentIndex + 1
        )) !== -1
      ) {
        indexes.push(currentIndex);
        if (currentIndex === targetWordIndex) break;
      }

      target.id = "";

      const wordCount = indexes.length ? indexes.length : -1;

      console.log(fileName);
      try {
        const { content: fileContent, url } = await downloadRepoFile(
          searchString,
          fileName
        );

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

        const targetIndexInSourceFile = i;

        if (targetIndexInSourceFile === -1) throw Error("404 Word not found");

        const indexes = [];
        i = -1;
        while ((i = fileContent.indexOf("\n", i + 1)) >= 0) {
          if (i >= targetIndexInSourceFile) break;
          indexes.push(i);
        }

        const lineInSource = indexes.length + 1;

        window.open(`${url}#L${lineInSource}`, `_newtab-#L${lineInSource}`);
      } catch {
        alert("404 Could not find a match for the clicked word.");
      }
    };

    return (
      <WrappedComponent
        {...props}
        redirectToLineInSourceFile={redirectToLineInSourceFile}
      />
    );
  };
};
