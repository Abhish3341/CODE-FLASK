import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Settings, Clock, MemoryStick, AlertTriangle, CheckCircle } from 'lucide-react';
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
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [memoryUsed, setMemoryUsed] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [dockerStatus, setDockerStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [executionMethod, setExecutionMethod] = useState<'docker' | 'native' | null>(null);

  // Language templates
  const templates = {
    python: `def solution():
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
    javascript: `function solution() {
    // Write your solution here
    return null;
}

// Test your solution
console.log(solution());`,
    java: `public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        // Test your solution
        System.out.println(solution.solve());
    }
}

class Solution {
    public Object solve() {
        // Write your solution here
        return null;
    }
}`,
    cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    // Write your solution here
    void solve() {
        
    }
};

int main() {
    Solution solution;
    solution.solve();
    return 0;
}`
  };

  useEffect(() => {
    setCode(templates[language as keyof typeof templates]);
    checkDockerStatus();
  }, [language]);

  const checkDockerStatus = async () => {
    try {
      const response = await axiosInstance.get('/api/compiler/health');
      setDockerStatus(response.data.docker === 'available' ? 'available' : 'unavailable');
    } catch (error) {
      setDockerStatus('unavailable');
    }
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
      const response = await axiosInstance.post('/api/compiler/execute', {
        code,
        language,
        input
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

    // First run the code to get output
    await runCode();

    // Then submit the result
    onSubmit({
      code,
      language,
      output: output || '',
      executionTime: executionTime || undefined,
      memoryUsed: memoryUsed || undefined,
      error: error || undefined
    });
  };

  const resetCode = () => {
    setCode(templates[language as keyof typeof templates]);
    setOutput('');
    setError('');
    setExecutionTime(null);
    setMemoryUsed(null);
    setExecutionMethod(null);
  };

  const getDockerStatusIcon = () => {
    switch (dockerStatus) {
      case 'checking':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'unavailable':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getDockerStatusText = () => {
    switch (dockerStatus) {
      case 'checking':
        return 'Checking Docker...';
      case 'available':
        return 'Docker Available (Secure)';
      case 'unavailable':
        return 'Docker Unavailable (Fallback Mode)';
    }
  };

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
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Docker Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] rounded-lg">
            {getDockerStatusIcon()}
            <span className="text-sm text-[var(--color-text-secondary)]">
              {getDockerStatusText()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          
          <button
            onClick={submitCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Docker Warning */}
      {dockerStatus === 'unavailable' && (
        <div className="bg-orange-100 dark:bg-orange-900 border-l-4 border-orange-500 p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Docker Engine Not Running
              </h3>
              <div className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                <p>Code will run in fallback mode (less secure). To enable secure execution:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Start Docker Desktop application</li>
                  <li>Wait for Docker engine to start</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Code</h3>
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
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-sm resize-none focus:outline-none"
              placeholder="Enter input for your program..."
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
                  {executionMethod && (
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        executionMethod === 'docker' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-orange-500/20 text-orange-500'
                      }`}>
                        {executionMethod === 'docker' ? 'Secure' : 'Fallback'}
                      </span>
                    </div>
                  )}
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