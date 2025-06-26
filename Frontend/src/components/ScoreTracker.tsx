import React from 'react';
import { CheckCircle, XCircle, Lightbulb, Eye, Target } from 'lucide-react';

interface ScoreTrackerProps {
  score: number;
  clickedHint: boolean;
  clickedSolution: boolean;
  wrongAttempts: number;
  passed: boolean;
  compact?: boolean;
}

const ScoreTracker: React.FC<ScoreTrackerProps> = ({
  score,
  clickedHint,
  clickedSolution,
  wrongAttempts,
  passed,
  compact = false
}) => {
  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-gray-500';
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] rounded-lg">
        <span className={`font-bold ${getScoreColor(score)}`}>
          {score}/100
        </span>
        <div className="flex items-center gap-1">
          {passed && <CheckCircle className="w-4 h-4 text-green-500" />}
          {clickedHint && <Lightbulb className="w-4 h-4 text-yellow-500" />}
          {clickedSolution && <Eye className="w-4 h-4 text-gray-500" />}
          {wrongAttempts > 0 && (
            <div className="flex items-center gap-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-500">{wrongAttempts}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[var(--color-text-primary)]">Score Tracker</h3>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}/100
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {passed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Target className="w-5 h-5 text-gray-400" />
          )}
          <span className={`text-sm ${passed ? 'text-green-600 dark:text-green-400' : 'text-[var(--color-text-secondary)]'}`}>
            {passed ? 'Problem Solved' : 'Not Solved Yet'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Lightbulb className={`w-5 h-5 ${clickedHint ? 'text-yellow-500' : 'text-gray-400'}`} />
          <span className={`text-sm ${clickedHint ? 'text-yellow-600 dark:text-yellow-400' : 'text-[var(--color-text-secondary)]'}`}>
            Hint {clickedHint ? 'Used (-30 points)' : 'Available'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Eye className={`w-5 h-5 ${clickedSolution ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`text-sm ${clickedSolution ? 'text-gray-600 dark:text-gray-400' : 'text-[var(--color-text-secondary)]'}`}>
            Solution {clickedSolution ? 'Viewed (Score = 0)' : 'Hidden'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <XCircle className={`w-5 h-5 ${wrongAttempts > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          <span className={`text-sm ${wrongAttempts > 0 ? 'text-red-600 dark:text-red-400' : 'text-[var(--color-text-secondary)]'}`}>
            Wrong Attempts: {wrongAttempts} {wrongAttempts > 0 ? `(-${wrongAttempts * 5} points)` : ''}
          </span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
        <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
          <div className="flex justify-between">
            <span>Base Score:</span>
            <span>100</span>
          </div>
          {clickedHint && (
            <div className="flex justify-between text-yellow-600 dark:text-yellow-400">
              <span>Hint Penalty:</span>
              <span>-30</span>
            </div>
          )}
          {wrongAttempts > 0 && (
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>Wrong Attempts:</span>
              <span>-{wrongAttempts * 5}</span>
            </div>
          )}
          {clickedSolution && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Solution Viewed:</span>
              <span>Score Reset</span>
            </div>
          )}
          <div className={`flex justify-between font-semibold pt-1 border-t border-[var(--color-border)] ${getScoreColor(score)}`}>
            <span>Final Score:</span>
            <span>{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreTracker;