import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Code, CheckCircle, Clock, Trophy, Target, Zap, Award, ExternalLink, Play, FileText, AlertCircle } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: number;
  submissions: number;
  status: 'not-attempted' | 'attempted' | 'submitted' | 'solved';
  solved: boolean; // Legacy field for backward compatibility
}

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, difficultyFilter, categoryFilter, statusFilter]);

  const fetchProblems = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get('/api/problems');
      setProblems(response.data || []);
    } catch (err: any) {
      console.error('Error fetching problems:', err);
      setError(err.response?.data?.error || 'Failed to load problems');
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(problem => 
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem => 
        problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(problem => 
        problem.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Filter by status
    if (statusFilter === 'solved') {
      filtered = filtered.filter(problem => problem.status === 'solved');
    } else if (statusFilter === 'attempted') {
      filtered = filtered.filter(problem => problem.status === 'attempted');
    } else if (statusFilter === 'submitted') {
      filtered = filtered.filter(problem => problem.status === 'submitted');
    } else if (statusFilter === 'not-attempted') {
      filtered = filtered.filter(problem => problem.status === 'not-attempted');
    }

    setFilteredProblems(filtered);
  };

  const handleSolveProblem = (problemId: string) => {
    // Open problem in new tab
    const url = `/app/problems/${problemId}/solve`;
    window.open(url, '_blank', 'noopener,noreferrer');
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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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

  const getUniqueCategories = () => {
    const categories = [...new Set(problems.map(problem => problem.category))];
    return categories.filter(category => category);
  };

  const getStats = () => {
    const total = problems.length;
    const solved = problems.filter(p => p.status === 'solved').length;
    const submitted = problems.filter(p => p.status === 'submitted').length;
    const attempted = problems.filter(p => p.status === 'attempted').length;
    const notAttempted = problems.filter(p => p.status === 'not-attempted').length;
    
    const easy = problems.filter(p => p.difficulty === 'Easy');
    const medium = problems.filter(p => p.difficulty === 'Medium');
    const hard = problems.filter(p => p.difficulty === 'Hard');

    return {
      total,
      solved,
      submitted,
      attempted,
      notAttempted,
      easy: { total: easy.length, solved: easy.filter(p => p.status === 'solved').length },
      medium: { total: medium.length, solved: medium.filter(p => p.status === 'solved').length },
      hard: { total: hard.length, solved: hard.filter(p => p.status === 'solved').length }
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-8"></div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          
          {/* Problems List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Problems</h1>
        <p className="text-[var(--color-text-secondary)]">
          Practice coding problems and improve your skills
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Code className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Total Problems</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Solved</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {stats.solved}/{stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Remaining</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {stats.total - stats.solved}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-green-500">{stats.solved}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Solved</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-blue-500">{stats.submitted}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Submitted</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-500">{stats.attempted}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Attempted</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-500">{stats.notAttempted}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Not Attempted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Easy</h3>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500 mb-2">{stats.easy.solved}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stats.easy.total} total problems
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Medium</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-500 mb-2">{stats.medium.solved}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stats.medium.total} total problems
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Hard</h3>
            <Award className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-500 mb-2">{stats.hard.solved}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stats.hard.total} total problems
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
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

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          {getUniqueCategories().map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="solved">Solved</option>
          <option value="submitted">Submitted</option>
          <option value="attempted">Attempted</option>
          <option value="not-attempted">Not Attempted</option>
        </select>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <div key={problem.id} className={`card p-6 hover:shadow-lg transition-all ${getStatusColor(problem.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(problem.status)}
                </div>

                {/* Problem Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] hover:text-indigo-500 transition-colors">
                      <Link to={`/app/problems/${problem.id}/solve`}>
                        {problem.title}
                      </Link>
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getDifficultyColor(problem.difficulty)}`}>
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
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      {problem.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {problem.acceptance}% acceptance
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {problem.submissions} submissions
                    </span>
                  </div>
                </div>

                {/* Solve Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleSolveProblem(problem.id)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium ${getSolveButtonStyle(problem.status)}`}
                    title="Open in new tab"
                  >
                    {getSolveButtonText(problem.status)}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && !loading && (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          {problems.length === 0 ? (
            <div>
              <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No problems available</h3>
              <p>Problems will appear here once they are added to the system.</p>
            </div>
          ) : (
            <div>
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No problems found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Problems;