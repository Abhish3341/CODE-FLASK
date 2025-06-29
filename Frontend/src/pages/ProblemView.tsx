import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, CheckCircle, Code, BookOpen, Lightbulb, Code2, Menu, X, Info, Shield, PanelRight, PanelLeft, Maximize, Minimize, ExternalLink, Target, Zap, Award } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import axiosInstance from '../utils/axiosConfig';
import CodeEditor from '../components/CodeEditor';
import ScoreDisplay from '../components/ScoreDisplay';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string;
  followUp?: string;
}

interface Score {
  score: number;
  clickedHint: boolean;
  clickedSolution: boolean;
  wrongAttempts: number;
  passed: boolean;
  timeSpent?: number;
  language?: string;
}

const ProblemView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description'>('description');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [executionMethod, setExecutionMethod] = useState<'docker' | 'native' | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (id) {
      fetchProblem(id);
      fetchScore(id);
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

  const fetchScore = async (problemId: string) => {
    try {
      const response = await axiosInstance.get(`/api/scores/problem/${problemId}`);
      if (response.data.exists) {
        setScore({
          score: response.data.finalScore,
          clickedHint: response.data.clickedHint,
          clickedSolution: response.data.clickedSolution,
          wrongAttempts: response.data.wrongAttempts,
          passed: response.data.passed,
          timeSpent: response.data.timeSpent,
          language: response.data.language
        });
      }
    } catch (error) {
      console.error('Error fetching score:', error);
    }
  };

  const handleSubmission = (result: any) => {
    console.log('Code submitted:', result);
    // Set execution method for security info
    if (result.executionMethod) {
      setExecutionMethod(result.executionMethod);
    }
    
    // Refresh score after submission
    if (id) {
      fetchScore(id);
    }
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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
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

  const formatDescription = (description: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = description.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Handle examples
      if (paragraph.includes('Example')) {
        return (
          <div key={index} className="bg-[var(--color-bg-secondary)] p-3 sm:p-4 rounded-lg my-3 sm:my-4">
            <pre className="text-xs sm:text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-mono overflow-x-auto">
              {paragraph}
            </pre>
          </div>
        );
      }
      
      // Handle constraints
      if (paragraph.includes('Constraints:')) {
        return (
          <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg my-3 sm:my-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-sm sm:text-base">Constraints:</h4>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
              {paragraph.replace('Constraints:', '').trim()}
            </div>
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="text-[var(--color-text-primary)] mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
          {paragraph}
        </p>
      );
    });
  };

  const toggleSecurityInfo = () => {
    setShowSecurityInfo(!showSecurityInfo);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-[var(--color-text-secondary)]">Loading problem...</div>
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

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
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

  // Mobile Layout
  const MobileLayout = () => (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/app/problems')}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSecurityInfo}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--color-hover-light)] transition-colors"
              title="Security Information"
            >
              <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>
            
            <button
              onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
            >
              {isMobilePanelOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              {isMobilePanelOpen ? 'Close' : 'Code'}
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-2">
            {problem.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getDifficultyColor(problem.difficulty)}`}>
              {getDifficultyIcon(problem.difficulty)}
              {problem.difficulty}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {problem.category}
            </span>
          </div>
        </div>
        
        {score && (
          <div className="mb-3">
            <ScoreDisplay 
              score={score.score}
              clickedHint={score.clickedHint}
              clickedSolution={score.clickedSolution}
              wrongAttempts={score.wrongAttempts}
              passed={score.passed}
              size="small"
              showDetails={false}
            />
          </div>
        )}
      </div>

      {/* Security Info Banner */}
      {showSecurityInfo && (
        <div className="bg-green-50 dark:bg-green-900/20 p-3 border-b border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
            <div>
              <p className="text-xs font-medium text-green-800 dark:text-green-200">
                High Security Mode (Docker Isolated)
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your code runs in an isolated container with strict resource limits.
              </p>
            </div>
            <button 
              onClick={toggleSecurityInfo}
              className="ml-auto p-1 text-green-600 dark:text-green-400"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Content */}
      {!isMobilePanelOpen ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-sm max-w-none">
            {formatDescription(problem.description)}
            
            {problem.examples && problem.examples.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Examples</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-[var(--color-bg-secondary)] p-3 rounded-lg mb-4">
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-2 text-sm">
                      Example {index + 1}:
                    </h4>
                    <div className="space-y-2 text-xs">
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
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Constraints</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <pre className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                    {problem.constraints}
                  </pre>
                </div>
              </div>
            )}
            
            {problem.followUp && (
              <div className="mt-6">
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Follow-up</h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {problem.followUp}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <CodeEditor problemId={problem._id} onSubmit={handleSubmission} />
        </div>
      )}
    </div>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <div className={`h-full ${isFullScreen ? 'fixed inset-0 z-50 bg-[var(--color-bg-primary)]' : ''}`}>
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
                
                {/* Layout Controls */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={toggleFullScreen}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--color-hover-light)] transition-colors"
                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                  >
                    {isFullScreen ? 
                      <Minimize className="w-4 h-4 text-[var(--color-text-secondary)]" /> : 
                      <Maximize className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    }
                  </button>
                   
                  {/* Security Info Button */}
                  <button
                    onClick={toggleSecurityInfo}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--color-hover-light)] transition-colors"
                    title="Security Information"
                  >
                    <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {problem.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getDifficultyColor(problem.difficulty)}`}>
                  {getDifficultyIcon(problem.difficulty)}
                  {problem.difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  {problem.category}
                </div>
              </div>
              
              {/* Score Display */}
              {score && (
                <div className="mt-4">
                  <ScoreDisplay 
                    score={score.score}
                    maxScore={100}
                    clickedHint={score.clickedHint}
                    clickedSolution={score.clickedSolution}
                    wrongAttempts={score.wrongAttempts}
                    passed={score.passed}
                    timeSpent={score.timeSpent}
                    language={score.language}
                    size="small"
                  />
                </div>
              )}
            </div>

            {/* Security Info Banner */}
            {showSecurityInfo && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 border-b border-green-200 dark:border-green-800">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                      {executionMethod === 'docker' 
                        ? 'High Security Mode (Docker Isolated)' 
                        : executionMethod === 'native'
                          ? 'Native Execution Mode'
                          : 'Security Information'}
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {executionMethod === 'docker' 
                        ? 'Your code runs in an isolated Docker container with strict resource limits and network isolation.' 
                        : executionMethod === 'native'
                          ? 'Your code runs in native mode with basic sandboxing. For maximum security, ensure Docker is running.'
                          : 'Code execution security status will be shown after you run your code.'}
                    </p>
                  </div>
                  <button 
                    onClick={toggleSecurityInfo}
                    className="ml-3 p-1 text-green-600 dark:text-green-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

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
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-[var(--color-border)] hover:bg-indigo-500 transition-colors" />

        {/* Code Editor Panel */}
        <Panel defaultSize={60} minSize={40}>
          <CodeEditor problemId={problem._id} onSubmit={handleSubmission} />
        </Panel>
      </PanelGroup>

      {/* Full Screen Exit Button */}
      {isFullScreen && (
        <button
          onClick={toggleFullScreen}
          className="fixed top-4 right-4 p-2 bg-[var(--color-bg-secondary)] rounded-full shadow-lg hover:bg-[var(--color-hover-light)] transition-colors z-50"
          title="Exit full screen"
        >
          <Minimize className="w-5 h-5 text-[var(--color-text-primary)]" />
        </button>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen bg-[var(--color-bg-primary)] flex flex-col ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex-1">
        {/* Show mobile layout on small screens, desktop layout on large screens */}
        <div className="block lg:hidden h-full">
          <MobileLayout />
        </div>
        <div className="hidden lg:block h-full">
          <DesktopLayout />
        </div>
      </div>

      {/* Footer - Hide in fullscreen mode */}
      {!isFullScreen && (
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
      )}
    </div>
  );
};

export default ProblemView;