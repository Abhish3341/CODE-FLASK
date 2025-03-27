import React from 'react';
import { Trophy, Code, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Welcome back, Developer!</h1>
        <p className="text-[var(--color-text-secondary)]">Track your progress and start coding</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Rank</h3>
          <p className="text-4xl font-bold text-yellow-500">#42</p>
        </div>
        <div className="card p-6">
          <Code className="w-8 h-8 text-[#4B96F8] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Problems Solved</h3>
          <p className="text-4xl font-bold text-[#4B96F8]">156</p>
        </div>
        <div className="card p-6">
          <CheckCircle className="w-8 h-8 text-[#4ADE80] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Submissions</h3>
          <p className="text-4xl font-bold text-[#4ADE80]">289</p>
        </div>
        <div className="card p-6">
          <Clock className="w-8 h-8 text-[#A855F7] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Time Spent</h3>
          <p className="text-4xl font-bold text-[#A855F7]">124h</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center p-3 bg-[var(--color-bg-primary)] rounded-lg">
                <div className="w-10 h-10 bg-[#4B96F8] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <Code className="w-5 h-5 text-[#4B96F8]" />
                </div>
                <div>
                  <h4 className="font-medium text-[var(--color-text-primary)]">Two Sum</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">Solved • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Recommended Problems</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#4ADE80] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                    <Code className="w-5 h-5 text-[#4ADE80]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)]">Valid Parentheses</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">Easy • Stack</p>
                  </div>
                </div>
                <button className="button button-primary">
                  Solve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;