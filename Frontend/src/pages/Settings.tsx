import React, { useEffect, useState } from 'react';
import { User, Bell, Shield, Monitor, Moon, Sun, Eye, EyeOff, Lock, AlertTriangle, Info, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';

interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  isFirstLogin: boolean;
  isOAuthUser: boolean;
  authMethod: 'email' | 'google' | 'github';
  canEditEmail: boolean;
  profileUpdates: {
    count: number;
    remaining: number;
  };
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: ''
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  
  // State for temporary email restriction message
  const [showEmailRestrictionMessage, setShowEmailRestrictionMessage] = useState(false);
  const [emailRestrictionTimer, setEmailRestrictionTimer] = useState<NodeJS.Timeout | null>(null);
  const [hasTriedToEditEmail, setHasTriedToEditEmail] = useState(false);

  // State for OAuth info box expansion
  const [isOAuthInfoExpanded, setIsOAuthInfoExpanded] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (emailRestrictionTimer) {
        clearTimeout(emailRestrictionTimer);
      }
    };
  }, [emailRestrictionTimer]);

  const fetchUserProfile = async () => {
    try {
      console.log('🔄 Fetching user profile...');
      const response = await axiosInstance.get('/api/auth/profile');
      const userData = response.data.user;
      
      console.log('👤 Profile data received:', userData);
      
      setProfile({
        ...userData,
        profileUpdates: {
          count: userData.profileUpdates?.count || 0,
          remaining: 3 - (userData.profileUpdates?.count || 0)
        }
      });
      
      setFormData({
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        email: userData.email || ''
      });
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setError('Failed to load profile data');
    }
  };

  const showTemporaryEmailRestriction = () => {
    // Clear any existing timer
    if (emailRestrictionTimer) {
      clearTimeout(emailRestrictionTimer);
    }

    // Show the message
    setShowEmailRestrictionMessage(true);
    setHasTriedToEditEmail(true);

    // Set a new timer to hide the message after 10 seconds
    const timer = setTimeout(() => {
      setShowEmailRestrictionMessage(false);
      setEmailRestrictionTimer(null);
    }, 10000);

    setEmailRestrictionTimer(timer);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Check if user is trying to edit email and is OAuth user
    if (name === 'email' && profile?.isOAuthUser && value !== profile.email && isEditing) {
      // Show temporary restriction message only if they haven't seen it yet in this editing session
      if (!hasTriedToEditEmail) {
        showTemporaryEmailRestriction();
      }
      return; // Don't update the email field
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSectionToggle = () => {
    if (!showPasswordSection) {
      // Check if user is OAuth user
      if (profile?.isOAuthUser) {
        setPasswordError(`Password cannot be changed for ${profile.authMethod === 'google' ? 'Google' : 'GitHub'} OAuth accounts. Your password is managed by ${profile.authMethod === 'google' ? 'Google' : 'GitHub'}.`);
        return;
      }
      setShowPasswordConfirmation(true);
    } else {
      setShowPasswordSection(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
      setPasswordSuccess('');
    }
  };

  const confirmPasswordSectionAccess = () => {
    setShowPasswordConfirmation(false);
    setShowPasswordSection(true);
  };

  const cancelPasswordSectionAccess = () => {
    setShowPasswordConfirmation(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordSuccess('Password updated successfully. Please log in again with your new password.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Log out after successful password change
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      if (error.response?.data?.isOAuthRestriction) {
        setPasswordError(error.response.data.error);
      } else {
        const errorMessage = error.response?.data?.error || 
                           (error.response?.data?.errors && error.response.data.errors.join(', ')) ||
                           'Failed to update password';
        setPasswordError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
    // Reset email restriction tracking when starting to edit
    setHasTriedToEditEmail(false);
    if (emailRestrictionTimer) {
      clearTimeout(emailRestrictionTimer);
      setEmailRestrictionTimer(null);
    }
    setShowEmailRestrictionMessage(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Clear email restriction message and tracking when canceling edit
    setHasTriedToEditEmail(false);
    if (emailRestrictionTimer) {
      clearTimeout(emailRestrictionTimer);
      setEmailRestrictionTimer(null);
    }
    setShowEmailRestrictionMessage(false);
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

    // Validate required fields
    if (!formData.firstname.trim() || !formData.lastname.trim() || !formData.email.trim()) {
      setError('All fields are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('📤 Submitting profile update:', formData);
      
      const response = await axiosInstance.put('/api/auth/profile', {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim()
      });
      
      console.log('✅ Profile update response:', response.data);
      
      // Update local storage with new token
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      setProfile(prev => ({
        ...prev!,
        ...response.data.user,
        profileUpdates: {
          count: response.data.user.profileUpdates?.count || 0,
          remaining: response.data.remainingUpdates || 0
        }
      }));

      setSuccess('Profile updated successfully');
      setIsEditing(false);

      // Clear email restriction tracking after successful update
      setHasTriedToEditEmail(false);
      if (emailRestrictionTimer) {
        clearTimeout(emailRestrictionTimer);
        setEmailRestrictionTimer(null);
      }
      setShowEmailRestrictionMessage(false);

      // Refresh the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      console.error('❌ Error response data:', error.response?.data);
      
      // Enhanced error handling to show specific error messages
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.isOAuthRestriction) {
          setError(errorData.error);
        } else if (errorData.error) {
          // Show the specific error message from the backend
          setError(errorData.error);
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          // Handle validation errors array
          setError(errorData.errors.join(', '));
        } else {
          setError('Failed to update profile');
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = profile && (
    formData.firstname !== profile.firstname ||
    formData.lastname !== profile.lastname ||
    (formData.email !== profile.email && !profile.isOAuthUser)
  );

  const getAuthMethodDisplay = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return 'Google OAuth';
      case 'github':
        return 'GitHub OAuth';
      default:
        return 'Email & Password';
    }
  };

  const getOAuthProviderName = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      default:
        return 'Unknown';
    }
  };

  const getOAuthIcon = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Debug: Log the profile data to see what we're getting
  console.log('🔍 Current profile data:', profile);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 p-8">
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

        {/* Minimized OAuth User Information - Show for OAuth users with correct provider */}
        {profile?.isOAuthUser && profile?.authMethod && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-6">
            {/* Minimized Header */}
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors rounded-lg"
              onClick={() => setIsOAuthInfoExpanded(!isOAuthInfoExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full">
                  {getOAuthIcon(profile.authMethod)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {getOAuthProviderName(profile.authMethod)} Account
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Email and password managed by {getOAuthProviderName(profile.authMethod)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600 dark:text-blue-400 hidden sm:inline">
                  {isOAuthInfoExpanded ? 'Less info' : 'More info'}
                </span>
                {isOAuthInfoExpanded ? 
                  <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : 
                  <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                }
              </div>
            </div>

            {/* Expanded Content */}
            {isOAuthInfoExpanded && (
              <div className="px-3 pb-3 border-t border-blue-200 dark:border-blue-800 mt-2 pt-3">
                <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    <strong>Account Restrictions:</strong>
                  </p>
                  <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 ml-4">
                    <li>• Email address cannot be changed here</li>
                    <li>• Password is managed by {getOAuthProviderName(profile.authMethod)}</li>
                    <li>• To update email or password, use your {getOAuthProviderName(profile.authMethod)} account settings</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6">
            <p className="text-green-700 dark:text-green-200">{success}</p>
          </div>
        )}

        {/* Temporary Email Restriction Message - Only show when editing and trying to change email */}
        {showEmailRestrictionMessage && profile?.isOAuthUser && isEditing && (
          <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg mb-6 animate-pulse">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="text-orange-800 dark:text-orange-200 font-medium mb-1">
                  Email Cannot Be Changed
                </h3>
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  Your email address is managed by {getOAuthProviderName(profile.authMethod)} 
                  and cannot be modified here. To change your email, please update it in your {getOAuthProviderName(profile.authMethod)} account settings.
                </p>
                <p className="text-orange-600 dark:text-orange-400 text-xs mt-2 italic">
                  This message will disappear in a few seconds...
                </p>
              </div>
            </div>
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
                    {profile?.isOAuthUser && (
                      <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                        (Managed by {getOAuthProviderName(profile.authMethod)})
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input w-full ${
                      !isEditing || profile?.isOAuthUser 
                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
                        : ''
                    }`}
                    disabled={!isEditing || profile?.isOAuthUser}
                    required
                    title={profile?.isOAuthUser ? `Email is managed by ${getOAuthProviderName(profile.authMethod)}` : ''}
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

            {/* Authentication Method Info */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Authentication Method
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-full">
                      {getOAuthIcon(profile?.authMethod || 'email')}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {getAuthMethodDisplay(profile?.authMethod || 'email')}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {profile?.isOAuthUser 
                          ? `Authenticated via ${getOAuthProviderName(profile.authMethod)}`
                          : 'Traditional email and password authentication'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="mt-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </h2>
            </div>

            {passwordError && (
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-6">
                <p className="text-red-700 dark:text-red-200">{passwordError}</p>
              </div>
            )}

            {!showPasswordSection ? (
              <div className="flex items-center justify-between p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  <div>
                    <h3 className="font-medium text-[var(--color-text-primary)]">Change Password</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {profile?.isOAuthUser 
                        ? `Password is managed by ${getOAuthProviderName(profile.authMethod)}`
                        : 'Update your account password for better security'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePasswordSectionToggle}
                  className={`button ${profile?.isOAuthUser ? 'button-secondary opacity-50 cursor-not-allowed' : 'button-primary'}`}
                  disabled={profile?.isOAuthUser}
                >
                  Change Password
                </button>
              </div>
            ) : (
              <div>
                {passwordSuccess && (
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6">
                    <p className="text-green-700 dark:text-green-200">{passwordSuccess}</p>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="input w-full pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="input w-full pr-12"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                      Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input w-full pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className={`button button-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating Password...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={handlePasswordSectionToggle}
                      className="button button-secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Password Confirmation Modal */}
        {showPasswordConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Security Confirmation
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-6">
                You are about to access the password change section. This action will allow you to modify your account security settings. Are you sure you want to continue?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={confirmPasswordSectionAccess}
                  className="button button-primary flex-1"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={cancelPasswordSectionAccess}
                  className="button button-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-500" />
              <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
            </div>
            <div className="text-[var(--color-text-secondary)]">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;