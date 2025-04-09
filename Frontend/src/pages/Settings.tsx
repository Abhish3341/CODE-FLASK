import React, { useEffect, useState } from 'react';
import { User, Bell, Shield, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  exp: number;
}

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [userData, setUserData] = useState<{ name: string; email: string }>({ name: '', email: '' });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.firstname && decoded.lastname && decoded.email) {
          setUserData({
            name: `${decoded.firstname} ${decoded.lastname}`.trim(),
            email: decoded.email
          });
        } else {
          console.error('Required user data missing from token');
          setUserData({ name: 'User', email: 'Not available' });
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        setUserData({ name: 'User', email: 'Not available' });
      }
    }
  }, []);

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Settings</h1>
        <p className="text-[var(--color-text-secondary)]">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Display Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={userData.name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={userData.email}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Bio</label>
                <textarea
                  className="input w-full"
                  rows={4}
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)]">Email Notifications</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Receive email updates about your activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)]">Problem Updates</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Get notified about new problems and contests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </h2>
            <div className="space-y-4">
              <button className="button button-primary w-full">
                Change Password
              </button>
              <button className="button button-secondary w-full">
                Enable 2FA
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="text-[var(--color-text-primary)]">Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;