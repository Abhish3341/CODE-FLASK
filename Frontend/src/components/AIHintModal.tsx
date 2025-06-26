import React from 'react';
import { X, Sparkles, MessageCircle, Lightbulb, AlertTriangle } from 'lucide-react';

interface AIHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string;
  isLoading: boolean;
  error: string;
  onRequestHint: () => void;
  problemTitle?: string;
  language?: string;
  hintType?: 'ai' | 'manual' | null;
}

const AIHintModal: React.FC<AIHintModalProps> = ({
  isOpen,
  onClose,
  hint,
  isLoading,
  error,
  onRequestHint,
  problemTitle,
  language,
  hintType = 'ai'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-bg-secondary)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              hintType === 'ai' 
                ? 'bg-purple-100 dark:bg-purple-900' 
                : 'bg-yellow-100 dark:bg-yellow-900'
            }`}>
              {hintType === 'ai' 
                ? <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                : <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
              }
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {hintType === 'ai' ? 'AI Hint Assistant' : 'Hint Assistant'}
              </h2>
              {problemTitle && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  For: {problemTitle} ({language?.toUpperCase()})
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
                  hintType === 'ai' ? 'border-purple-500' : 'border-yellow-500'
                }`}></div>
                <span className="text-[var(--color-text-secondary)]">
                  {hintType === 'ai' 
                    ? 'AI is analyzing your code and generating a helpful hint...'
                    : 'Generating a helpful hint...'}
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
                    Unable to Generate Hint
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hint Display */}
          {hint && !isLoading && (
            <div className={`${
              hintType === 'ai'
                ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            } rounded-lg p-6`}>
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                  hintType === 'ai'
                    ? 'bg-purple-100 dark:bg-purple-800'
                    : 'bg-yellow-100 dark:bg-yellow-800'
                }`}>
                  {hintType === 'ai'
                    ? <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                    : <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
                  }
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium mb-3 flex items-center gap-2 ${
                    hintType === 'ai'
                      ? 'text-purple-800 dark:text-purple-200'
                      : 'text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {hintType === 'ai' ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        AI Suggestion
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4" />
                        Hint
                      </>
                    )}
                  </h3>
                  <p className={`leading-relaxed ${
                    hintType === 'ai'
                      ? 'text-purple-700 dark:text-purple-300'
                      : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {hint}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No Hint State */}
          {!hint && !isLoading && !error && (
            <div className="text-center py-12">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
                hintType === 'ai'
                  ? 'bg-purple-100 dark:bg-purple-900'
                  : 'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                {hintType === 'ai'
                  ? <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                  : <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-300" />
                }
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                {hintType === 'ai' ? 'Get AI-Powered Assistance' : 'Get a Helpful Hint'}
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
                {hintType === 'ai'
                  ? 'Our AI assistant will analyze your code and provide helpful hints to guide you toward the solution without giving away the answer.'
                  : 'Get a helpful hint that will guide you toward the solution without giving away the complete answer.'
                }
              </p>
              <button
                onClick={onRequestHint}
                className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors mx-auto ${
                  hintType === 'ai'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {hintType === 'ai'
                  ? <Sparkles className="w-4 h-4" />
                  : <Lightbulb className="w-4 h-4" />
                }
                Request {hintType === 'ai' ? 'AI ' : ''}Hint
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Important Notes:
            </h4>
            <ul className="text-xs text-[var(--color-text-secondary)] space-y-1 ml-4">
              <li>• Hints are designed to guide your thinking, not provide complete solutions</li>
              <li>• Using hints will apply a -30 point penalty to your score</li>
              {hintType === 'ai' && (
                <li>• The AI analyzes your current code to provide contextual suggestions</li>
              )}
              <li>• This feature is intended for learning and should not replace independent problem-solving</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-secondary)]">
            {hintType === 'ai' ? 'Powered by OpenAI GPT-3.5 Turbo' : 'CodeFlask Hint System'}
          </div>
          <div className="flex gap-3">
            {hint && (
              <button
                onClick={onRequestHint}
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 text-sm ${
                  hintType === 'ai'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                Get Another Hint
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--color-bg-primary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHintModal;