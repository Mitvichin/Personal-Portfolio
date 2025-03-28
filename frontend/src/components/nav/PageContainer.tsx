import { Outlet } from "react-router";

export const PageContainer: React.FC = () => {
  return (
    <>
      <div className="flex-1 flex w-full self-start rounded-xl p-5 lg:p-10  bg-gray-50 shadow-sm overflow-auto">
        <Outlet />
      </div>
    </>
  );
};
