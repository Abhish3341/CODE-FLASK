import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

interface Submission {
  id: string;
  problem: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
}

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get('/api/submissions');
        setSubmissions(response.data);
      } catch (err) {
        setError('Failed to load submissions');
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'text-green-500';
      case 'wrong answer':
        return 'text-red-500';
      case 'time limit exceeded':
        return 'text-yellow-500';
      default:
        return 'text-[var(--color-text-secondary)]';
    }
  };

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Submissions</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
            <input
              type="text"
              placeholder="Search submissions..."
              className="pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Problem</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Status</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Language</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Runtime</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Memory</th>
              <th className="px-6 py-4 text-left text-[var(--color-text-primary)]">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-t border-[var(--color-border)]">
                <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">{submission.problem}</td>
                <td className={`px-6 py-4 ${getStatusColor(submission.status)}`}>
                  {submission.status}
                </td>
                <td className="px-6 py-4 text-[var(--color-text-secondary)]">{submission.language}</td>
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
      </div>
    </div>
  );
};

export default Submissions;