import { downloadRepoFile } from "../services.ts/github";

export const WorkExperience: React.FC = () => {
  const doubleClick = async (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const wordSelection = window.getSelection();
    const searchString = wordSelection?.toString().trim() || "";

    target.id = "temp-search-id";
    const hostIndex = e.currentTarget.innerHTML.indexOf(target.id);
    const sentanceIndexStart =
      e.currentTarget.innerHTML.indexOf(">", hostIndex) + 1;

    const targetIndex = wordSelection?.anchorOffset || 0;
    const targetWordIndex = sentanceIndexStart + targetIndex;

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

    const searchIndex = indexes.length ? indexes.length - 1 : -1;
    console.log(searchIndex);

    try {
      // const fileContent = await downloadRepoFile(
      //   searchString,
      //   WorkExperience.name
      // );
      // const indexes = [];
      // let i = -1;
      // while ((i = fileContent.indexOf("\n", i + 1)) >= 0) {
      //   indexes.push(i);
      // }
      // const testContent = fileContent
      //   .replaceAll("\n", "")
      //   .replace(/\s+/g, " ")
      //   .trim();
      // i = -target.innerHTML.length;
      // let counter = -1;
      // while (
      //   (i = testContent.indexOf(
      //     target.innerHTML,
      //     i + target.innerHTML.length
      //   )) >= 0
      // ) {
      //   counter++;
      // }
      // console.log(indexes);
      // const index = testContent.indexOf(target.innerHTML);
      // console.log(fileContent[index]);
      // console.log(fileContent);
    } catch {
      alert("Could not find a match for the clicked word");
    }

    console.log(wordIndex, hostIndex);
  };
  return (
    <ul className="list-decimal" onDoubleClick={doubleClick}>
      <li className="mb-5">
        <p className="font-medium">
          <span className="font-light"> Jun 2023 - Nov 2023</span>
        </p>
        <ul className="list-disc ml-3">
          <li>
            Designed and visualising implement a core component responsible for
            placing and visualising visualising elements over pdf documents.
          </li>
          <li>Migrated Angular e-signing app to React.</li>
          <li>React/TypeScript/Redux visualising </li>
        </ul>
      </li>

      <li className="mb-5">
        <p className="font-medium">
          Y TREE - Front-end developer
          <span className="font-light"> Jun 2023 - Nov 2023</span>
        </p>
        <ul className="list-disc ml-3">
          <li>
            Back office platform supporting highly personalized finicial
            advices.
          </li>
          <li>Clean Architecture approach + micro frontends.</li>
          <li>React/TypeScript/Redux/MobX</li>
        </ul>
      </li>

      <li className="mb-5">
        <p className="font-medium">
          Kallidus - Front-end developer
          <span className="font-light"> May 2021 - Jun 2023</span>
        </p>
        <ul className="list-disc ml-3">
          <li>LMS application built with React + Redux.</li>
          <li>
            Implemented a business logic component which helped us have a
            consistent navigation across applications.
          </li>
          <li>
            Using Jest and Cypress to write unit and integration tests.
            visualising{" "}
          </li>
        </ul>
      </li>

      <li className="mb-5">
        <p className="font-medium">
          Kodar - Web Developer
          <span className="font-light"> Jun 2018 - Apr 2021</span>
        </p>
        <ul className="list-disc ml-3">
          <li>
            Worked for different clients and got introduced to different
            technologies like: React, jQuery, Xamarin, .Net ASP and more.
          </li>
        </ul>
      </li>
    </ul>
  );
};
