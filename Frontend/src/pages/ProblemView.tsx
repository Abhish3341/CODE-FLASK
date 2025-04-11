import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Code2, Clock, AlertTriangle } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import Editor from '@monaco-editor/react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
}

const ProblemView = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosInstance.get(`/api/problems/${id}`);
        setProblem(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/compiler/submit', {
        code,
        language,
        problemId: id
      });

      // Handle submission response
      console.log(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit code');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-full p-8 bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-red-500 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error || 'Problem not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[var(--color-bg-primary)] flex">
      {/* Problem Description */}
      <div className="w-1/2 p-8 overflow-y-auto border-r border-[var(--color-border)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            {problem.title}
          </h1>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Code2 className="w-4 h-4" />
              {problem.category}
            </span>
            <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <Clock className="w-4 h-4" />
              45 minutes
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Description</h2>
            <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">{problem.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Constraints</h2>
            <pre className="text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono bg-[var(--color-bg-secondary)] p-4 rounded-lg">
              {problem.constraints}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Example</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Input:</h3>
                <pre className="text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono bg-[var(--color-bg-secondary)] p-4 rounded-lg">
                  {problem.sampleInput}
                </pre>
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Output:</h3>
                <pre className="text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono bg-[var(--color-bg-secondary)] p-4 rounded-lg">
                  {problem.sampleOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
            }}
          />
        </div>

        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemView;