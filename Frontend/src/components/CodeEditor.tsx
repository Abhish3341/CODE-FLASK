import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Code2, Maximize2, Minimize2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { compileCode, getDefaultCode, getSupportedLanguages } from '../services/compilerService';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onSubmit?: (result: { output: string; error?: string }) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language: initialLanguage = 'cpp',
  onSubmit
}) => {
  const [code, setCode] = useState(initialCode || getDefaultCode(initialLanguage));
  const [language, setLanguage] = useState(initialLanguage);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setError('Please enter some code');
      return;
    }

    setIsCompiling(true);
    setError(null);
    setOutput('');

    try {
      const result = await compileCode({
        code,
        language,
        input: input.trim()
      });

      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.output);
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred while compiling the code');
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleInputExpansion = () => {
    setIsInputExpanded(!isInputExpanded);
  };

  const toggleOutputExpansion = () => {
    setIsOutputExpanded(!isOutputExpanded);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-border)]"
          >
            {getSupportedLanguages().map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCode(getDefaultCode(language))}
            className="px-3 py-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            title="Reset to default code"
          >
            <Code2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleRun}
            disabled={isCompiling}
            className="button button-primary flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isCompiling ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Editor and Output with Resizable Panels */}
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
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
              </Panel>
              <PanelResizeHandle className="h-2 bg-[var(--color-border)] hover:bg-indigo-500 transition-colors cursor-row-resize" />
              <Panel 
                defaultSize={30} 
                minSize={20}
                style={{ height: isInputExpanded ? '70%' : '30%' }}
              >
                <div className="h-full p-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Input</h3>
                    <button
                      onClick={toggleInputExpansion}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      {isInputExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your input here..."
                    className="w-full h-[calc(100%-2rem)] p-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg resize-vertical font-mono text-sm"
                  />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="w-2 bg-[var(--color-border)] hover:bg-indigo-500 transition-colors cursor-col-resize" />
          <Panel 
            defaultSize={50} 
            minSize={30}
            style={{ width: isOutputExpanded ? '70%' : '50%' }}
          >
            <div className="h-full p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Output</h3>
                <button
                  onClick={toggleOutputExpansion}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {isOutputExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="h-[calc(100%-2rem)] p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg font-mono text-sm overflow-auto resize-y">
                {error ? (
                  <pre className="text-red-500">{error}</pre>
                ) : output ? (
                  <pre className="text-[var(--color-text-primary)]">{output}</pre>
                ) : (
                  <div className="text-[var(--color-text-secondary)]">Run your code to see the output here</div>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CodeEditor;