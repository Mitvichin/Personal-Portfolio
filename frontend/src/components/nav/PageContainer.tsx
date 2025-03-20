import { Outlet } from "react-router";

export const PageContainer: React.FC = () => {
  return (
    <>
      <div className="flex-4 w-full self-start rounded-xl p-10  bg-gray-50 shadow-sm">
        <Outlet />
      </div>
    </>
  );
};
