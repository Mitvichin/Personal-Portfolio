import { Outlet } from 'react-router';
import { Sidebar } from '../shared/Sidebar';

export const SidebarLayout: React.FC = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};
