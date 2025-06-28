import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Settings, Clock, MemoryStick, AlertTriangle, CheckCircle, Shield, Zap, ChevronDown, ChevronUp, RefreshCw, TestTube, User, Sparkles, Eye, X, MessageCircle, Lightbulb, BookOpen, Code, Info, PanelRight, PanelLeft, Maximize, Minimize, Award, Trophy, Target, FileText } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import ScoreTracker from './ScoreTracker';

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
    executionMethod?: string;
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
  
  // Manual mode toggle
  const [isManualExpanded, setIsManualExpanded] = useState(true);
  
  // Additional information panel
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [infoPanelContent, setInfoPanelContent] = useState<'security' | 'hints' | 'scoring'>('security');

  // Right panel state
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Manual dropdown menu state
  const [isManualMenuOpen, setIsManualMenuOpen] = useState(false);
  const [activeManualSection, setActiveManualSection] = useState<'sample' | 'hints' | 'scoring' | 'docs' | null>(null);

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
          score: scoreResponse.data.score,
          executionMethod: executionMethod || undefined
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
  
  const toggleInfoPanel = (content: 'security' | 'hints' | 'scoring') => {
    if (showInfoPanel && infoPanelContent === content) {
      setShowInfoPanel(false);
    } else {
      setInfoPanelContent(content);
      setShowInfoPanel(true);
    }
  };

  const toggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleManualButtonClick = () => {
    setIsManualMenuOpen(!isManualMenuOpen);
  };

  const selectManualSection = (section: 'sample' | 'hints' | 'scoring' | 'docs') => {
    setActiveManualSection(section === activeManualSection ? null : section);
    setIsManualMenuOpen(false);
  };

  if (isLoadingTemplate) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-[var(--color-text-secondary)] text-sm sm:text-base">Loading template...</div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-[var(--color-bg-primary)] ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-[var(--color-border)] gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="c">C (GCC)</option>
            <option value="cpp">C++ (G++)</option>
            <option value="java">Java 11</option>
            <option value="python">Python 3.9</option>
          </select>
          
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm sm:text-base"
            title="Reset Code"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRightPanel}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover-light)] transition-colors"
              title={showRightPanel ? "Hide right panel" : "Show right panel"}
            >
              {showRightPanel ? 
                <PanelLeft className="w-4 h-4 text-[var(--color-text-secondary)]" /> : 
                <PanelRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
              }
            </button>
            <button
              onClick={toggleFullScreen}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover-light)] transition-colors"
              title={isFullScreen ? "Exit full screen" : "Full screen"}
            >
              {isFullScreen ? 
                <Minimize className="w-4 h-4 text-[var(--color-text-secondary)]" /> : 
                <Maximize className="w-4 h-4 text-[var(--color-text-secondary)]" />
              }
            </button>
          </div>

          {/* AI Hint Button (Enhanced with both AI and manual hint functionality) */}
          <button
            onClick={handleAiHintClick}
            disabled={isLoadingHint || scoreData.clickedSolution}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            title={scoreData.clickedSolution ? "Solution already viewed" : "Get AI-powered hint (-30 points)"}
          >
            {isLoadingHint ? (
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="hidden sm:inline">{isLoadingHint ? 'Getting Hint...' : 'Hint'}</span>
          </button>

          {/* Solution Button */}
          <button
            onClick={handleSolutionClick}
            disabled={scoreData.clickedSolution}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            title={scoreData.clickedSolution ? "Solution already viewed" : "View solution (Score = 0)"}
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Solution</span>
          </button>

          {/* Manual Button with Dropdown */}
          <div className="relative">
            <button
              onClick={handleManualButtonClick}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Manual</span>
              {isManualMenuOpen ? 
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : 
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              }
            </button>
            
            {isManualMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[var(--color-bg-secondary)] rounded-lg shadow-lg border border-[var(--color-border)] z-10">
                <div className="p-2">
                  <button 
                    onClick={() => selectManualSection('sample')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--color-hover-light)] rounded-md text-sm"
                  >
                    <TestTube className="w-4 h-4" />
                    Sample Tests
                  </button>
                  <button 
                    onClick={() => selectManualSection('hints')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--color-hover-light)] rounded-md text-sm"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Hint Info
                  </button>
                  <button 
                    onClick={() => selectManualSection('scoring')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--color-hover-light)] rounded-md text-sm"
                  >
                    <Trophy className="w-4 h-4" />
                    Scoring Guide
                  </button>
                  <button 
                    onClick={() => selectManualSection('docs')}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--color-hover-light)] rounded-md text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Documentation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security Info Button */}
          <button
            onClick={() => toggleInfoPanel('security')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover-light)] transition-colors"
            title="Security Information"
          >
            <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isRunning ? <Square className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          
          <button
            onClick={submitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 p-3 sm:p-4">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3" />
            <p className="text-green-700 dark:text-green-200 font-medium text-sm sm:text-base">{submitMessage}</p>
          </div>
        </div>
      )}

      {/* Manual Section Panel */}
      {activeManualSection && (
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
              {activeManualSection === 'sample' && 'Sample Tests'}
              {activeManualSection === 'hints' && 'Hint System Information'}
              {activeManualSection === 'scoring' && 'Scoring Guide'}
              {activeManualSection === 'docs' && 'Documentation'}
            </h3>
            <button 
              onClick={() => setActiveManualSection(null)}
              className="p-1 hover:bg-[var(--color-hover-light)] rounded-full"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
          
          {activeManualSection === 'sample' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Run your code against the sample test cases to verify your solution.
              </p>
              
              {sampleCases.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {sampleCases.map((testCase, index) => (
                      <div key={index} className="p-3 rounded-lg bg-[var(--color-bg-primary)]">
                        <div className="text-sm font-medium mb-2">Test Case {index + 1}</div>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="font-medium">Input:</span>
                            <code className="ml-2 bg-[var(--color-bg-secondary)] px-1 rounded">{testCase.input}</code>
                          </div>
                          <div>
                            <span className="font-medium">Expected:</span>
                            <code className="ml-2 bg-[var(--color-bg-secondary)] px-1 rounded">{testCase.expected}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={runAllSampleCases}
                    disabled={isTestingAll || isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isTestingAll ? <Square className="w-4 h-4" /> : <TestTube className="w-4 h-4" />}
                    {isTestingAll ? 'Testing...' : `Run All Test Cases (${sampleCases.length})`}
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <TestTube className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No sample test cases available</p>
                </div>
              )}
            </div>
          )}
          
          {activeManualSection === 'hints' && (
            <div className="text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">AI-Powered Hints</p>
                  <p>Our AI analyzes your code and provides contextual hints to guide you toward the solution without giving away the answer.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Manual Hints</p>
                  <p>When AI is unavailable, we provide carefully crafted hints based on common problem-solving patterns.</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300">
                  <strong>Note:</strong> Using hints will apply a -30 point penalty to your score.
                </p>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={handleAiHintClick}
                  disabled={isLoadingHint || scoreData.clickedSolution}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoadingHint ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isLoadingHint ? 'Getting Hint...' : 'Get AI Hint'}
                </button>
              </div>
            </div>
          )}
          
          {activeManualSection === 'scoring' && (
            <div className="text-sm text-[var(--color-text-secondary)]">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Base Score: 100 points</p>
                  <p>Every problem starts with a maximum possible score of 100 points.</p>
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Penalties:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Using a hint: -30 points</li>
                    <li>Each wrong submission: -5 points</li>
                    <li>Viewing the solution: Score reset to 0</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Final Score Calculation:</p>
                  <p>Base Score - Hint Penalty - (Wrong Attempts × 5)</p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300">
                    <strong>Current Score:</strong> {scoreData.score}/100
                  </p>
                  <div className="mt-2 text-xs">
                    {scoreData.clickedHint && <p>• Hint used: -30 points</p>}
                    {scoreData.wrongAttempts > 0 && <p>• Wrong attempts: -{scoreData.wrongAttempts * 5} points</p>}
                    {scoreData.clickedSolution && <p>• Solution viewed: Score reset to 0</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeManualSection === 'docs' && (
            <div className="text-sm text-[var(--color-text-secondary)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Keyboard Shortcuts</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Run Code</span>
                      <code className="bg-[var(--color-bg-primary)] px-2 rounded">Ctrl+Enter</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Submit Solution</span>
                      <code className="bg-[var(--color-bg-primary)] px-2 rounded">Ctrl+Shift+Enter</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Format Code</span>
                      <code className="bg-[var(--color-bg-primary)] px-2 rounded">Ctrl+Shift+F</code>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Language Info</h4>
                  <div className="space-y-1">
                    <p><strong>Python 3.9:</strong> Standard libraries only</p>
                    <p><strong>C/C++:</strong> GCC 9.0 compiler</p>
                    <p><strong>Java:</strong> OpenJDK 11</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Execution Environment</h4>
                  <p>Your code runs in a secure, isolated environment with the following limitations:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Memory limit: 128MB</li>
                    <li>Execution time limit: 10 seconds</li>
                    <li>No network access</li>
                    <li>No file system access (except temporary files)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Information Panel */}
      {showInfoPanel && (
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
              {infoPanelContent === 'security' && 'Security Information'}
              {infoPanelContent === 'hints' && 'Hint System Information'}
              {infoPanelContent === 'scoring' && 'Scoring Guide'}
            </h3>
            <button 
              onClick={() => setShowInfoPanel(false)}
              className="p-1 hover:bg-[var(--color-hover-light)] rounded-full"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
          
          {infoPanelContent === 'security' && (
            <div className="text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">High Security Mode (Docker)</p>
                  <p>Your code runs in an isolated Docker container with strict resource limits and network isolation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Native Execution Mode</p>
                  <p>When Docker is unavailable, code runs in a more limited security environment with basic sandboxing.</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300">
                  Current execution mode: {executionMethod ? (executionMethod === 'docker' ? 'High Security (Docker)' : 'Native Execution') : 'Not yet executed'}
                </p>
              </div>
            </div>
          )}
          
          {infoPanelContent === 'hints' && (
            <div className="text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">AI-Powered Hints</p>
                  <p>Our AI analyzes your code and provides contextual hints to guide you toward the solution without giving away the answer.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Manual Hints</p>
                  <p>When AI is unavailable, we provide carefully crafted hints based on common problem-solving patterns.</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300">
                  <strong>Note:</strong> Using hints will apply a -30 point penalty to your score.
                </p>
              </div>
            </div>
          )}
          
          {infoPanelContent === 'scoring' && (
            <div className="text-sm text-[var(--color-text-secondary)]">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Base Score: 100 points</p>
                  <p>Every problem starts with a maximum possible score of 100 points.</p>
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Penalties:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Using a hint: -30 points</li>
                    <li>Each wrong submission: -5 points</li>
                    <li>Viewing the solution: Score reset to 0</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] mb-1">Final Score Calculation:</p>
                  <p>Base Score - Hint Penalty - (Wrong Attempts × 5)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Hint Display */}
      {showAiHint && aiHint && (
        <div className={`${hintType === 'ai' ? 'bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500' : 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500'} p-3 sm:p-4`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0 ${
                hintType === 'ai' 
                  ? 'bg-purple-100 dark:bg-purple-800' 
                  : 'bg-yellow-100 dark:bg-yellow-800'
              }`}>
                {hintType === 'ai' 
                  ? <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-300" />
                  : <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-300" />
                }
              </div>
              <div className="flex-1">
                <h3 className={`text-sm sm:text-base font-medium mb-2 flex items-center gap-2 ${
                  hintType === 'ai'
                    ? 'text-purple-800 dark:text-purple-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  <MessageCircle className="w-4 h-4" />
                  {hintType === 'ai' ? 'AI Hint' : 'Hint'}
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${
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
              className={`ml-3 p-1 rounded transition-colors ${
                hintType === 'ai'
                  ? 'hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-600 dark:text-yellow-300'
              }`}
              title="Close hint"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hint Error */}
      {hintError && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 p-3 sm:p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-3" />
            <p className="text-red-700 dark:text-red-200 font-medium text-sm sm:text-base">{hintError}</p>
          </div>
        </div>
      )}

      {compilerHealth?.docker === 'unavailable' && (
        <div className="bg-orange-100 dark:bg-orange-900 border-l-4 border-orange-500 p-3 sm:p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Docker Engine Not Running - Using Fallback Mode
              </h3>
              <div className="mt-2 text-xs sm:text-sm text-orange-700 dark:text-orange-300">
                <p>Code will run in native mode with reduced security. For maximum security:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Start Docker Desktop application</li>
                  <li>Wait for Docker engine to start</li>
                  <li>Click the refresh button above</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col">
          <div className="p-3 sm:p-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Code Editor</h3>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-3 sm:p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-xs sm:text-sm resize-none focus:outline-none"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        {showRightPanel && (
          <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-[var(--color-border)] flex flex-col">
            {/* Score Tracker */}
            {showScoreTracker && (
              <div className="border-b border-[var(--color-border)]">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Score Tracker</h3>
                  <button
                    onClick={() => setShowScoreTracker(!showScoreTracker)}
                    className="p-1 hover:bg-[var(--color-border)] rounded transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                  {isLoadingScore ? (
                    <div className="text-center text-[var(--color-text-secondary)] py-4">
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
            )}

            {!showScoreTracker && (
              <div className="border-b border-[var(--color-border)]">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Score: {scoreData.score}/100</h3>
                  <button
                    onClick={() => setShowScoreTracker(!showScoreTracker)}
                    className="p-1 hover:bg-[var(--color-border)] rounded transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Test Results Section */}
            {activeManualSection === 'sample' && testResults.length > 0 ? (
              <div className="flex-1 flex flex-col">
                <div className="p-3 sm:p-4 border-b border-[var(--color-border)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Test Results
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {testResults.filter(r => r.passed).length}/{testResults.length} tests passed
                  </p>
                </div>
                
                <div className="flex-1 p-3 sm:p-4 bg-[var(--color-bg-secondary)] overflow-y-auto">
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        result.passed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm font-medium">Test Case {index + 1}</span>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="font-medium">Input:</span>
                            <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-1 rounded">{result.input}</code>
                          </div>
                          <div>
                            <span className="font-medium">Expected:</span>
                            <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-1 rounded">{result.expected}</code>
                          </div>
                          <div>
                            <span className="font-medium">Actual:</span>
                            <code className="ml-2 bg-gray-100 dark:bg-gray-800 px-1 rounded">{result.actual}</code>
                          </div>
                          {result.error && (
                            <div>
                              <span className="font-medium text-red-500">Error:</span>
                              <code className="ml-2 bg-red-100 dark:bg-red-900 px-1 rounded text-red-700 dark:text-red-300">{result.error}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col">
                  <div className="p-3 sm:p-4 border-b border-[var(--color-border)]">
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Input</h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Enter test input for your program
                    </p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-3 sm:p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-xs sm:text-sm resize-none focus:outline-none min-h-[100px] lg:min-h-0"
                    placeholder="Enter input for your program..."
                  />
                </div>

                <div className="flex-1 flex flex-col border-t border-[var(--color-border)]">
                  <div className="p-3 sm:p-4 border-b border-[var(--color-border)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Output</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[var(--color-text-secondary)]">
                        {executionTime !== null && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="text-xs">{executionTime}ms</span>
                          </div>
                        )}
                        {memoryUsed !== null && (
                          <div className="flex items-center gap-1">
                            <MemoryStick className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="text-xs">{memoryUsed}KB</span>
                          </div>
                        )}
                        {getExecutionMethodBadge()}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-3 sm:p-4 bg-[var(--color-bg-secondary)] min-h-[100px] lg:min-h-0 overflow-y-auto">
                    {error ? (
                      <div className="text-red-500 font-mono text-xs sm:text-sm whitespace-pre-wrap">{error}</div>
                    ) : output ? (
                      <div className="text-[var(--color-text-primary)] font-mono text-xs sm:text-sm whitespace-pre-wrap">{output}</div>
                    ) : (
                      <div className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Run your code to see output here...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;