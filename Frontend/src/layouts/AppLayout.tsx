import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Code2, Layout, Users, BookOpen, Settings as SettingsIcon, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, loading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getNavItemClasses = (path: string, exact = false) => {
    const active = exact ? location.pathname === path : isActive(path);
    
    if (isDarkMode) {
      return `p-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 shadow-lg' 
          : 'hover:bg-indigo-700/50 hover:shadow-md'
      }`;
    } else {
      return `p-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 shadow-lg' 
          : 'hover:bg-indigo-100 hover:shadow-md'
      }`;
    }
  };

  const getIconClasses = (path: string, exact = false) => {
    const active = exact ? location.pathname === path : isActive(path);
    
    if (isDarkMode) {
      return `w-6 h-6 transition-colors duration-200 ${
        active ? 'text-white' : 'text-gray-300 group-hover:text-white'
      }`;
    } else {
      return `w-6 h-6 transition-colors duration-200 ${
        active ? 'text-white' : 'text-indigo-600 group-hover:text-indigo-700'
      }`;
    }
  };

  const getMobileNavItemClasses = (path: string, exact = false) => {
    const active = exact ? location.pathname === path : isActive(path);
    
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-[var(--color-text-primary)] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:shadow-sm'
    }`;
  };

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#0B1120]' : 'bg-gray-100'}`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex w-20 ${isDarkMode ? 'bg-[#1A2234]' : 'bg-white'} flex-col items-center py-8 border-r border-[var(--color-border)]`}>
        <nav className="flex flex-col gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${getNavItemClasses(item.path, item.exact)} tooltip-right group`}
              data-tooltip={item.label}
            >
              <item.icon className={getIconClasses(item.path, item.exact)} />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all duration-200 tooltip-right group ${
              isDarkMode 
                ? 'hover:bg-indigo-700/50 hover:shadow-md' 
                : 'hover:bg-indigo-100 hover:shadow-md'
            }`}
            data-tooltip="Toggle Theme"
          >
            {isDarkMode ? 
              <Sun className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-200" /> : 
              <Moon className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200" />
            }
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            disabled={loading}
            className={`p-3 rounded-xl transition-all duration-200 tooltip-right group disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode 
                ? 'hover:bg-red-600/80 hover:shadow-md' 
                : 'hover:bg-red-100 hover:shadow-md'
            }`}
            data-tooltip="Logout"
          >
            <LogOut className={`w-6 h-6 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-300 group-hover:text-white' 
                : 'text-red-600 group-hover:text-red-700'
            }`} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 ${isDarkMode ? 'bg-[#1A2234]' : 'bg-white'} transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:hidden border-r border-[var(--color-border)]`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-500" />
              <span className="text-lg font-semibold text-[var(--color-text-primary)]">CodeFlask</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-text-primary)]" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={getMobileNavItemClasses(item.path, item.exact)}
                >
                  <item.icon className="w-5 h-5 transition-colors duration-200" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Footer Actions */}
          <div className="p-4 border-t border-[var(--color-border)] space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-primary)]"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">Toggle Theme</span>
            </button>
            <button 
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:bg-gray-500 text-[var(--color-text-primary)]"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className={`lg:hidden ${isDarkMode ? 'bg-[#1A2234]' : 'bg-white'} border-b border-[var(--color-border)] px-4 py-3`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <Menu className="w-5 h-5 text-[var(--color-text-primary)]" />
            </button>
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-500" />
              <span className="text-lg font-semibold text-[var(--color-text-primary)]">CodeFlask</span>
            </div>
            <div className="w-9"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;