import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingSkeleton = () => {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200';

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      {/* Header Section */}
      <div className="mb-8">
        <div className={`h-8 w-64 ${bgColor} rounded-lg mb-2`}></div>
        <div className={`h-4 w-48 ${bgColor} rounded-lg`}></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className={`h-8 w-8 ${bgColor} rounded-lg mb-4`}></div>
            <div className={`h-6 w-24 ${bgColor} rounded-lg mb-1`}></div>
            <div className={`h-8 w-16 ${bgColor} rounded-lg`}></div>
          </div>
        ))}
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card p-6">
          <div className={`h-6 w-32 ${bgColor} rounded-lg mb-4`}></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-3 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse">
                <div className={`w-10 h-10 ${bgColor} rounded-lg mr-4`}></div>
                <div className="flex-1">
                  <div className={`h-4 w-24 ${bgColor} rounded-lg mb-2`}></div>
                  <div className={`h-3 w-32 ${bgColor} rounded-lg`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Problems */}
        <div className="card p-6">
          <div className={`h-6 w-40 ${bgColor} rounded-lg mb-4`}></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg animate-pulse">
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 ${bgColor} rounded-lg mr-4`}></div>
                  <div>
                    <div className={`h-4 w-32 ${bgColor} rounded-lg mb-2`}></div>
                    <div className={`h-3 w-24 ${bgColor} rounded-lg`}></div>
                  </div>
                </div>
                <div className={`h-8 w-16 ${bgColor} rounded-lg ml-4`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;