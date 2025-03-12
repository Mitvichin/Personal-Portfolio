export const PersonalCard: React.FC = () => {
  return (
    <div className="flex w-full md:w-4/6 h-auto md:h-1/4 justify-center place-items-center bg-white rounded-xl overflow-hidden shadow-xl p-4 gap-4 lg:gap-8 flex-col lg:flex-row max-w-4xl">
      <div className="flex-1 md:flex-1  flex place-items-center">
        <img
          className="h-25 w-25 lg:h-48 lg:w-96 object-cover rounded-xl"
          src="/public/me.jpg"
          alt="me"
        />
      </div>
      <div className="flex-4 flex place-items-start lg:place-items-center">
        <p className="text-sm md:text-base lg:text-2xl font-medium">
          Front-end developer with experience in creating user-friendly and
          responsive UI that meets business requirements, using modern JS
          frameworks.
        </p>
      </div>
    </div>
  );
};
