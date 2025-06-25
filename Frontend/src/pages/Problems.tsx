import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Code, CheckCircle, Clock, Trophy, Target, Zap, Award, ExternalLink, Play, FileText, AlertCircle, Code2 } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  status: 'not-attempted' | 'attempted' | 'submitted' | 'solved';
  solved: boolean;
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

    if (searchTerm) {
      filtered = filtered.filter(problem => 
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem => 
        problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(problem => 
        problem.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

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
        return <Target className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'medium':
        return <Zap className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'hard':
        return <Award className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Code className="w-3 h-3 sm:w-4 sm:h-4" />;
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
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">Problems</h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
            Practice coding problems and improve your skills
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Total Problems</p>
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Solved</p>
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.solved}/{stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-yellow-500/10 rounded-lg">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Success Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Remaining</p>
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.total - stats.solved}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="card p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-500 text-sm sm:text-base">{stats.solved}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Solved</p>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <div>
                <p className="font-medium text-blue-500 text-sm sm:text-base">{stats.submitted}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Submitted</p>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-500 text-sm sm:text-base">{stats.attempted}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Attempted</p>
              </div>
            </div>
          </div>

          <div className="card p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-500 text-sm sm:text-base">{stats.notAttempted}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Not Attempted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Responsive */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm sm:text-base"
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="solved">Solved</option>
            <option value="submitted">Submitted</option>
            <option value="attempted">Attempted</option>
            <option value="not-attempted">Not Attempted</option>
          </select>
        </div>

        {/* Problems List - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          {filteredProblems.map((problem) => (
            <div key={problem.id} className={`card p-4 sm:p-6 hover:shadow-lg transition-all ${getStatusColor(problem.status)}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-1 sm:mt-0">
                    {getStatusIcon(problem.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] hover:text-indigo-500 transition-colors truncate">
                        <Link to={`/app/problems/${problem.id}/solve`}>
                          {problem.title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 ${getDifficultyColor(problem.difficulty)}`}>
                          {getDifficultyIcon(problem.difficulty)}
                          {problem.difficulty}
                        </span>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
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
                      <Code className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{problem.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 self-start sm:self-center">
                  <button
                    onClick={() => handleSolveProblem(problem.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg transition-all font-medium text-sm sm:text-base ${getSolveButtonStyle(problem.status)}`}
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

        {filteredProblems.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12 text-[var(--color-text-secondary)]">
            {problems.length === 0 ? (
              <div>
                <Code className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-base sm:text-lg font-medium mb-2">No problems available</h3>
                <p className="text-sm sm:text-base">Problems will appear here once they are added to the system.</p>
              </div>
            ) : (
              <div>
                <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-base sm:text-lg font-medium mb-2">No problems found</h3>
                <p className="text-sm sm:text-base">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Responsive */}
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

export default Problems;