import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Tag, BarChart2, Clock, Award, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
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

interface DifficultyStats {
  solved: number;
  attempted: number;
}

interface LanguageStats {
  solved: number;
  attempted: number;
}

interface UserStats {
  problemsSolved: number;
  totalProblems: number;
  successRate: number;
  averageTime: number;
  ranking: number;
  totalSubmissions: number;
  timeSpent: number;
  difficultyBreakdown?: {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
  };
  languageBreakdown?: {
    python: LanguageStats;
    javascript: LanguageStats;
    java: LanguageStats;
    cpp: LanguageStats;
  };
}

const Problems = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    problemsSolved: 0,
    totalProblems: 0,
    successRate: 0,
    averageTime: 0,
    ranking: 0,
    totalSubmissions: 0,
    timeSpent: 0,
    difficultyBreakdown: {
      easy: { solved: 0, attempted: 0 },
      medium: { solved: 0, attempted: 0 },
      hard: { solved: 0, attempted: 0 }
    },
    languageBreakdown: {
      python: { solved: 0, attempted: 0 },
      javascript: { solved: 0, attempted: 0 },
      java: { solved: 0, attempted: 0 },
      cpp: { solved: 0, attempted: 0 }
    }
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
        
        // Safely set user stats with fallbacks
        const statsData = statsResponse.data;
        setUserStats({
          problemsSolved: statsData.problemsSolved || 0,
          totalProblems: statsData.totalProblems || 0,
          successRate: statsData.successRate || 0,
          averageTime: statsData.averageTime || 0,
          ranking: statsData.ranking || 0,
          totalSubmissions: statsData.totalSubmissions || 0,
          timeSpent: statsData.timeSpent || 0,
          difficultyBreakdown: statsData.difficultyBreakdown || {
            easy: { solved: 0, attempted: 0 },
            medium: { solved: 0, attempted: 0 },
            hard: { solved: 0, attempted: 0 }
          },
          languageBreakdown: statsData.languageBreakdown || {
            python: { solved: 0, attempted: 0 },
            javascript: { solved: 0, attempted: 0 },
            java: { solved: 0, attempted: 0 },
            cpp: { solved: 0, attempted: 0 }
          }
        });
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSolveProblem = (problemId: string) => {
    window.open(`/app/problems/${problemId}/solve`, '_blank');
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

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || problem.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = searchTerm === '' || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  // Safe access to difficulty breakdown
  const easyStats = userStats.difficultyBreakdown?.easy || { solved: 0, attempted: 0 };
  const mediumStats = userStats.difficultyBreakdown?.medium || { solved: 0, attempted: 0 };
  const hardStats = userStats.difficultyBreakdown?.hard || { solved: 0, attempted: 0 };

  if (loading) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)]">
        {/* Skeleton Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-bg-secondary)] rounded-lg"></div>
                <div>
                  <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded mb-2"></div>
                  <div className="h-6 w-16 bg-[var(--color-bg-secondary)] rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton Table */}
        <div className="card overflow-hidden">
          <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-[var(--color-border)]">
                <div className="w-4 h-4 bg-[var(--color-bg-secondary)] rounded-full"></div>
                <div className="h-4 w-48 bg-[var(--color-bg-secondary)] rounded"></div>
                <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded"></div>
                <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded"></div>
                <div className="h-4 w-16 bg-[var(--color-bg-secondary)] rounded"></div>
                <div className="h-8 w-20 bg-[var(--color-bg-secondary)] rounded"></div>
              </div>
            ))}
          </div>
        </div>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
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
              <p className="text-xs text-[var(--color-text-secondary)]">
                {userStats.totalProblems > 0 ? Math.round((userStats.problemsSolved / userStats.totalProblems) * 100) : 0}% complete
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {userStats.successRate}%
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {userStats.totalSubmissions} submissions
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
              <p className="text-xs text-[var(--color-text-secondary)]">
                {userStats.timeSpent}h total
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
              <p className="text-xs text-[var(--color-text-secondary)]">
                Global rank
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-500">Easy</span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {easyStats.solved}/{easyStats.attempted}
            </span>
          </div>
          <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ 
                width: easyStats.attempted > 0 
                  ? `${(easyStats.solved / easyStats.attempted) * 100}%` 
                  : '0%' 
              }}
            ></div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-500">Medium</span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {mediumStats.solved}/{mediumStats.attempted}
            </span>
          </div>
          <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ 
                width: mediumStats.attempted > 0 
                  ? `${(mediumStats.solved / mediumStats.attempted) * 100}%` 
                  : '0%' 
              }}
            ></div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-500">Hard</span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {hardStats.solved}/{hardStats.attempted}
            </span>
          </div>
          <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ 
                width: hardStats.attempted > 0 
                  ? `${(hardStats.solved / hardStats.attempted) * 100}%` 
                  : '0%' 
              }}
            ></div>
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
          <option value="linked">Linked Lists</option>
          <option value="binary search">Binary Search</option>
          <option value="stack">Stack</option>
          <option value="dynamic">Dynamic Programming</option>
          <option value="math">Math</option>
          <option value="tree">Trees</option>
          <option value="graph">Graphs</option>
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
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Actions</th>
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
                  <button
                    onClick={() => handleSolveProblem(problem.id)}
                    className="font-medium text-[var(--color-text-primary)] hover:text-indigo-500 transition-colors text-left"
                  >
                    {problem.title}
                  </button>
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
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleSolveProblem(problem.id)}
                    className="button button-primary"
                  >
                    {problem.solved ? 'Review' : 'Solve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProblems.length === 0 && (
          <div className="text-center py-8 text-[var(--color-text-secondary)]">
            No problems found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;