import React from 'react';
import { Search, Filter, Clock } from 'lucide-react';

const Submissions = () => {
  const submissions = [
    {
      id: 1,
      problem: 'Two Sum',
      status: 'Accepted',
      language: 'Python',
      runtime: '56ms',
      memory: '16.2MB',
      submittedAt: '2 hours ago',
    },
    {
      id: 2,
      problem: 'Add Two Numbers',
      status: 'Wrong Answer',
      language: 'JavaScript',
      runtime: '82ms',
      memory: '42.8MB',
      submittedAt: '5 hours ago',
    },
    {
      id: 3,
      problem: 'Valid Parentheses',
      status: 'Time Limit Exceeded',
      language: 'C++',
      runtime: '---',
      memory: '---',
      submittedAt: '1 day ago',
    },
  ];

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