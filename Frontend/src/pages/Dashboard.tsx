import React, { useEffect, useState } from 'react';
import { Trophy, Code, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/tokenUtils';

interface DashboardData {
  stats: {
    rank: number;
    problemsSolved: number;
    totalSubmissions: number;
    timeSpent: number;
  };
  recentActivity: Array<{
    id: string;
    problem: string;
    type: string;
    timestamp: string;
  }>;
  recommendedProblems: Array<{
    id: string;
    title: string;
    difficulty: string;
    category: string;
  }>;
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

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decodedToken = decodeToken(token);
      console.log('Decoded token:', decodedToken); // Debug log
      
      // Check for different possible user name fields
      const name = decodedToken?.name || 
                  decodedToken?.username || 
                  decodedToken?.fullName ||
                  decodedToken?.user?.name;
                  
      if (name) {
        setUserName(name);
      } else {
        console.log('No name found in token:', decodedToken); // Debug log
      }
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('Not authenticated');
          navigate('/login');
          return;
        }

        const response = await axiosInstance.get('/api/dashboard');
        setData(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/login');
        } else {
          setError('Failed to load dashboard data');
          console.error('Dashboard data fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

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

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Welcome back, {userName || 'Coder'}!
        </h1>
        <p className="text-[var(--color-text-secondary)]">Track your progress and start coding</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Rank</h3>
          <p className="text-4xl font-bold text-yellow-500">#{data.stats.rank}</p>
        </div>
        <div className="card p-6">
          <Code className="w-8 h-8 text-[#4B96F8] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Problems Solved</h3>
          <p className="text-4xl font-bold text-[#4B96F8]">{data.stats.problemsSolved}</p>
        </div>
        <div className="card p-6">
          <CheckCircle className="w-8 h-8 text-[#4ADE80] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Submissions</h3>
          <p className="text-4xl font-bold text-[#4ADE80]">{data.stats.totalSubmissions}</p>
        </div>
        <div className="card p-6">
          <Clock className="w-8 h-8 text-[#A855F7] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Time Spent</h3>
          <p className="text-4xl font-bold text-[#A855F7]">{data.stats.timeSpent}h</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 bg-[var(--color-bg-primary)] rounded-lg">
                  <div className="w-10 h-10 bg-[#4B96F8] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                    <Code className="w-5 h-5 text-[#4B96F8]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)]">{activity.problem}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {activity.type} • {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-[var(--color-text-secondary)] py-4">
                No activity yet. Start solving problems!
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Recommended Problems</h3>
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
                      <p className="text-sm text-[var(--color-text-secondary)]">{problem.difficulty} • {problem.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/app/problems/${problem.id}`)}
                    className="button button-primary"
                  >
                    Solve
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-[var(--color-text-secondary)] py-4">
                No recommendations available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;