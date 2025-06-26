import React from 'react';
import { Trophy, Target, Lightbulb, Eye, Clock, Award } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  clickedHint?: boolean;
  clickedSolution?: boolean;
  wrongAttempts?: number;
  passed?: boolean;
  timeSpent?: number;
  language?: string;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore = 100,
  clickedHint = false,
  clickedSolution = false,
  wrongAttempts = 0,
  passed = false,
  timeSpent,
  language,
  showDetails = true,
  size = 'medium'
}) => {
  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-gray-500';
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score: number) => {
    if (score === 0) return 'bg-gray-500/10';
    if (score >= 90) return 'bg-green-500/10';
    if (score >= 70) return 'bg-blue-500/10';
    if (score >= 50) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  const sizeClasses = {
    small: {
      container: 'p-3',
      score: 'text-lg',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    medium: {
      container: 'p-4',
      score: 'text-2xl',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    large: {
      container: 'p-6',
      score: 'text-3xl',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`${getScoreBackground(score)} rounded-lg ${classes.container} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className={`${classes.icon} ${getScoreColor(score)}`} />
          <span className={`font-semibold ${classes.text} text-[var(--color-text-primary)]`}>
            Score
          </span>
        </div>
        {passed && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
            <Award className="w-3 h-3" />
            <span className="text-xs font-medium">Solved</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className={`${classes.score} font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className={`${classes.text} text-[var(--color-text-secondary)]`}>
          / {maxScore}
        </span>
      </div>

      {showDetails && (
        <div className="space-y-2">
          {/* Score breakdown */}
          <div className="flex items-center justify-between">
            <span className={`${classes.text} text-[var(--color-text-secondary)]`}>
              Base Score
            </span>
            <span className={`${classes.text} font-medium text-[var(--color-text-primary)]`}>
              100
            </span>
          </div>

          {clickedHint && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-yellow-500" />
                <span className={`${classes.text} text-yellow-600 dark:text-yellow-400`}>
                  Hint Used
                </span>
              </div>
              <span className={`${classes.text} font-medium text-red-500`}>
                -30
              </span>
            </div>
          )}

          {wrongAttempts > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-red-500" />
                <span className={`${classes.text} text-red-600 dark:text-red-400`}>
                  Wrong Attempts ({wrongAttempts})
                </span>
              </div>
              <span className={`${classes.text} font-medium text-red-500`}>
                -{wrongAttempts * 5}
              </span>
            </div>
          )}

          {clickedSolution && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-gray-500" />
                <span className={`${classes.text} text-gray-600 dark:text-gray-400`}>
                  Solution Viewed
                </span>
              </div>
              <span className={`${classes.text} font-medium text-red-500`}>
                -100
              </span>
            </div>
          )}

          {/* Additional info */}
          <div className="pt-2 border-t border-[var(--color-border)] space-y-1">
            {timeSpent && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[var(--color-text-secondary)]" />
                <span className={`${classes.text} text-[var(--color-text-secondary)]`}>
                  {timeSpent} minutes
                </span>
              </div>
            )}
            {language && (
              <div className="flex items-center gap-1">
                <span className={`${classes.text} text-[var(--color-text-secondary)]`}>
                  Language: {language.charAt(0).toUpperCase() + language.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;