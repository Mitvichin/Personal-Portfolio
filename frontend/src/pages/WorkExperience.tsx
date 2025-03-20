export const WorkExperience: React.FC = () => (
  <ul className="list-decimal">
    <li
      className="mb-5"
      onDoubleClick={(e) => {
        const target = e.target as HTMLElement;
        console.log(target.innerHTML);
      }}
    >
      <p className="font-medium">
        TINQIN - Front-end developer
        <span className="font-light"> Jun 2023 - Nov 2023</span>
      </p>
      <ul className="list-disc ml-3">
        <li>
          Designed and implement a core component responsible for placing and
          visualising elements over pdf documents.
        </li>
        <li>Migrated Angular e-signing app to React.</li>
        <li>React/TypeScript/Redux</li>
      </ul>
    </li>

    <li className="mb-5">
      <p className="font-medium">
        Y TREE - Front-end developer
        <span className="font-light"> Jun 2023 - Nov 2023</span>
      </p>
      <ul className="list-disc ml-3">
        <li>
          Back office platform supporting highly personalized finicial advices.
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
        <li>Using Jest and Cypress to write unit and integration tests.</li>
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
