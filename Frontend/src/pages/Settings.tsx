import React, { useEffect, useState } from 'react';
import { User, Bell, Shield, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode';

interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  isFirstLogin: boolean;
  profileUpdates: {
    count: number;
    remaining: number;
  };
}

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/profile');
      setProfile(response.data.user);
      setFormData({
        firstname: response.data.user.firstname,
        lastname: response.data.user.lastname,
        email: response.data.user.email
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.put('/api/auth/profile', formData);
      
      // Update local storage with new token
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      setProfile(prev => ({
        ...prev!,
        ...response.data.user,
        profileUpdates: {
          count: prev!.profileUpdates.count + (prev!.isFirstLogin ? 0 : 1),
          remaining: response.data.remainingUpdates || 0
        }
      }));

      setSuccess('Profile updated successfully');
      setIsEditing(false);

      // Refresh the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = profile && (
    formData.firstname !== profile.firstname ||
    formData.lastname !== profile.lastname ||
    formData.email !== profile.email
  );

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Settings</h1>
        <p className="text-[var(--color-text-secondary)]">Manage your account and preferences</p>
      </div>

      {profile?.isFirstLogin && (
        <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg mb-6">
          <p className="text-indigo-700 dark:text-indigo-200">
            Welcome! Please confirm or update your profile details below. 
            This first update won't count towards your update limit.
          </p>
        </div>
      )}

      {!profile?.isFirstLogin && profile?.profileUpdates.remaining < 3 && (
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-6">
          <p className="text-yellow-700 dark:text-yellow-200">
            You have {profile.profileUpdates.remaining} profile updates remaining.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-6">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6">
          <p className="text-green-700 dark:text-green-200">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className={`input w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className={`input w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input w-full ${!isEditing ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="flex gap-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="button button-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className={`button button-primary ${(!hasChanges || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!hasChanges || isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="button button-secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
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