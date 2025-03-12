export const Tabs: React.FC = () => {
  return (
    <div className="flex-1 flex w-full text-center align-middle shadow-sm rounded-2xl border border-gray-300">
      <div className="flex-1 flex text-base border-r hover:scale-110 hover:cursor-pointer transition-all border-gray-300">
        <p className="m-auto">Work Experience</p>
      </div>
      <div className="flex-1 flex border-r hover:scale-110 hover:cursor-pointer transition-all border-gray-300">
        <p className="m-auto">Side Projects</p>
      </div>
      <div className="flex-1 flex hover:scale-110 hover:cursor-pointer transition-all">
        <p className="m-auto">Contact Me</p>
      </div>
    </div>
  );
};
