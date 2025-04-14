import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Code2, Clock, AlertTriangle } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import CodeEditor from '../components/CodeEditor';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  constraints: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  followUp?: string;
}

const ProblemView = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // For now, let's hardcode the Two Sum problem
        setProblem({
          id: '1',
          title: 'Two Sum',
          description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
          difficulty: 'Easy',
          category: 'Arrays',
          constraints: `• 2 <= nums.length <= 104
• -109 <= nums[i] <= 109
• -109 <= target <= 109
• Only one valid answer exists.`,
          examples: [
            {
              input: 'nums = [2,7,11,15], target = 9',
              output: '[0,1]',
              explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
            },
            {
              input: 'nums = [3,2,4], target = 6',
              output: '[1,2]'
            },
            {
              input: 'nums = [3,3], target = 6',
              output: '[0,1]'
            }
          ],
          followUp: 'Can you come up with an algorithm that is less than O(n²) time complexity?'
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load problem');
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async (result: { output: string; error?: string }) => {
    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await axiosInstance.post('/api/submissions', {
        problemId: id,
        output: result.output
      });
      // Handle successful submission
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit solution');
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
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Example {index + 1}:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-[var(--color-text-primary)]">Input: </span>
                      <code className="text-[var(--color-text-secondary)] font-mono">{example.input}</code>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text-primary)]">Output: </span>
                      <code className="text-[var(--color-text-secondary)] font-mono">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-medium text-[var(--color-text-primary)]">Explanation: </span>
                        <span className="text-[var(--color-text-secondary)]">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {problem.followUp && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Follow-up</h2>
              <p className="text-[var(--color-text-secondary)]">{problem.followUp}</p>
            </div>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="w-1/2">
        <CodeEditor onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ProblemView;