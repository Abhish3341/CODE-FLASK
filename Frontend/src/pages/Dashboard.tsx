import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Code, CheckCircle, Clock, TrendingUp, Target, Zap, Award, ExternalLink, Calendar, Flame, BarChart3, PieChart, FileText, Play, AlertCircle, Code2 } from 'lucide-react';
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
      c: { solved: number; attempted: number };
      cpp: { solved: number; attempted: number };
      java: { solved: number; attempted: number };
      python: { solved: number; attempted: number };
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
        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />;
      case 'submitted':
        return <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
      case 'attempted':
        return <Play className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[var(--color-border)] rounded-full"></div>;
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
            className="bg-green-500 h-2 rounded-full progress-bar"
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
            className="bg-yellow-500 h-2 rounded-full progress-bar"
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
            className="bg-red-500 h-2 rounded-full progress-bar"
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
      c: '#00599c',
      cpp: '#f34b7d',
      java: '#ed8b00',
      python: '#3776ab'
    };
    
    return (
      <div className="space-y-3">
        {languages.map(([language, count]) => {
          const percentage = Math.round((count / total) * 100);
          const displayName = language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1);
          
          return (
            <div key={language} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[language as keyof typeof colors] || '#6b7280' }}
                ></div>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {displayName}
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
      <div className="space-y-3">
        {/* Activity Level Legend */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-sm"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-200 rounded-sm"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-400 rounded-sm"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-600 rounded-sm"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-800 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
        
        {/* Horizontal Activity Chart */}
        <div className="grid grid-cols-7 gap-1">
          {data.progressOverview.weeklyActivity.map((day, index) => {
            const intensity = day.count === 0 ? 0 : Math.ceil((day.count / maxCount) * 4);
            const getIntensityColor = (level: number) => {
              switch (level) {
                case 0: return 'bg-[var(--color-bg-primary)] border border-[var(--color-border)]';
                case 1: return 'bg-indigo-200';
                case 2: return 'bg-indigo-400';
                case 3: return 'bg-indigo-600';
                case 4: return 'bg-indigo-800';
                default: return 'bg-[var(--color-bg-primary)] border border-[var(--color-border)]';
              }
            };
            
            return (
              <div key={index} className="flex flex-col items-center gap-1 sm:gap-2">
                <div 
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-sm chart-element cursor-pointer ${getIntensityColor(intensity)}`}
                  title={`${day.count} activities on ${day.day} (${day.timeSpent} minutes)`}
                ></div>
                <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Activity Summary */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border)]">
          <span>
            {data.progressOverview.weeklyActivity.reduce((sum, day) => sum + day.count, 0)} activities this week
          </span>
          <span>
            {Math.round(data.progressOverview.weeklyActivity.reduce((sum, day) => sum + day.timeSpent, 0) / 60)}h total
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full p-4 sm:p-6 lg:p-8 bg-[var(--color-bg-primary)]">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-300 rounded w-1/2 sm:w-1/4 mb-4"></div>
          <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3 sm:w-1/3 mb-6 sm:mb-8"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 sm:h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-4 sm:p-6 lg:p-8 bg-[var(--color-bg-primary)]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, progressOverview } = data;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Welcome back, {user?.firstname} {user?.lastname}!
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
            Track your progress and continue your coding journey
          </p>
        </div>

        {/* Main Stats Grid with enhanced responsive design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="card stats-card p-4 sm:p-6">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mb-3 sm:mb-4 icon-transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-1">Rank</h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500">
              {stats.rank === 0 ? '-' : `#${stats.rank}`}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
              Global ranking
            </p>
          </div>

          <Link to="/app/problems" className="card stats-card p-4 sm:p-6 cursor-pointer">
            <Code className="w-6 h-6 sm:w-8 sm:h-8 text-[#4B96F8] mb-3 sm:mb-4 icon-transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-1">Solved</h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4B96F8]">
              {stats.problemsSolved}/{stats.totalProblems}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
              Problems completed
            </p>
          </Link>

          <div className="card stats-card p-4 sm:p-6">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#4ADE80] mb-3 sm:mb-4 icon-transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-1">Success Rate</h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4ADE80]">{stats.successRate}%</p>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
              {stats.totalSubmissions} submissions
            </p>
          </div>

          <div className="card stats-card p-4 sm:p-6">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#A855F7] mb-3 sm:mb-4 icon-transition" />
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-1">Avg. Time</h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#A855F7]">{stats.averageTime}m</p>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
              Per problem
            </p>
          </div>
        </div>

        {/* Progress Overview and Recommendations with responsive layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Progress Overview - Responsive width */}
          <div className="xl:col-span-2 card dashboard-tile p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-4 sm:mb-6 flex items-center gap-2">
              Progress Overview
            </h3>
            
            {/* Key Metrics - Responsive grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-[var(--color-bg-primary)] p-3 sm:p-4 rounded-lg dashboard-tile">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 icon-transition" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-[var(--color-text-primary)]">
                      {progressOverview.currentStreak}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Day Streak</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--color-bg-primary)] p-3 sm:p-4 rounded-lg dashboard-tile">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 icon-transition" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-[var(--color-text-primary)]">
                      {Math.round(progressOverview.thisWeekTime / 60)}h
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">This Week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Weekly Activity</h4>
              {renderWeeklyActivity()}
            </div>

            {/* Difficulty Completion Rates */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Difficulty Completion</h4>
              {renderDifficultyChart()}
            </div>

            {/* Language Distribution */}
            <div>
              <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Language Usage</h4>
              {renderLanguageDistribution()}
            </div>
          </div>

          {/* Activity and Recommendations - Responsive layout */}
          <div className="xl:col-span-3 card dashboard-tile p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)]">Activity and Recommendations</h3>
            </div>
            
            {/* Problem Cards Container - Responsive spacing */}
            <div className="flex-1 flex flex-col">
              {data.recommendedProblems.length > 0 ? (
                <div className="space-y-4 sm:space-y-5">
                  {data.recommendedProblems.slice(0, 3).map((problem, index) => (
                    <div key={problem.id} className={`p-4 sm:p-5 rounded-lg problem-card transition-all duration-300 ${getStatusColor(problem.status)}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1 sm:mt-0">
                            {getStatusIcon(problem.status)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                              <h4 className="font-semibold text-base sm:text-lg text-[var(--color-text-primary)] truncate">
                                {problem.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 badge flex-shrink-0 ${getDifficultyColor(problem.difficulty)}`}>
                                  {getDifficultyIcon(problem.difficulty)}
                                  {problem.difficulty}
                                </span>
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium badge flex-shrink-0 ${
                                  problem.status === 'solved' ? 'bg-green-500/20 text-green-500' :
                                  problem.status === 'submitted' ? 'bg-blue-500/20 text-blue-500' :
                                  problem.status === 'attempted' ? 'bg-yellow-500/20 text-yellow-500' :
                                  'bg-gray-500/20 text-gray-500'
                                }`}>
                                  {getStatusText(problem.status)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                              <Code className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{problem.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => handleSolveProblem(problem.id)}
                            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium button-group transition-all duration-200 text-sm sm:text-base ${getSolveButtonStyle(problem.status)}`}
                            title="Open in new tab"
                          >
                            {getSolveButtonText(problem.status)}
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[var(--color-text-secondary)] py-8 sm:py-12 flex-1 flex flex-col justify-center">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                  <h4 className="text-base sm:text-lg font-medium mb-2">Great job!</h4>
                  <p className="text-sm sm:text-base">You've solved all recommended problems.</p>
                </div>
              )}

              {/* Spacer to push stats to bottom */}
              <div className="flex-1"></div>

              {/* Additional Progress Stats - Responsive grid */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--color-border)]">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="dashboard-tile p-4 sm:p-5 bg-[var(--color-bg-primary)] rounded-lg text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                      {progressOverview.totalActiveDays}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium">Active Days</p>
                  </div>
                  <div className="dashboard-tile p-4 sm:p-5 bg-[var(--color-bg-primary)] rounded-lg text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                      {progressOverview.averageSessionTime}m
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium">Avg Session</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="py-6 sm:py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
              <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
            </div>
            <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] text-center">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;