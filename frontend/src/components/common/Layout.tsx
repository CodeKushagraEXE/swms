import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../hooks/useAppDispatch';

export default function Layout() {
  const sidebarOpen = useAppSelector(s => s.ui.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col overflow-hidden min-w-0 w-full transition-[margin] duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
