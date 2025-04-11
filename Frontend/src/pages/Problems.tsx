import React, { useState, useEffect } from 'react';
import { Search, Filter, Tag, BarChart2, Clock, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  acceptance: number;
  submissions: number;
  solved: boolean;
}

interface UserStats {
  problemsSolved: number;
  totalProblems: number;
  successRate: number;
  averageTime: number;
  ranking: number;
}

const Problems = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    problemsSolved: 0,
    totalProblems: 0,
    successRate: 0,
    averageTime: 0,
    ranking: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsResponse, statsResponse] = await Promise.all([
          axiosInstance.get('/api/problems'),
          axiosInstance.get('/api/problems/stats')
        ]);
        
        setProblems(problemsResponse.data);
        setUserStats(statsResponse.data);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || problem.category.toLowerCase() === selectedCategory;
    return matchesDifficulty && matchesCategory;
  });

  if (loading) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Problem Set</h1>
          <p className="text-[var(--color-text-secondary)]">Practice coding problems to improve your skills</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
            <input
              type="text"
              placeholder="Search problems..."
              className="pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Solved</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {userStats.problemsSolved}/{userStats.totalProblems}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <BarChart2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {userStats.successRate}%
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Avg. Time</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {userStats.averageTime}m
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Ranking</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {userStats.ranking === 0 ? '-' : `#${userStats.ranking}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="arrays">Arrays</option>
          <option value="strings">Strings</option>
          <option value="binary search">Binary Search</option>
          <option value="stack">Stack</option>
          <option value="design">Design</option>
        </select>
      </div>

      {/* Problems Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Status</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Title</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Difficulty</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Category</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Acceptance</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Submissions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem) => (
              <tr key={problem.id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                <td className="px-6 py-4">
                  {problem.solved ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <a href={`/app/problems/${problem.id}`} className="font-medium text-[var(--color-text-primary)] hover:text-indigo-500 transition-colors">
                    {problem.title}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Tag className="w-4 h-4" />
                    {problem.category}
                  </div>
                </td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{problem.acceptance}%</td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{problem.submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;