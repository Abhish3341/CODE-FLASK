import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Code2, Layout, Users, BookOpen, Settings as SettingsIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, loading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'bg-indigo-700' : '';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { path: '/app', icon: Layout, label: 'Dashboard', exact: true },
    { path: '/app/problems', icon: Code2, label: 'Problems' },
    { path: '/app/submissions', icon: Users, label: 'Submissions' },
    { path: '/app/learn', icon: BookOpen, label: 'Learn' },
    { path: '/app/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#0B1120]' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-20 ${isDarkMode ? 'bg-[#1A2234]' : 'bg-white'} flex flex-col items-center py-8`}>
        <Link to="/" className="mb-8">
          <Code2 className="w-8 h-8 text-indigo-500" />
        </Link>
        <nav className="flex flex-col gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-3 rounded-xl hover:bg-indigo-700 transition-colors tooltip-right ${
                item.exact ? (location.pathname === item.path ? 'bg-indigo-700' : '') : isActive(item.path)
              }`}
              data-tooltip={item.label}
            >
              <item.icon className="w-6 h-6" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-indigo-700 transition-colors tooltip-right"
            data-tooltip="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="p-3 rounded-xl hover:bg-red-600 transition-colors tooltip-right disabled:bg-gray-500"
            data-tooltip="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollable-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;