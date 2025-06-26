import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Clock, Lightbulb, Eye, Code, Target, TrendingUp, Code2 } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    id: string;
  };
  averageScore?: number;
  totalScore?: number;
  problemsSolved?: number;
  hintsUsed?: number;
  solutionsViewed?: number;
  score?: number;
  language?: string;
  timeSpent?: number;
  submittedAt?: string;
  usedHint?: boolean;
}

interface ScoreSummary {
  totalProblems: number;
  solvedProblems: number;
  averageScore: number;
  totalScore: number;
  hintsUsed: number;
  solutionsViewed: number;
  difficultyBreakdown: {
    easy: { solved: number; attempted: number; avgScore: number };
    medium: { solved: number; attempted: number; avgScore: number };
    hard: { solved: number; attempted: number; avgScore: number };
  };
  languageBreakdown: {
    c: { solved: number; attempted: number; avgScore: number };
    cpp: { solved: number; attempted: number; avgScore: number };
    java: { solved: number; attempted: number; avgScore: number };
    python: { solved: number; attempted: number; avgScore: number };
  };
}

const ScoreBoard = () => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userSummary, setUserSummary] = useState<ScoreSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'global'>('summary');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [summaryResponse, leaderboardResponse] = await Promise.all([
        axiosInstance.get('/api/scores/summary'),
        axiosInstance.get('/api/scores/leaderboard?limit=20')
      ]);

      setUserSummary(summaryResponse.data);
      setGlobalLeaderboard(leaderboardResponse.data);
    } catch (err: any) {
      console.error('Error fetching score data:', err);
      setError(err.response?.data?.error || 'Failed to load score data');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-[var(--color-text-secondary)]">{rank}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-1/2 sm:w-1/4 mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3 sm:w-1/3 mb-6 sm:mb-8"></div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 sm:h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 sm:h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">Score Board</h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
            Track your performance and compete with other developers
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--color-border)] mb-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            My Performance
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'global'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Global Leaderboard
          </button>
        </div>

        {activeTab === 'summary' && userSummary && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="card p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Average Score</p>
                    <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(userSummary.averageScore)}`}>
                      {userSummary.averageScore}/100
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Problems Solved</p>
                    <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                      {userSummary.solvedProblems}/{userSummary.totalProblems}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-yellow-500/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Hints Used</p>
                    <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                      {userSummary.hintsUsed}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gray-500/10 rounded-lg">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Solutions Viewed</p>
                    <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                      {userSummary.solutionsViewed}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Difficulty Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(userSummary.difficultyBreakdown).map(([difficulty, stats]) => (
                    <div key={difficulty} className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                        <span className="text-[var(--color-text-primary)]">
                          {stats.solved}/{stats.attempted}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getScoreColor(stats.avgScore)}`}>
                          {stats.avgScore}/100
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          Avg Score
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Breakdown */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Language Performance
                </h3>
                <div className="space-y-4">
                  {Object.entries(userSummary.languageBreakdown).map(([language, stats]) => (
                    <div key={language} className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-500 rounded-full text-sm font-medium">
                          {language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1)}
                        </span>
                        <span className="text-[var(--color-text-primary)]">
                          {stats.solved}/{stats.attempted}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getScoreColor(stats.avgScore)}`}>
                          {stats.avgScore}/100
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          Avg Score
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'global' && (
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Global Leaderboard
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Top performers ranked by average score
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-bg-secondary)]">
                    <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Rank</th>
                    <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">User</th>
                    <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Avg Score</th>
                    <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Total Score</th>
                    <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Solved</th>
                    <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Hints</th>
                    <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Solutions</th>
                  </tr>
                </thead>
                <tbody>
                  {globalLeaderboard.map((entry) => (
                    <tr key={entry.user.id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                        {entry.user.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${getScoreColor(entry.averageScore || 0)}`}>
                          {entry.averageScore}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                        {entry.totalScore}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                        {entry.problemsSolved}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                        {entry.hintsUsed}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                        {entry.solutionsViewed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {globalLeaderboard.map((entry) => (
                <div key={entry.user.id} className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank)}
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {entry.user.name}
                      </span>
                    </div>
                    <span className={`font-bold ${getScoreColor(entry.averageScore || 0)}`}>
                      {entry.averageScore}/100
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-[var(--color-text-secondary)]">
                    <div>
                      <span className="font-medium">Total Score:</span>
                      <div>{entry.totalScore}</div>
                    </div>
                    <div>
                      <span className="font-medium">Solved:</span>
                      <div>{entry.problemsSolved}</div>
                    </div>
                    <div>
                      <span className="font-medium">Hints:</span>
                      <div>{entry.hintsUsed}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {globalLeaderboard.length === 0 && (
              <div className="text-center py-12 text-[var(--color-text-secondary)]">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No scores yet</h3>
                <p>Start solving problems to appear on the leaderboard!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
              <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
            </div>
            <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ScoreBoard;