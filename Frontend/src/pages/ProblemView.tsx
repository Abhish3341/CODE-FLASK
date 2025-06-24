import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, CheckCircle, Code, BookOpen, Lightbulb, Code2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import axiosInstance from '../utils/axiosConfig';
import CodeEditor from '../components/CodeEditor';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  acceptance: number;
  totalSubmissions: number;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string;
  followUp?: string;
}

const ProblemView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'solutions' | 'discuss'>('description');

  useEffect(() => {
    if (id) {
      fetchProblem(id);
    }
  }, [id]);

  const fetchProblem = async (problemId: string) => {
    try {
      setError(null);
      const response = await axiosInstance.get(`/api/problems/${problemId}`);
      setProblem(response.data);
    } catch (err: any) {
      console.error('Error fetching problem:', err);
      setError(err.response?.data?.error || 'Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = (result: any) => {
    console.log('Code submitted:', result);
    // Handle successful submission (could show success message, update UI, etc.)
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
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

  const formatDescription = (description: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = description.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Handle examples
      if (paragraph.includes('Example')) {
        return (
          <div key={index} className="bg-[var(--color-bg-secondary)] p-4 rounded-lg my-4">
            <pre className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-mono">
              {paragraph}
            </pre>
          </div>
        );
      }
      
      // Handle constraints
      if (paragraph.includes('Constraints:')) {
        return (
          <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Constraints:</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
              {paragraph.replace('Constraints:', '').trim()}
            </div>
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="text-[var(--color-text-primary)] mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[var(--color-text-secondary)]">Loading problem...</div>
        </div>
        
        {/* Footer */}
        <footer className="py-8 border-t border-[var(--color-border)]">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-6 h-6 text-indigo-500" />
                <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
              </div>
              <div className="text-[var(--color-text-secondary)]">
                © 2025 CodeFlask. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error || 'Problem not found'}</div>
            <button
              onClick={() => navigate('/app/problems')}
              className="button button-primary"
            >
              Back to Problems
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-8 border-t border-[var(--color-border)]">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-6 h-6 text-indigo-500" />
                <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
              </div>
              <div className="text-[var(--color-text-secondary)]">
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
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* Problem Description Panel */}
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => navigate('/app/problems')}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Problems
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {problem.title}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-1">
                    <Code className="w-4 h-4" />
                    {problem.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {problem.acceptance}% acceptance
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {problem.totalSubmissions} submissions
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[var(--color-border)]">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Description
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('solutions')}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'solutions'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Solutions
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('discuss')}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'discuss'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Discuss
                  </div>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'description' && (
                  <div className="prose prose-sm max-w-none">
                    {formatDescription(problem.description)}
                    
                    {problem.examples && problem.examples.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Examples</h3>
                        {problem.examples.map((example, index) => (
                          <div key={index} className="bg-[var(--color-bg-secondary)] p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-[var(--color-text-primary)] mb-2">
                              Example {index + 1}:
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-[var(--color-text-primary)]">Input: </span>
                                <code className="bg-[var(--color-bg-primary)] px-2 py-1 rounded text-[var(--color-text-primary)]">
                                  {example.input}
                                </code>
                              </div>
                              <div>
                                <span className="font-medium text-[var(--color-text-primary)]">Output: </span>
                                <code className="bg-[var(--color-bg-primary)] px-2 py-1 rounded text-[var(--color-text-primary)]">
                                  {example.output}
                                </code>
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
                    )}
                    
                    {problem.constraints && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Constraints</h3>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <pre className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                            {problem.constraints}
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    {problem.followUp && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Follow-up</h3>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            {problem.followUp}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'solutions' && (
                  <div className="text-center py-12 text-[var(--color-text-secondary)]">
                    <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Solutions Coming Soon</h3>
                    <p>Community solutions and explanations will be available here.</p>
                  </div>
                )}
                
                {activeTab === 'discuss' && (
                  <div className="text-center py-12 text-[var(--color-text-secondary)]">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Discussion Coming Soon</h3>
                    <p>Join the community discussion about this problem.</p>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-[var(--color-border)] hover:bg-indigo-500 transition-colors" />

          {/* Code Editor Panel */}
          <Panel defaultSize={60} minSize={40}>
            <CodeEditor problemId={problem._id} onSubmit={handleSubmission} />
          </Panel>
        </PanelGroup>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-500" />
              <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
            </div>
            <div className="text-[var(--color-text-secondary)]">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProblemView;