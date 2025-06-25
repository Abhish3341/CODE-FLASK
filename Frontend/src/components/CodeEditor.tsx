import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Settings, Clock, MemoryStick, AlertTriangle, CheckCircle, Shield, Zap, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

interface CodeEditorProps {
  problemId: string;
  onSubmit: (result: {
    code: string;
    language: string;
    output: string;
    executionTime?: number;
    memoryUsed?: number;
    error?: string;
  }) => void;
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

  useEffect(() => {
    loadTemplate();
    checkCompilerHealth();
  }, [language, problemId]);

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

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please write some code before running');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('');
    setExecutionTime(null);
    setMemoryUsed(null);
    setExecutionMethod(null);

    try {
      console.log('🏃 Running code (test only - no submission tracking)');
      
      const response = await axiosInstance.post('/api/compiler/execute', {
        code,
        language,
        input: input.trim()
      });

      if (response.data.success) {
        setOutput(response.data.output);
        setExecutionTime(response.data.executionTime);
        setMemoryUsed(response.data.memoryUsed);
        setExecutionMethod(response.data.executionMethod);
      } else {
        setError(response.data.error || 'Code execution failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to execute code');
    } finally {
      setIsRunning(false);
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

      if (!output && !error) {
        await runCode();
      }

      const submitResponse = await axiosInstance.post('/api/submissions', {
        problemId,
        code,
        language,
        output: output || '',
        executionTime: executionTime || undefined,
        memoryUsed: memoryUsed || undefined,
        timeSpent: 5
      });

      if (submitResponse.data.id) {
        setSubmitSuccess(true);
        setSubmitMessage(submitResponse.data.message || 'Solution submitted successfully! 🎉');
        
        onSubmit({
          code,
          language,
          output: output || '',
          executionTime: executionTime || undefined,
          memoryUsed: memoryUsed || undefined,
          error: error || undefined
        });

        setTimeout(() => {
          setSubmitSuccess(false);
          setSubmitMessage('');
        }, 3000);
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
  };

  const getSecurityIcon = () => {
    if (!compilerHealth) return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
    
    switch (compilerHealth.security) {
      case 'high':
        return <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
    }
  };

  const getSecurityText = () => {
    if (!compilerHealth) return 'Checking security...';
    
    switch (compilerHealth.security) {
      case 'high':
        return 'High Security (Docker Isolated)';
      case 'medium':
        return 'Medium Security (Native Execution)';
      default:
        return 'Low Security';
    }
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

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
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

          <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-[var(--color-bg-secondary)] rounded-lg">
            {getSecurityIcon()}
            <span className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              <span className="hidden sm:inline">{getSecurityText()}</span>
              <span className="sm:hidden">Security</span>
            </span>
            <button
              onClick={refreshCompilerStatus}
              disabled={isCheckingHealth}
              className="ml-1 sm:ml-2 p-1 hover:bg-[var(--color-border)] rounded transition-colors"
              title="Refresh Status"
            >
              <RefreshCw className={`w-2 h-2 sm:w-3 sm:h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
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

        <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-[var(--color-border)] flex flex-col">
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
            <div className="flex-1 p-3 sm:p-4 bg-[var(--color-bg-secondary)] min-h-[100px] lg:min-h-0">
              {error ? (
                <div className="text-red-500 font-mono text-xs sm:text-sm whitespace-pre-wrap">{error}</div>
              ) : output ? (
                <div className="text-[var(--color-text-primary)] font-mono text-xs sm:text-sm whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="text-[var(--color-text-secondary)] text-xs sm:text-sm">Run your code to see output here...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;