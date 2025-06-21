import React, { useEffect, useState } from 'react';
import { Trophy, Code, CheckCircle, Clock, TrendingUp, Target, Zap, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';

interface DashboardData {
  stats: {
    rank: number;
    problemsSolved: number;
    totalProblems: number;
    totalSubmissions: number;
    timeSpent: number;
    successRate: number;
    averageTime: number;
    easyProblems: { solved: number; attempted: number };
    mediumProblems: { solved: number; attempted: number };
    hardProblems: { solved: number; attempted: number };
    languageStats: {
      python: { solved: number; attempted: number };
      javascript: { solved: number; attempted: number };
      java: { solved: number; attempted: number };
      cpp: { solved: number; attempted: number };
    };
  };
  recentActivity: Array<{
    id: string;
    problem: string;
    type: string;
    language: string;
    timeSpent: number;
    timestamp: string;
  }>;
  recommendedProblems: Array<{
    id: string;
    title: string;
    difficulty: string;
    category: string;
    acceptance: number;
  }>;
  userLevel: string;
}

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  return 'just now';
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'solved':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'submitted':
      return <Code className="w-5 h-5 text-blue-500" />;
    case 'attempted':
      return <Target className="w-5 h-5 text-yellow-500" />;
    default:
      return <Code className="w-5 h-5 text-gray-500" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'solved':
      return 'bg-green-500/20';
    case 'submitted':
      return 'bg-blue-500/20';
    case 'attempted':
      return 'bg-yellow-500/20';
    default:
      return 'bg-gray-500/20';
  }
};

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('Not authenticated');
          return;
        }

        const response = await axiosInstance.get('/api/dashboard');
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSolveProblem = (problemId: string) => {
    window.open(`/app/problems/${problemId}/solve`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { stats } = data;

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Welcome back, {user?.firstname} {user?.lastname}!
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Track your progress and continue your coding journey
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Rank</h3>
          <p className="text-4xl font-bold text-yellow-500">
            {stats.rank === 0 ? '-' : `#${stats.rank}`}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Global ranking
          </p>
        </div>

        <div className="card p-6">
          <Code className="w-8 h-8 text-[#4B96F8] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Solved</h3>
          <p className="text-4xl font-bold text-[#4B96F8]">
            {stats.problemsSolved}/{stats.totalProblems}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Problems completed
          </p>
        </div>

        <div className="card p-6">
          <TrendingUp className="w-8 h-8 text-[#4ADE80] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Success Rate</h3>
          <p className="text-4xl font-bold text-[#4ADE80]">{stats.successRate}%</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {stats.totalSubmissions} submissions
          </p>
        </div>

        <div className="card p-6">
          <Clock className="w-8 h-8 text-[#A855F7] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Avg. Time</h3>
          <p className="text-4xl font-bold text-[#A855F7]">{stats.averageTime}m</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Per problem
          </p>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Easy Problems</h3>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-500 mb-2">{stats.easyProblems.solved}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stats.easyProblems.attempted} attempted
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Medium Problems</h3>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-500 mb-2">{stats.mediumProblems.solved}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stats.mediumProblems.attempted} attempted
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Hard Problems</h3>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-500 mb-2">{stats.hardProblems.solved}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stats.hardProblems.attempted} attempted
          </p>
        </div>
      </div>

      {/* Activity and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className={`flex items-center p-3 ${getActivityColor(activity.type)} rounded-lg`}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--color-text-primary)]">{activity.problem}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {activity.type} • {activity.language} • {formatRelativeTime(activity.timestamp)}
                      {activity.timeSpent > 0 && ` • ${activity.timeSpent}m`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-[var(--color-text-secondary)] py-8">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activity yet. Start solving problems!</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Recommended for You</h3>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-500 rounded-full text-sm">
              {data.userLevel} Level
            </span>
          </div>
          <div className="space-y-4">
            {data.recommendedProblems.length > 0 ? (
              data.recommendedProblems.map((problem) => (
                <div key={problem.id} className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#4ADE80] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                      <Code className="w-5 h-5 text-[#4ADE80]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--color-text-primary)]">{problem.title}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {problem.difficulty} • {problem.category} • {problem.acceptance}% acceptance
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSolveProblem(problem.id)}
                    className="button button-primary"
                  >
                    Solve
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-[var(--color-text-secondary)] py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Great job! You've solved all recommended problems.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;