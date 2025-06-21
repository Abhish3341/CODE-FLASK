import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Code, Calendar, RefreshCw } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

interface Submission {
  id: string;
  problem: string;
  difficulty: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
  code?: string;
  output?: string;
  submissionNumber?: number;
}

interface SubmissionStats {
  totalSubmissions: number;
  recentSubmissions: number;
  languageBreakdown: Record<string, number>;
  averageExecutionTime: number;
}

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter, languageFilter]);

  const fetchSubmissions = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      setError(null);
      
      console.log('🔄 Fetching user submissions...');
      const response = await axiosInstance.get('/api/submissions');
      
      console.log('📊 Received submissions:', response.data.length);
      setSubmissions(response.data || []);
    } catch (err: any) {
      console.error('❌ Error fetching submissions:', err);
      setError(err.response?.data?.error || 'Failed to load submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/api/submissions/stats/summary');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching submission stats:', err);
      // Don't show error for stats, just continue without them
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.language.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => 
        sub.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by language
    if (languageFilter !== 'all') {
      filtered = filtered.filter(sub => 
        sub.language.toLowerCase() === languageFilter.toLowerCase()
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleRefresh = () => {
    fetchSubmissions(true);
    fetchStats();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'text-green-500';
      case 'wrong answer':
        return 'text-red-500';
      case 'error':
        return 'text-red-500';
      case 'time limit exceeded':
        return 'text-yellow-500';
      case 'completed':
        return 'text-blue-500';
      default:
        return 'text-[var(--color-text-secondary)]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'wrong answer':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'time limit exceeded':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
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

  const getUniqueLanguages = () => {
    const languages = [...new Set(submissions.map(sub => sub.language))];
    return languages.filter(lang => lang && lang !== 'Unknown');
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(submissions.map(sub => sub.status))];
    return statuses.filter(status => status);
  };

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
          
          {/* Table Skeleton */}
          <div className="card overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-[var(--color-border)]">
                <div className="w-8 h-4 bg-gray-300 rounded"></div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">My Submissions</h1>
          <p className="text-[var(--color-text-secondary)]">
            Track your coding submissions and progress
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Code className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm">Total Submissions</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.totalSubmissions}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm">This Week</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.recentSubmissions}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm">Avg. Runtime</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.averageExecutionTime}ms
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Code className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-sm">Top Language</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {Object.keys(stats.languageBreakdown).length > 0 
                    ? Object.entries(stats.languageBreakdown)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
                    : 'None'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          {getUniqueStatuses().map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Languages</option>
          {getUniqueLanguages().map(language => (
            <option key={language} value={language}>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)] w-16">#</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Status</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Problem</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Difficulty</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Language</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Runtime</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Memory</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission, index) => (
              <tr 
                key={submission.id} 
                className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <td className="px-6 py-4 text-[var(--color-text-secondary)] font-mono text-sm">
                  {submission.submissionNumber || (filteredSubmissions.length - index)}
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-2 ${getStatusColor(submission.status)}`}>
                    {getStatusIcon(submission.status)}
                    {submission.status}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                  {submission.problem}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(submission.difficulty)}`}>
                    {submission.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                  {submission.language.charAt(0).toUpperCase() + submission.language.slice(1)}
                </td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{submission.runtime}</td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{submission.memory}</td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {submission.submittedAt}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSubmissions.length === 0 && !loading && (
          <div className="text-center py-12 text-[var(--color-text-secondary)]">
            {submissions.length === 0 ? (
              <div>
                <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                <p>Start solving problems to see your submissions here!</p>
              </div>
            ) : (
              <div>
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No submissions found</h3>
                <p>Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                  Submission Details
                </h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Problem</h3>
                  <p className="text-[var(--color-text-secondary)]">{selectedSubmission.problem}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Status</h3>
                  <div className={`flex items-center gap-2 ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    {selectedSubmission.status}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Language</h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {selectedSubmission.language.charAt(0).toUpperCase() + selectedSubmission.language.slice(1)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Runtime</h3>
                  <p className="text-[var(--color-text-secondary)]">{selectedSubmission.runtime}</p>
                </div>
              </div>
              
              {selectedSubmission.code && (
                <div className="mb-6">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Code</h3>
                  <pre className="bg-[var(--color-bg-primary)] p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-[var(--color-text-primary)]">{selectedSubmission.code}</code>
                  </pre>
                </div>
              )}
              
              {selectedSubmission.output && (
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Output</h3>
                  <pre className="bg-[var(--color-bg-primary)] p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-[var(--color-text-primary)]">{selectedSubmission.output}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;