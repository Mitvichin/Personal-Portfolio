import { Outlet } from 'react-router';
import { Sidebar } from '../nav/Sidebar';

export const SidebarLayout: React.FC = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};
