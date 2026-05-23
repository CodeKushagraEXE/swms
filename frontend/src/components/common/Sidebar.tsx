import { NavLink, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import UserAvatar from './UserAvatar';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/projects', icon: '📁', label: 'Projects' },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(s => s.ui.sidebarOpen);
  const user = useAppSelector(s => s.auth.user);
  const items = user?.role === 'ADMIN'
    ? [...navItems, { to: '/admin/auth-audit', icon: '🔐', label: 'Auth Audit' }]
    : navItems;

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 top-16 bg-black/40 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                 ${isActive
                   ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                   : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'}`
              }
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
            <Link
              to="/profile"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <UserAvatar user={user} size="sm" />
              <div className="overflow-hidden min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                  {user.role}
                </span>
              </div>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
