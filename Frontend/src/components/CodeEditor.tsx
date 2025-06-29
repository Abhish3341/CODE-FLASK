import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import { Play, Check, X, Clock, AlertTriangle, Lightbulb, Eye, Info, ChevronDown, ChevronUp, Code, Terminal, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import AIHintModal from './AIHintModal';
import ScoreTracker from './ScoreTracker';

interface CodeEditorProps {
  problemId: string;
  onSubmit?: (result: any) => void;
}

interface TestResult {
  success: boolean;
  output: string;
  error: string;
  executionTime: number;
  memoryUsed: number;
  executionMethod?: 'docker' | 'native';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problemId, onSubmit }) => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [theme, setTheme] = useState<string>('vs-dark');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [memoryUsed, setMemoryUsed] = useState<number | null>(null);
  const [showConsole, setShowConsole] = useState<boolean>(true);
  const [isAIHintModalOpen, setIsAIHintModalOpen] = useState<boolean>(false);
  const [aiHint, setAIHint] = useState<string>('');
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [hintError, setHintError] = useState<string>('');
  const [hintType, setHintType] = useState<'ai' | 'manual' | null>(null);
  const [problemTitle, setProblemTitle] = useState<string>('');
  const [score, setScore] = useState({
    score: 0,
    clickedHint: false,
    clickedSolution: false,
    wrongAttempts: 0,
    passed: false
  });
  const [showSolutionConfirmation, setShowSolutionConfirmation] = useState<boolean>(false);
  const [showHintConfirmation, setShowHintConfirmation] = useState<boolean>(false);
  const [executionMethod, setExecutionMethod] = useState<'docker' | 'native' | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchTemplate();
    fetchScore();
  }, [problemId, language]);

  const fetchTemplate = async () => {
    try {
      const response = await axiosInstance.get(`/api/problems/${problemId}/template/${language}`);
      setCode(response.data.template);
      setProblemTitle(response.data.problemTitle || '');
    } catch (error) {
      console.error('Error fetching template:', error);
      setError('Failed to load code template');
    }
  };

  const fetchScore = async () => {
    try {
      const response = await axiosInstance.get(`/api/scores/problem/${problemId}`);
      if (response.data.exists) {
        setScore({
          score: response.data.finalScore,
          clickedHint: response.data.clickedHint,
          clickedSolution: response.data.clickedSolution,
          wrongAttempts: response.data.wrongAttempts,
          passed: response.data.passed
        });
      }
    } catch (error) {
      console.error('Error fetching score:', error);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleRun = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setError(null);
    setOutput('');
    setExecutionTime(null);
    setMemoryUsed(null);
    
    try {
      // Record run in time tracking
      await axiosInstance.post('/api/time/problem/run', { problemId });
      
      const response = await axiosInstance.post('/api/compiler/execute', {
        code,
        language,
        input
      });
      
      setOutput(response.data.output || 'No output');
      setExecutionTime(response.data.executionTime);
      setMemoryUsed(response.data.memoryUsed);
      setExecutionMethod(response.data.executionMethod);
      
      if (!response.data.success) {
        setError(response.data.error || 'Execution failed');
      }
    } catch (error: any) {
      console.error('Run error:', error);
      setError(error.response?.data?.error || 'Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Run the code first
      const runResponse = await axiosInstance.post('/api/compiler/execute', {
        code,
        language,
        input: ''
      });
      
      setOutput(runResponse.data.output || 'No output');
      setExecutionTime(runResponse.data.executionTime);
      setMemoryUsed(runResponse.data.memoryUsed);
      setExecutionMethod(runResponse.data.executionMethod);
      
      if (!runResponse.data.success) {
        setError(runResponse.data.error || 'Execution failed');
        setIsSubmitting(false);
        return;
      }
      
      // Submit the solution
      const submissionResponse = await axiosInstance.post('/api/submissions', {
        code,
        language,
        problemId,
        output: runResponse.data.output,
        executionTime: runResponse.data.executionTime,
        memoryUsed: runResponse.data.memoryUsed,
        timeSpent: 10 // Placeholder, ideally this would be calculated from time tracking
      });
      
      // Update score
      const isSuccessful = submissionResponse.data.isSuccessful;
      const scoreResponse = await axiosInstance.post(`/api/scores/submission/${problemId}`, {
        passed: isSuccessful,
        language,
        submissionId: submissionResponse.data.id,
        timeSpent: 10 // Placeholder
      });
      
      setScore({
        score: scoreResponse.data.score,
        clickedHint: score.clickedHint,
        clickedSolution: score.clickedSolution,
        wrongAttempts: scoreResponse.data.wrongAttempts,
        passed: scoreResponse.data.passed
      });
      
      // Record submission in time tracking
      await axiosInstance.post('/api/time/problem/submit', {
        problemId,
        isCorrect: isSuccessful
      });
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit({
          success: isSuccessful,
          output: runResponse.data.output,
          executionTime: runResponse.data.executionTime,
          memoryUsed: runResponse.data.memoryUsed,
          executionMethod: runResponse.data.executionMethod
        });
      }
      
    } catch (error: any) {
      console.error('Submit error:', error);
      setError(error.response?.data?.error || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestHint = async () => {
    setIsLoadingHint(true);
    setHintError('');
    
    try {
      // Record hint usage in score
      await axiosInstance.post(`/api/scores/hint/${problemId}`, {
        language
      });
      
      // Update score state
      setScore(prev => ({
        ...prev,
        clickedHint: true,
        score: prev.score > 30 ? prev.score - 30 : 0
      }));
      
      // Get AI hint
      const response = await axiosInstance.post('/api/ai/hint', {
        problemId,
        code,
        language
      });
      
      setAIHint(response.data.hint);
      setHintType(response.data.isAIGenerated ? 'ai' : 'manual');
      
    } catch (error: any) {
      console.error('Hint error:', error);
      setHintError(error.response?.data?.error || 'Failed to get hint');
      
      // If there's a fallback hint, use it
      if (error.response?.data?.fallbackHint) {
        setAIHint(error.response.data.fallbackHint);
        setHintType('manual');
      }
    } finally {
      setIsLoadingHint(false);
      setShowHintConfirmation(false);
    }
  };

  const handleViewSolution = async () => {
    try {
      // Record solution viewing in score
      await axiosInstance.post(`/api/scores/solution/${problemId}`, {
        language
      });
      
      // Update score state
      setScore(prev => ({
        ...prev,
        clickedSolution: true,
        score: 0
      }));
      
      // Here you would typically fetch and display the solution
      // For now, we'll just show a message in the output
      setOutput("// Solution viewing is recorded. Your score for this problem is now 0.");
      
    } catch (error: any) {
      console.error('Solution view error:', error);
      setError(error.response?.data?.error || 'Failed to view solution');
    } finally {
      setShowSolutionConfirmation(false);
    }
  };

  const toggleConsole = () => {
    setShowConsole(!showConsole);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Toolbar */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          
          <select
            value={theme}
            onChange={handleThemeChange}
            className="px-3 py-2 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHintConfirmation(true)}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            disabled={isRunning || isSubmitting || score.clickedHint}
          >
            <Lightbulb className="w-4 h-4" />
            {score.clickedHint ? 'Hint Used' : 'Get Hint'}
          </button>
          
          <button
            onClick={() => setShowSolutionConfirmation(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            disabled={isRunning || isSubmitting || score.clickedSolution}
          >
            <Eye className="w-4 h-4" />
            {score.clickedSolution ? 'Solution Viewed' : 'View Solution'}
          </button>
          
          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={isRunning || isSubmitting}
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            disabled={isRunning || isSubmitting}
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="vertical">
          {/* Code Editor Panel */}
          <Panel defaultSize={70} minSize={30}>
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              value={code}
              theme={theme}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </Panel>

          {/* Console Panel */}
          {showConsole && (
            <>
              <PanelResizeHandle className="h-2 bg-[var(--color-border)] hover:bg-indigo-500 transition-colors" />
              <Panel defaultSize={30} minSize={20}>
                <div className="h-full flex flex-col">
                  <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[var(--color-text-secondary)]" />
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Console</span>
                    </div>
                    <button
                      onClick={toggleConsole}
                      className="p-1 hover:bg-[var(--color-hover-light)] rounded transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row">
                    {/* Input Panel */}
                    <div className="md:w-1/2 p-3 border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">Input</span>
                      </div>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-20 p-2 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                        placeholder="Enter input here..."
                      />
                    </div>
                    
                    {/* Output Panel */}
                    <div className="md:w-1/2 flex-1 p-3 overflow-auto bg-[var(--color-bg-secondary)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">Output</span>
                        
                        {executionTime !== null && (
                          <div className="flex items-center gap-1 ml-auto text-xs text-[var(--color-text-secondary)]">
                            <Clock className="w-3 h-3" />
                            <span>{executionTime}ms</span>
                          </div>
                        )}
                      </div>
                      
                      {error ? (
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            <pre className="text-red-700 dark:text-red-300 text-sm font-mono whitespace-pre-wrap overflow-auto">
                              {error}
                            </pre>
                          </div>
                        </div>
                      ) : output ? (
                        <pre className="p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] text-sm font-mono whitespace-pre-wrap overflow-auto">
                          {output}
                        </pre>
                      ) : (
                        <div className="p-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] text-sm">
                          Run your code to see the output here
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Bottom Status Bar */}
      <div className="p-2 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
          </div>
          
          {executionMethod && (
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>
                {executionMethod === 'docker' ? 'Docker Isolated' : 'Native Execution'}
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={toggleConsole}
          className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors"
        >
          <Terminal className="w-3 h-3" />
          <span>{showConsole ? 'Hide Console' : 'Show Console'}</span>
          {showConsole ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>

      {/* Score Tracker - Fixed Position */}
      <div className="fixed top-24 right-8 z-10 w-64">
        <ScoreTracker
          score={score.score}
          clickedHint={score.clickedHint}
          clickedSolution={score.clickedSolution}
          wrongAttempts={score.wrongAttempts}
          passed={score.passed}
        />
      </div>

      {/* AI Hint Modal */}
      <AIHintModal
        isOpen={isAIHintModalOpen}
        onClose={() => setIsAIHintModalOpen(false)}
        hint={aiHint}
        isLoading={isLoadingHint}
        error={hintError}
        onRequestHint={handleRequestHint}
        problemTitle={problemTitle}
        language={language}
        hintType={hintType}
      />

      {/* Hint Confirmation Modal */}
      {showHintConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Get a Hint?
              </h3>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Using a hint will reduce your score for this problem by 30 points. Are you sure you want to continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsAIHintModalOpen(true);
                  setShowHintConfirmation(false);
                }}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Yes, Get Hint
              </button>
              <button
                onClick={() => setShowHintConfirmation(false)}
                className="flex-1 px-4 py-2 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-hover-light)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Solution Confirmation Modal */}
      {showSolutionConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Eye className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                View Solution?
              </h3>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Viewing the solution will set your score for this problem to 0. This action cannot be undone. Are you sure you want to continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleViewSolution}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, View Solution
              </button>
              <button
                onClick={() => setShowSolutionConfirmation(false)}
                className="flex-1 px-4 py-2 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-hover-light)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;