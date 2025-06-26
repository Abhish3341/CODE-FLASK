import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Settings, Clock, MemoryStick, AlertTriangle, CheckCircle, Shield, Zap, ChevronDown, ChevronUp, RefreshCw, TestTube, User, Sparkles, Eye, X, MessageCircle, Lightbulb } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import ScoreTracker from './ScoreTracker';
import ResizablePanel from './ResizablePanel';
import MultiResizablePanel from './MultiResizablePanel';

interface CodeEditorProps {
  problemId: string;
  onSubmit: (result: {
    code: string;
    language: string;
    output: string;
    executionTime?: number;
    memoryUsed?: number;
    error?: string;
    score?: number;
  }) => void;
}

interface TestCase {
  input: string;
  expected: string;
}

interface ScoreData {
  score: number;
  clickedHint: boolean;
  clickedSolution: boolean;
  wrongAttempts: number;
  passed: boolean;
  exists: boolean;
}

interface AIHintResponse {
  hint: string;
  problemTitle: string;
  language: string;
  timestamp: string;
  isAIGenerated?: boolean;
  fallbackHint?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problemId, onSubmit }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [memoryUsed, setMemoryUsed] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [compilerHealth, setCompilerHealth] = useState<{
    status: string;
    docker: string;
    security: string;
    supportedLanguages: string[];
  } | null>(null);
  const [executionMethod, setExecutionMethod] = useState<'docker' | 'native' | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [testMode, setTestMode] = useState<'manual' | 'sample'>('manual');
  const [sampleCases, setSampleCases] = useState<TestCase[]>([]);
  const [testResults, setTestResults] = useState<Array<{
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
  }>>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);

  // Score tracking state
  const [scoreData, setScoreData] = useState<ScoreData>({
    score: 0,
    clickedHint: false,
    clickedSolution: false,
    wrongAttempts: 0,
    passed: false,
    exists: false
  });
  const [showScoreTracker, setShowScoreTracker] = useState(true);
  const [isLoadingScore, setIsLoadingScore] = useState(false);

  // Time tracking state
  const [problemStartTime, setProblemStartTime] = useState<Date | null>(null);
  const [hasStartedTracking, setHasStartedTracking] = useState(false);

  // Enhanced AI Hint state (combining both AI and manual hint functionality)
  const [aiHint, setAiHint] = useState<string>('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [showAiHint, setShowAiHint] = useState(false);
  const [hintError, setHintError] = useState<string>('');
  const [hintType, setHintType] = useState<'ai' | 'manual' | null>(null);

  useEffect(() => {
    loadTemplate();
    checkCompilerHealth();
    fetchSampleCases();
    fetchScoreData();
    startTimeTracking();
  }, [language, problemId]);

  // Start time tracking when problem is opened
  const startTimeTracking = async () => {
    if (!hasStartedTracking && problemId) {
      try {
        // Get problem details for tracking
        const problemResponse = await axiosInstance.get(`/api/problems/${problemId}`);
        const problemTitle = problemResponse.data.title;

        // Start time tracking
        await axiosInstance.post('/api/time/problem/start', {
          problemId,
          problemTitle,
          language
        });

        setProblemStartTime(new Date());
        setHasStartedTracking(true);
        console.log('⏱️ Started time tracking for problem');
      } catch (error) {
        console.error('Failed to start time tracking:', error);
      }
    }
  };

  // Record problem run for time tracking
  const recordProblemRun = async () => {
    try {
      await axiosInstance.post('/api/time/problem/run', {
        problemId
      });
      console.log('🏃 Recorded problem run');
    } catch (error) {
      console.error('Failed to record problem run:', error);
    }
  };

  // Record problem submission for time tracking
  const recordProblemSubmission = async (isCorrect: boolean) => {
    try {
      await axiosInstance.post('/api/time/problem/submit', {
        problemId,
        isCorrect
      });
      console.log('📤 Recorded problem submission, correct:', isCorrect);
    } catch (error) {
      console.error('Failed to record problem submission:', error);
    }
  };

  const fetchScoreData = async () => {
    setIsLoadingScore(true);
    try {
      const response = await axiosInstance.get(`/api/scores/problem/${problemId}`);
      setScoreData(response.data);
    } catch (error) {
      console.error('Failed to fetch score data:', error);
    } finally {
      setIsLoadingScore(false);
    }
  };

  // Enhanced AI Hint functionality (combining AI and manual hints)
  const handleAiHintClick = async () => {
    setIsLoadingHint(true);
    setHintError('');
    setAiHint('');
    setHintType(null);

    try {
      console.log('🤖 Requesting enhanced AI hint...');
      
      const response = await axiosInstance.post('/api/ai/hint', {
        problemId,
        code: code.trim(),
        language
      });

      const hintData: AIHintResponse = response.data;
      
      // Set the hint (AI or manual fallback)
      setAiHint(hintData.hint || hintData.fallbackHint || 'Unable to generate hint at this time.');
      setHintType(hintData.isAIGenerated ? 'ai' : 'manual');
      setShowAiHint(true);

      // Record hint usage for scoring
      await recordHintUsage();

      console.log(`🤖 ${hintData.isAIGenerated ? 'AI' : 'Manual'} hint received successfully`);

    } catch (error: any) {
      console.error('Failed to get hint:', error);
      
      const errorData = error.response?.data;
      if (errorData?.fallbackHint) {
        setAiHint(errorData.fallbackHint);
        setHintType('manual');
        setShowAiHint(true);
        // Still record hint usage even for fallback
        await recordHintUsage();
      } else {
        setHintError(errorData?.error || 'Failed to get hint. Please try again.');
      }
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Record hint usage for scoring
  const recordHintUsage = async () => {
    try {
      const response = await axiosInstance.post(`/api/scores/hint/${problemId}`, {
        language
      });
      
      // Update score data
      setScoreData(prev => ({
        ...prev,
        clickedHint: true,
        score: response.data.score
      }));

      // Show hint penalty message
      setSubmitMessage(`💡 Hint used! -30 points penalty applied. Current score: ${response.data.score}/100`);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitMessage('');
      }, 3000);

    } catch (error) {
      console.error('Failed to record hint usage:', error);
    }
  };

  const handleSolutionClick = async () =>  {
    try {
      const response = await axiosInstance.post(`/api/scores/solution/${problemId}`, {
        language
      });
      
      // Update score data
      setScoreData(prev => ({
        ...prev,
        clickedSolution: true,
        score: 0
      }));

      // Show solution penalty message
      setSubmitMessage(`🔓 Solution viewed! Score reset to 0.`);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitMessage('');
      }, 3000);

    } catch (error) {
      console.error('Failed to record solution viewing:', error);
    }
  };

  const closeAiHint = () => {
    setShowAiHint(false);
    setAiHint('');
    setHintError('');
    setHintType(null);
  };

  const fetchSampleCases = async () => {
    try {
      const response = await axiosInstance.get(`/api/problems/${problemId}`);
      if (response.data.examples) {
        const cases = response.data.examples.map((example: any) => ({
          input: example.input,
          expected: example.output
        }));
        setSampleCases(cases);
      }
    } catch (error) {
      console.error('Failed to fetch sample cases:', error);
    }
  };

  const loadTemplate = async () => {
    setIsLoadingTemplate(true);
    try {
      const response = await axiosInstance.get(`/api/problems/${problemId}/template/${language}`);
      setCode(response.data.template);
    } catch (error) {
      console.error('Failed to load template:', error);
      setCode(getBasicTemplate(language));
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  const getBasicTemplate = (lang: string) => {
    const templates = {
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`,

      cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,

      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,

      python: `def solution():
    # Your code here
    return "Hello, World!"

if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`
    };

    return templates[lang as keyof typeof templates] || templates.python;
  };

  const checkCompilerHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const response = await axiosInstance.get('/api/compiler/health');
      setCompilerHealth(response.data);
    } catch (error) {
      console.error('Failed to check compiler health:', error);
      setCompilerHealth({
        status: 'unhealthy',
        docker: 'unavailable',
        security: 'low',
        supportedLanguages: ['c', 'cpp', 'java', 'python']
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const refreshCompilerStatus = async () => {
    await checkCompilerHealth();
  };

  const runCode = async (testInput?: string) => {
    if (!code.trim()) {
      setError('Please write some code before running');
      return null;
    }

    const inputToUse = testInput !== undefined ? testInput : input.trim();

    try {
      console.log('🏃 Running code (test only - no submission tracking)');
      
      // Record the run for time tracking
      await recordProblemRun();
      
      const response = await axiosInstance.post('/api/compiler/execute', {
        code,
        language,
        input: inputToUse
      });

      if (response.data.success) {
        return {
          output: response.data.output,
          executionTime: response.data.executionTime,
          memoryUsed: response.data.memoryUsed,
          executionMethod: response.data.executionMethod,
          error: null
        };
      } else {
        return {
          output: '',
          executionTime: 0,
          memoryUsed: 0,
          executionMethod: response.data.executionMethod,
          error: response.data.error || 'Code execution failed'
        };
      }
    } catch (err: any) {
      return {
        output: '',
        executionTime: 0,
        memoryUsed: 0,
        executionMethod: null,
        error: err.response?.data?.error || 'Failed to execute code'
      };
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError('');
    setOutput('');
    setExecutionTime(null);
    setMemoryUsed(null);
    setExecutionMethod(null);
    setTestResults([]);

    const result = await runCode();
    
    if (result) {
      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.output);
        setExecutionTime(result.executionTime);
        setMemoryUsed(result.memoryUsed);
        setExecutionMethod(result.executionMethod);
      }
    }

    setIsRunning(false);
  };

  const runAllSampleCases = async () => {
    if (!code.trim()) {
      setError('Please write some code before testing');
      return;
    }

    setIsTestingAll(true);
    setError('');
    setTestResults([]);

    const results = [];

    for (const testCase of sampleCases) {
      const result = await runCode(testCase.input);
      
      if (result) {
        const actualOutput = result.output.trim();
        const expectedOutput = testCase.expected.trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          input: testCase.input,
          expected: expectedOutput,
          actual: actualOutput,
          passed,
          error: result.error
        });
      }
    }

    setTestResults(results);
    setIsTestingAll(false);

    // Show summary
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    
    if (passedCount === totalCount) {
      setOutput(`✅ All ${totalCount} test cases passed!`);
    } else {
      setOutput(`❌ ${passedCount}/${totalCount} test cases passed`);
    }
  };

  const submitCode = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitMessage('');
    setError('');

    try {
      console.log('📤 Submitting solution (this will be tracked)');

      // First run the code if not already run
      if (!output && !error) {
        await handleRunCode();
      }

      // Determine if solution passed based on output
      const passed = output && 
                    !output.toLowerCase().includes('error') && 
                    !output.toLowerCase().includes('exception') &&
                    !output.toLowerCase().includes('failed') &&
                    !output.toLowerCase().includes('traceback') &&
                    (output.toLowerCase().includes('passed') || 
                     output.toLowerCase().includes('success') ||
                     output.includes('✅') ||
                     output.includes('✓') ||
                     output.toLowerCase().includes('correct'));

      // Calculate time spent (in minutes)
      const timeSpent = problemStartTime ? 
        Math.round((new Date().getTime() - problemStartTime.getTime()) / (1000 * 60)) : 5;

      // Submit to submissions endpoint
      const submitResponse = await axiosInstance.post('/api/submissions', {
        problemId,
        code,
        language,
        output: output || '',
        executionTime: executionTime || undefined,
        memoryUsed: memoryUsed || undefined,
        timeSpent
      });

      // Record submission for time tracking
      await recordProblemSubmission(passed);

      // Update score
      const scoreResponse = await axiosInstance.post(`/api/scores/submission/${problemId}`, {
        passed,
        language,
        submissionId: submitResponse.data.id,
        timeSpent
      });

      // Update local score data
      setScoreData(prev => ({
        ...prev,
        score: scoreResponse.data.score,
        wrongAttempts: scoreResponse.data.wrongAttempts,
        passed: scoreResponse.data.passed,
        exists: true
      }));

      if (submitResponse.data.id) {
        setSubmitSuccess(true);
        setSubmitMessage(scoreResponse.data.message || 'Solution submitted successfully! 🎉');
        
        onSubmit({
          code,
          language,
          output: output || '',
          executionTime: executionTime || undefined,
          memoryUsed: memoryUsed || undefined,
          error: error || undefined,
          score: scoreResponse.data.score
        });

        setTimeout(() => {
          setSubmitSuccess(false);
          setSubmitMessage('');
        }, 5000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCode = () => {
    loadTemplate();
    setOutput('');
    setError('');
    setExecutionTime(null);
    setMemoryUsed(null);
    setExecutionMethod(null);
    setSubmitSuccess(false);
    setSubmitMessage('');
    setTestResults([]);
    // Close AI hint when resetting
    setShowAiHint(false);
    setAiHint('');
    setHintError('');
    setHintType(null);
  };

  const getExecutionMethodBadge = () => {
    if (!executionMethod) return null;
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
        executionMethod === 'docker' 
          ? 'bg-green-500/20 text-green-500' 
          : 'bg-orange-500/20 text-orange-500'
      }`}>
        {executionMethod === 'docker' ? <Shield className="w-2 h-2 sm:w-3 sm:h-3" /> : <Zap className="w-2 h-2 sm:w-3 sm:h-3" />}
        <span className="hidden sm:inline">{executionMethod === 'docker' ? 'Secure' : 'Native'}</span>
      </div>
    );
  };

  if (isLoadingTemplate) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-[var(--color-text-secondary)] text-sm sm:text-base">Loading template...</div>
      </div>
    );
  }

  const leftPanel = (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-[var(--color-border)]">
        <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Code Editor</h3>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 p-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-sm resize-none focus:outline-none"
        placeholder="Write your code here..."
        spellCheck={false}
      />
    </div>
  );

  // Create sections for the right panel with resizable areas
  const rightPanelSections = [];

  // Score Tracker Section
  if (showScoreTracker) {
    rightPanelSections.push({
      id: 'score-tracker',
      defaultHeight: 25,
      minHeight: 15,
      content: (
        <div className="h-full flex flex-col">
          <div className="p-2 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Score Tracker</h3>
            <button
              onClick={() => setShowScoreTracker(!showScoreTracker)}
              className="p-1 hover:bg-[var(--color-border)] rounded transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto">
            {isLoadingScore ? (
              <div className="text-center text-[var(--color-text-secondary)] py-2">
                Loading score...
              </div>
            ) : (
              <ScoreTracker
                score={scoreData.score}
                clickedHint={scoreData.clickedHint}
                clickedSolution={scoreData.clickedSolution}
                wrongAttempts={scoreData.wrongAttempts}
                passed={scoreData.passed}
                compact={true}
              />
            )}
          </div>
        </div>
      )
    });
  } else {
    rightPanelSections.push({
      id: 'score-collapsed',
      defaultHeight: 8,
      minHeight: 8,
      content: (
        <div className="h-full flex flex-col">
          <div className="p-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Score: {scoreData.score}/100</h3>
            <button
              onClick={() => setShowScoreTracker(!showScoreTracker)}
              className="p-1 hover:bg-[var(--color-border)] rounded transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    });
  }

  // Input/Output sections based on test mode
  if (testMode === 'manual') {
    // Input Section
    rightPanelSections.push({
      id: 'input',
      defaultHeight: 35,
      minHeight: 20,
      content: (
        <div className="h-full flex flex-col">
          <div className="p-2 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Input</h3>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-xs resize-none focus:outline-none"
            placeholder="Enter input for your program..."
          />
        </div>
      )
    });

    // Output Section
    rightPanelSections.push({
      id: 'output',
      defaultHeight: 40,
      minHeight: 20,
      content: (
        <div className="h-full flex flex-col">
          <div className="p-2 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Output</h3>
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                {executionTime !== null && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{executionTime}ms</span>
                  </div>
                )}
                {memoryUsed !== null && (
                  <div className="flex items-center gap-1">
                    <MemoryStick className="w-3 h-3" />
                    <span>{memoryUsed}KB</span>
                  </div>
                )}
                {getExecutionMethodBadge()}
              </div>
            </div>
          </div>
          <div className="flex-1 p-2 bg-[var(--color-bg-secondary)] overflow-y-auto">
            {error ? (
              <div className="text-red-500 font-mono text-xs whitespace-pre-wrap">{error}</div>
            ) : output ? (
              <div className="text-[var(--color-text-primary)] font-mono text-xs whitespace-pre-wrap">{output}</div>
            ) : (
              <div className="text-[var(--color-text-secondary)] text-xs">Run your code to see output here...</div>
            )}
          </div>
        </div>
      )
    });
  } else {
    // Sample Test Cases Section
    rightPanelSections.push({
      id: 'sample-tests',
      defaultHeight: 75,
      minHeight: 30,
      content: (
        <div className="h-full flex flex-col">
          <div className="p-2 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Sample Test Cases ({sampleCases.length})
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Test your code against sample inputs
            </p>
          </div>
          
          <div className="flex-1 p-2 bg-[var(--color-bg-secondary)] overflow-y-auto">
            {testResults.length > 0 ? (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-2 rounded border-l-4 text-xs ${
                    result.passed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {result.passed ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="font-medium">Test Case {index + 1}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium">Input:</span>
                        <code className="ml-1 bg-gray-100 dark:bg-gray-800 px-1 rounded">{result.input}</code>
                      </div>
                      <div>
                        <span className="font-medium">Expected:</span>
                        <code className="ml-1 bg-gray-100 dark:bg-gray-800 px-1 rounded">{result.expected}</code>
                      </div>
                      <div>
                        <span className="font-medium">Actual:</span>
                        <code className="ml-1 bg-gray-100 dark:bg-gray-800 px-1 rounded">{result.actual}</code>
                      </div>
                      {result.error && (
                        <div>
                          <span className="font-medium text-red-500">Error:</span>
                          <code className="ml-1 bg-red-100 dark:bg-red-900 px-1 rounded text-red-700 dark:text-red-300">{result.error}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : sampleCases.length > 0 ? (
              <div className="space-y-2">
                {sampleCases.map((testCase, index) => (
                  <div key={index} className="p-2 rounded bg-gray-50 dark:bg-gray-800 text-xs">
                    <div className="font-medium mb-1">Test Case {index + 1}</div>
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium">Input:</span>
                        <code className="ml-1 bg-gray-100 dark:bg-gray-700 px-1 rounded">{testCase.input}</code>
                      </div>
                      <div>
                        <span className="font-medium">Expected:</span>
                        <code className="ml-1 bg-gray-100 dark:bg-gray-700 px-1 rounded">{testCase.expected}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[var(--color-text-secondary)] py-4">
                <TestTube className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No sample test cases available</p>
              </div>
            )}
          </div>
        </div>
      )
    });
  }

  const rightPanel = (
    <MultiResizablePanel
      sections={rightPanelSections}
      className="h-full"
    />
  );

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 border-b border-[var(--color-border)] gap-2">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="c">C (GCC)</option>
            <option value="cpp">C++ (G++)</option>
            <option value="java">Java 11</option>
            <option value="python">Python 3.9</option>
          </select>
          
          <button
            onClick={resetCode}
            className="flex items-center gap-1 px-2 py-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm"
            title="Reset Code"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* AI Hint Button */}
          <button
            onClick={handleAiHintClick}
            disabled={isLoadingHint || scoreData.clickedSolution}
            className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title={scoreData.clickedSolution ? "Solution already viewed" : "Get AI-powered hint (-30 points)"}
          >
            {isLoadingHint ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">{isLoadingHint ? 'Getting...' : 'Hint'}</span>
          </button>

          {/* Solution Button */}
          <button
            onClick={handleSolutionClick}
            disabled={scoreData.clickedSolution}
            className="flex items-center gap-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title={scoreData.clickedSolution ? "Solution already viewed" : "View solution (Score = 0)"}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Solution</span>
          </button>

          {/* Test Mode Toggle */}
          <div className="flex items-center gap-1 bg-[var(--color-bg-secondary)] rounded p-1">
            <button
              onClick={() => setTestMode('manual')}
              className={`flex items-center gap-1 px-1 py-1 rounded text-xs transition-colors ${
                testMode === 'manual' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Manual</span>
            </button>
            <button
              onClick={() => setTestMode('sample')}
              className={`flex items-center gap-1 px-1 py-1 rounded text-xs transition-colors ${
                testMode === 'sample' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <TestTube className="w-3 h-3" />
              <span className="hidden sm:inline">Sample</span>
            </button>
          </div>

          {testMode === 'manual' ? (
            <button
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting}
              className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isRunning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isRunning ? 'Running...' : 'Run'}
            </button>
          ) : (
            <button
              onClick={runAllSampleCases}
              disabled={isTestingAll || isSubmitting || sampleCases.length === 0}
              className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isTestingAll ? <Square className="w-3 h-3" /> : <TestTube className="w-3 h-3" />}
              {isTestingAll ? 'Testing...' : `Test (${sampleCases.length})`}
            </button>
          )}
          
          <button
            onClick={submitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {submitSuccess && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 p-2">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <p className="text-green-700 dark:text-green-200 font-medium text-sm">{submitMessage}</p>
          </div>
        </div>
      )}

      {/* AI Hint Display */}
      {showAiHint && aiHint && (
        <div className={`${hintType === 'ai' ? 'bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500' : 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500'} p-2`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 flex-1">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 ${
                hintType === 'ai' 
                  ? 'bg-purple-100 dark:bg-purple-800' 
                  : 'bg-yellow-100 dark:bg-yellow-800'
              }`}>
                {hintType === 'ai' 
                  ? <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-300" />
                  : <Lightbulb className="w-3 h-3 text-yellow-600 dark:text-yellow-300" />
                }
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-medium mb-1 flex items-center gap-1 ${
                  hintType === 'ai'
                    ? 'text-purple-800 dark:text-purple-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  <MessageCircle className="w-3 h-3" />
                  {hintType === 'ai' ? 'AI Hint' : 'Hint'}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  hintType === 'ai'
                    ? 'text-purple-700 dark:text-purple-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {aiHint}
                </p>
              </div>
            </div>
            <button
              onClick={closeAiHint}
              className={`ml-2 p-1 rounded transition-colors ${
                hintType === 'ai'
                  ? 'hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-600 dark:text-yellow-300'
              }`}
              title="Close hint"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Hint Error */}
      {hintError && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 p-2">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-200 font-medium text-sm">{hintError}</p>
          </div>
        </div>
      )}

      {/* Compiler Health Warning */}
      {compilerHealth?.docker === 'unavailable' && (
        <div className="bg-orange-100 dark:bg-orange-900 border-l-4 border-orange-500 p-2">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Docker Engine Not Running - Using Fallback Mode
              </h3>
              <div className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                <p>Code will run in native mode with reduced security.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1">
        <ResizablePanel
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          defaultLeftWidth={65}
          minLeftWidth={40}
          minRightWidth={30}
        />
      </div>
    </div>
  );
};

export default CodeEditor;