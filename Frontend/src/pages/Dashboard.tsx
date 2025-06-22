import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Code, CheckCircle, Clock, TrendingUp, Target, Zap, Award, ExternalLink, Calendar, Flame, BarChart3, PieChart, FileText, Play, AlertCircle } from 'lucide-react';
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
  progressOverview: {
    currentStreak: number;
    thisWeekTime: number;
    difficultyRates: {
      easy: number;
      medium: number;
      hard: number;
    };
    languageDistribution: Record<string, number>;
    weeklyActivity: Array<{
      date: string;
      day: string;
      count: number;
      timeSpent: number;
    }>;
    monthlyProgress: {
      solved: number;
      attempted: number;
    };
    totalActiveDays: number;
    averageSessionTime: number;
  };
  recommendedProblems: Array<{
    id: string;
    title: string;
    difficulty: string;
    category: string;
    status: 'not-attempted' | 'attempted' | 'submitted' | 'solved';
  }>;
  userLevel: string;
}

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
    // Open problem in new tab
    const url = `/app/problems/${problemId}/solve`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-500 bg-green-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return <Target className="w-4 h-4" />;
      case 'medium':
        return <Zap className="w-4 h-4" />;
      case 'hard':
        return <Award className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'submitted':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'attempted':
        return <Play className="w-6 h-6 text-yellow-500" />;
      default:
        return <div className="w-6 h-6 border-2 border-[var(--color-border)] rounded-full"></div>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'solved':
        return 'Solved';
      case 'submitted':
        return 'Submitted';
      case 'attempted':
        return 'Attempted';
      default:
        return 'Not Attempted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved':
        return 'border-l-4 border-green-500 bg-green-500/5';
      case 'submitted':
        return 'border-l-4 border-blue-500 bg-blue-500/5';
      case 'attempted':
        return 'border-l-4 border-yellow-500 bg-yellow-500/5';
      default:
        return 'border-l-4 border-transparent';
    }
  };

  const getSolveButtonStyle = (status: string) => {
    switch (status) {
      case 'solved':
        return 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/30';
      case 'submitted':
        return 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border border-blue-500/30';
      case 'attempted':
        return 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/30';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    }
  };

  const getSolveButtonText = (status: string) => {
    switch (status) {
      case 'solved':
        return 'Solved';
      case 'submitted':
        return 'Review';
      case 'attempted':
        return 'Continue';
      default:
        return 'Solve';
    }
  };

  const renderDifficultyChart = () => {
    if (!data?.progressOverview.difficultyRates) return null;
    
    const { easy, medium, hard } = data.progressOverview.difficultyRates;
    const maxRate = Math.max(easy, medium, hard, 1);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-[var(--color-text-secondary)]">Easy</span>
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{easy}%</span>
        </div>
        <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(easy / maxRate) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-[var(--color-text-secondary)]">Medium</span>
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{medium}%</span>
        </div>
        <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(medium / maxRate) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-[var(--color-text-secondary)]">Hard</span>
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{hard}%</span>
        </div>
        <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(hard / maxRate) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderLanguageDistribution = () => {
    if (!data?.progressOverview.languageDistribution) return null;
    
    const languages = Object.entries(data.progressOverview.languageDistribution);
    const total = languages.reduce((sum, [, count]) => sum + count, 0);
    
    if (total === 0) {
      return (
        <div className="text-center text-[var(--color-text-secondary)] py-4">
          <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No coding activity yet</p>
        </div>
      );
    }
    
    const colors = {
      python: '#3776ab',
      javascript: '#f7df1e',
      java: '#ed8b00',
      cpp: '#00599c'
    };
    
    return (
      <div className="space-y-3">
        {languages.map(([language, count]) => {
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={language} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[language as keyof typeof colors] || '#6b7280' }}
                ></div>
                <span className="text-sm text-[var(--color-text-secondary)] capitalize">
                  {language}
                </span>
              </div>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyActivity = () => {
    if (!data?.progressOverview.weeklyActivity) return null;
    
    const maxCount = Math.max(...data.progressOverview.weeklyActivity.map(d => d.count), 1);
    
    return (
      <div className="flex items-end justify-between gap-2 h-20">
        {data.progressOverview.weeklyActivity.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1 flex-1">
            <div 
              className="w-full bg-indigo-500 rounded-t transition-all duration-500 min-h-[4px]"
              style={{ 
                height: `${Math.max((day.count / maxCount) * 60, 4)}px`,
                opacity: day.count > 0 ? 1 : 0.3
              }}
              title={`${day.count} activities on ${day.day}`}
            ></div>
            <span className="text-xs text-[var(--color-text-secondary)]">{day.day}</span>
          </div>
        ))}
      </div>
    );
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

  const { stats, progressOverview } = data;

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

        {/* Make the Solved card clickable */}
        <Link to="/app/problems" className="card p-6 hover:shadow-lg transition-all cursor-pointer">
          <Code className="w-8 h-8 text-[#4B96F8] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">Solved</h3>
          <p className="text-4xl font-bold text-[#4B96F8]">
            {stats.problemsSolved}/{stats.totalProblems}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Problems completed
          </p>
        </Link>

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

      {/* Progress Overview and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            
            Progress Overview
          </h3>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {progressOverview.currentStreak}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Day Streak</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {Math.round(progressOverview.thisWeekTime / 60)}h
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">This Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Weekly Activity</h4>
            {renderWeeklyActivity()}
          </div>

          {/* Difficulty Completion Rates */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Difficulty Completion</h4>
            {renderDifficultyChart()}
          </div>

          {/* Language Distribution */}
          <div>
            <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Language Usage</h4>
            {renderLanguageDistribution()}
          </div>
        </div>

        {/* Recommended Problems - Updated Design */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Activity and Recommendations</h3>
            
          </div>
          
          <div className="space-y-4">
            {data.recommendedProblems.length > 0 ? (
              data.recommendedProblems.map((problem) => (
                <div key={problem.id} className={`p-4 rounded-lg transition-all hover:shadow-md ${getStatusColor(problem.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {getStatusIcon(problem.status)}
                      </div>

                      {/* Problem Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-[var(--color-text-primary)]">
                            {problem.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getDifficultyColor(problem.difficulty)}`}>
                            {getDifficultyIcon(problem.difficulty)}
                            {problem.difficulty}
                          </span>
                          {/* Status Badge */}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            problem.status === 'solved' ? 'bg-green-500/20 text-green-500' :
                            problem.status === 'submitted' ? 'bg-blue-500/20 text-blue-500' :
                            problem.status === 'attempted' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-gray-500/20 text-gray-500'
                          }`}>
                            {getStatusText(problem.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                          <Code className="w-4 h-4" />
                          {problem.category}
                        </div>
                      </div>

                      {/* Solve Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleSolveProblem(problem.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${getSolveButtonStyle(problem.status)}`}
                          title="Open in new tab"
                        >
                          {getSolveButtonText(problem.status)}
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-[var(--color-text-secondary)] py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Great job! You've solved all recommended problems.</p>
              </div>
            )}
          </div>

          {/* Additional Progress Stats */}
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {progressOverview.totalActiveDays}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">Active Days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {progressOverview.averageSessionTime}m
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">Avg Session</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;