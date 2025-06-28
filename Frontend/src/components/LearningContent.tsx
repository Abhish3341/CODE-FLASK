import React from 'react';
import LearningContentProblemSolving from './LearningContentProblemSolving';
import LearningContentMasteringTechniques from './LearningContentMasteringTechniques';
import LearningContentProgramming101 from './LearningContentProgramming101';

interface LearningContentProps {
  courseId: number;
  courseTitle: string;
  onBack: () => void;
}

const LearningContent: React.FC<LearningContentProps> = ({ courseId, courseTitle, onBack }) => {
  // Render the appropriate learning content based on courseId
  switch (courseId) {
    case 1:
      return <LearningContentProblemSolving courseId={courseId} courseTitle={courseTitle} onBack={onBack} />;
    case 2:
      return <LearningContentMasteringTechniques courseId={courseId} courseTitle={courseTitle} onBack={onBack} />;
    case 3:
      return <LearningContentProgramming101 courseId={courseId} courseTitle={courseTitle} onBack={onBack} />;
    default:
      return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center p-6">
          <div className="card p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Course Not Found
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              The course you're looking for doesn't exist or hasn't been created yet.
            </p>
            <button
              onClick={onBack}
              className="button button-primary w-full"
            >
              Back to Courses
            </button>
          </div>
        </div>
      );
  }
};

export default LearningContent;