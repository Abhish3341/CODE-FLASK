import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, GraduationCap, Terminal, Code, ChevronRight, ChevronLeft, Type, GitBranch, Repeat, List, RotateCcw, Calculator } from 'lucide-react';

interface LearningContentProps {
  courseId: number;
  courseTitle: string;
  onBack: () => void;
}

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
  completed: boolean;
}

const LearningContentProgramming101: React.FC<LearningContentProps> = ({ courseId, courseTitle, onBack }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const courseContent = getProgramming101Content();
    setSections(courseContent);
    updateProgress(courseContent);
  }, []);

  const updateProgress = (sectionList: Section[]) => {
    const completedCount = sectionList.filter(s => s.completed).length;
    const progressPercentage = (completedCount / sectionList.length) * 100;
    setProgress(progressPercentage);
  };

  const markSectionComplete = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].completed = true;
    setSections(updatedSections);
    updateProgress(updatedSections);
  };

  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      markSectionComplete(currentSectionIndex);
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else if (currentSectionIndex === sections.length - 1) {
      markSectionComplete(currentSectionIndex);
      onBack();
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const goToSection = (index: number) => {
    setCurrentSectionIndex(index);
  };

  const getProgramming101Content = (): Section[] => [
    // ... all section content ...
  ];

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* ... rest of the component JSX ... */}
    </div>
  );
};

export default LearningContentProgramming101;