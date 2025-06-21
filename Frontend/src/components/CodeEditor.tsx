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
  const [showInputHint, setShowInputHint] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Load template when language changes
  useEffect(() => {
    loadTemplate();
    checkCompilerHealth();
  }, [language, problemId]);

  // Set default input for linked list problems
  useEffect(() => {
    if (problemId && (problemId.includes('merge') || code.includes('ListNode'))) {
      setInput('[1,2,4]\n[1,3,4]');
    }
  }, [problemId, code]);

  const loadTemplate = async () => {
    setIsLoadingTemplate(true);
    try {
      const response = await axiosInstance.get(`/api/problems/${problemId}/template/${language}`);
      setCode(response.data.template);
    } catch (error) {
      console.error('Failed to load template:', error);
      // Fallback to basic template
      setCode(getBasicTemplate(language));
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  const getBasicTemplate = (lang: string) => {
    const templates = {
      python: `def solution():
    """
    Write your solution here
    """
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`,

      javascript: `function solution() {
    /**
     * Write your solution here
     */
    // Your code here
    return null;
}

// Test your solution
console.log("Result:", solution());`,

      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println("Result: " + solution.solve());
    }
}

class Solution {
    /**
     * Write your solution here
     */
    public Object solve() {
        // Your code here
        return null;
    }
}`,

      cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    /**
     * Write your solution here
     */
    auto solve() {
        // Your code here
        return 0;
    }
};

int main() {
    Solution solution;
    cout << "Result: " << solution.solve() << endl;
    return 0;
}`
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
        supportedLanguages: ['python', 'javascript', 'java', 'cpp']
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

      // First run the code to get output if not already run
      if (!output && !error) {
        await runCode();
      }

      // Submit the solution
      const submitResponse = await axiosInstance.post('/api/submissions', {
        problemId,
        code,
        language,
        output: output || '',
        executionTime: executionTime || undefined,
        memoryUsed: memoryUsed || undefined,
        timeSpent: 5 // Default 5 minutes - could be tracked more accurately
      });

      if (submitResponse.data.id) {
        setSubmitSuccess(true);
        setSubmitMessage(submitResponse.data.message || 'Solution submitted successfully! 🎉');
        
        // Call the parent onSubmit callback
        onSubmit({
          code,
          language,
          output: output || '',
          executionTime: executionTime || undefined,
          memoryUsed: memoryUsed || undefined,
          error: error || undefined
        });

        // Auto-hide success message after 3 seconds
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
    if (!compilerHealth) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    
    switch (compilerHealth.security) {
      case 'high':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
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
        {executionMethod === 'docker' ? <Shield className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
        {executionMethod === 'docker' ? 'Secure' : 'Native'}
      </div>
    );
  };

  const isLinkedListProblem = problemId?.includes('merge') || code.includes('ListNode');

  if (isLoadingTemplate) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-[var(--color-text-secondary)]">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="python">Python 3.9</option>
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="java">Java 17</option>
            <option value="cpp">C++ (GCC)</option>
          </select>
          
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Security Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] rounded-lg">
            {getSecurityIcon()}
            <span className="text-sm text-[var(--color-text-secondary)]">
              {getSecurityText()}
            </span>
            <button
              onClick={refreshCompilerStatus}
              disabled={isCheckingHealth}
              className="ml-2 p-1 hover:bg-[var(--color-border)] rounded transition-colors"
              title="Refresh Status"
            >
              <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          
          <button
            onClick={submitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700 dark:text-green-200 font-medium">{submitMessage}</p>
          </div>
        </div>
      )}

      {/* Security Warning */}
      {compilerHealth?.docker === 'unavailable' && (
        <div className="bg-orange-100 dark:bg-orange-900 border-l-4 border-orange-500 p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Docker Engine Not Running - Using Fallback Mode
              </h3>
              <div className="mt-2 text-sm text-orange-700 dark:text-orange-300">
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

      {/* Collapsible Input Helper for Linked List Problems */}
      {isLinkedListProblem && (
        <div className="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500">
          <button
            onClick={() => setShowInputHint(!showInputHint)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                💡 Input Format for Linked Lists
              </h3>
            </div>
            {showInputHint ? 
              <ChevronUp className="w-4 h-4 text-blue-500" /> : 
              <ChevronDown className="w-4 h-4 text-blue-500" />
            }
          </button>
          
          {showInputHint && (
            <div className="px-4 pb-4">
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p>For linked list problems, provide input in the format:</p>
                <div className="bg-blue-200 dark:bg-blue-800 p-2 rounded text-xs font-mono mt-2">
                  [1,2,4]<br/>
                  [1,3,4]
                </div>
                <p className="mt-2">Each line represents one linked list. The code will automatically parse this format.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Code Editor</h3>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-sm resize-none focus:outline-none"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        {/* Input/Output Panel */}
        <div className="w-1/3 border-l border-[var(--color-border)] flex flex-col">
          {/* Input Section */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Input</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Enter test input for your program
              </p>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-sm resize-none focus:outline-none"
              placeholder={isLinkedListProblem ? 
                "For linked lists:\n[1,2,4]\n[1,3,4]" : 
                "Enter input for your program..."
              }
            />
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col border-t border-[var(--color-border)]">
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">Output</h3>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  {executionTime !== null && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {executionTime}ms
                    </div>
                  )}
                  {memoryUsed !== null && (
                    <div className="flex items-center gap-1">
                      <MemoryStick className="w-3 h-3" />
                      {memoryUsed}KB
                    </div>
                  )}
                  {getExecutionMethodBadge()}
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 bg-[var(--color-bg-secondary)]">
              {error ? (
                <div className="text-red-500 font-mono text-sm whitespace-pre-wrap">{error}</div>
              ) : output ? (
                <div className="text-[var(--color-text-primary)] font-mono text-sm whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="text-[var(--color-text-secondary)] text-sm">Run your code to see output here...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;