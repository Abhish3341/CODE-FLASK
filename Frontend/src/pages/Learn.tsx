import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Code2, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  FileText, 
  Lightbulb,
  Zap,
  Brain,
  Search,
  Eye,
  GitBranch,
  Repeat,
  GraduationCap,
  Terminal,
  Type,
  Calculator,
  List,
  RotateCcw,
  Hash,
  Award
} from 'lucide-react';
import LearningContent from '../components/LearningContent';

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  keyConcepts: string[];
  practiceProblems: Array<{
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    id?: string;
    technique?: string;
    languages?: string[];
  }>;
  takeaway: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  featured?: boolean;
  languages?: string[];
}

const Learn = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'practice'>('overview');
  const [learningMode, setLearningMode] = useState<{ active: boolean; courseId: number; courseTitle: string }>({
    active: false,
    courseId: 0,
    courseTitle: ''
  });

  const courses: Course[] = [
    {
      id: 1,
      title: 'Problem Solving Foundations',
      description: 'Your launchpad for building a structured approach to coding questions. Learn strategies, not just solutions — build a habit of thinking clearly before coding.',
      level: 'Beginner',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      featured: true,
      topics: [
        'Understanding Problem Statements',
        'Dry-running and Input Analysis',
        'Brute Force Before Optimization',
        'Pattern Recognition (Two Pointers, Sliding Window)',
        'How to Break Problems Down',
        'Reading Constraints Carefully',
        'Edge Cases and Test-Driven Thinking'
      ],
      keyConcepts: [
        'Start with examples: Simulate the input by hand',
        'Understand what\'s being asked before writing any code',
        'Know the difference between checking your approach and "jumping to code"',
        'Learn to write a brute-force solution — it\'s a valid first step',
        'From brute force, look for repeated work → then optimize'
      ],
      practiceProblems: [
        { title: 'Two Sum', difficulty: 'Easy' },
        { title: 'Valid Parentheses', difficulty: 'Easy' },
        { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy' },
        { title: 'Majority Element', difficulty: 'Easy' }
      ],
      takeaway: 'Always try solving a problem on paper first using real input values. Write out a few test cases by hand before you code. Coding should only start when your logic is sound on paper.'
    },
    {
      id: 2,
      title: 'Mastering Techniques',
      description: 'For learners who have solved basic problems and now want to go deeper. Focus on the "how" and "why" behind efficient coding — uncovering patterns used by top coders.',
      level: 'Intermediate',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      topics: [
        'Two Pointers (Left/Right Scan, Sorted Arrays)',
        'Sliding Window (Fixed + Variable Size)',
        'Prefix Sum & Difference Arrays',
        'Hashing for Frequency & Pairing',
        'Binary Search (on Answer, on Index)',
        'Recursion & Backtracking',
        'Greedy Techniques',
        'Dynamic Programming (Intro level: 1D + 2D)',
        'Stack-based Patterns (Monotonic Stack, Span Problems)'
      ],
      keyConcepts: [
        'Optimization often starts by avoiding repeated work (e.g., using prefix sums instead of recalculating sums)',
        'Many hard problems become easier when you classify them into patterns',
        'Technique-first thinking helps reduce brute force guesswork',
        'Code templates can often be reused across problems'
      ],
      practiceProblems: [
        { title: 'Container With Most Water', difficulty: 'Medium', technique: 'Two Pointers' },
        { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', technique: 'Sliding Window' },
        { title: 'Subarray Sum Equals K', difficulty: 'Medium', technique: 'Prefix Sum + HashMap' },
        { title: 'Word Search', difficulty: 'Medium', technique: 'Backtracking' },
        { title: 'Climbing Stairs', difficulty: 'Easy', technique: 'DP' }
      ],
      takeaway: 'Before jumping into code, ask: "Which category does this problem belong to?" Recognizing a technique early can save you time and unnecessary complexity.'
    },
    {
      id: 3,
      title: 'Programming 101',
      description: 'Designed for absolute beginners — especially students from non-computer science backgrounds — who want to start solving problems but lack the basic coding foundation.',
      level: 'Beginner',
      icon: GraduationCap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      languages: ['Python', 'C', 'Java'],
      topics: [
        'Writing Your First Program (Hello World)',
        'Variables and Data Types',
        'Taking Input from the User',
        'Conditionals (if, else)',
        'Loops (for, while)',
        'Functions',
        'Arrays / Lists',
        'Strings',
        'Operators',
        'Simple Problems to Practice'
      ],
      keyConcepts: [
        'Code is just a set of instructions for the computer — it doesn\'t have to be complex to be useful',
        'Different languages have different syntax, but the logic is usually the same',
        'Focus on small tasks: read input → process → print output',
        'Learn how to trace code by hand to predict what it will do',
        'You don\'t need to memorize syntax — just understand the flow and try writing it out'
      ],
      practiceProblems: [
        { title: 'Print Numbers from 1 to N', difficulty: 'Easy', languages: ['Python', 'C', 'Java'] },
        { title: 'Check if a Number is Even or Odd', difficulty: 'Easy', languages: ['Python', 'C', 'Java'] },
        { title: 'Reverse a String', difficulty: 'Easy', languages: ['Python', 'C', 'Java'] },
        { title: 'Find the Maximum of Two Numbers', difficulty: 'Easy', languages: ['Python', 'C', 'Java'] },
        { title: 'Sum of Elements in an Array', difficulty: 'Easy', languages: ['Python', 'C', 'Java'] }
      ],
      takeaway: 'You don\'t need to master everything before solving problems. Learn just enough to write simple logic, and grow from there. Solving problems is how you actually learn.'
    }
  ];

  const startLearning = (courseId: number, courseTitle: string) => {
    setLearningMode({
      active: true,
      courseId,
      courseTitle
    });
  };

  const exitLearning = () => {
    setLearningMode({
      active: false,
      courseId: 0,
      courseTitle: ''
    });
  };

  // If in learning mode, show the learning content
  if (learningMode.active) {
    return (
      <LearningContent
        courseId={learningMode.courseId}
        courseTitle={learningMode.courseTitle}
        onBack={exitLearning}
      />
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500 bg-green-500/10';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'Hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-500';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Advanced':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getTechniqueIcon = (technique: string) => {
    switch (technique?.toLowerCase()) {
      case 'two pointers':
        return <ArrowRight className="w-3 h-3" />;
      case 'sliding window':
        return <Search className="w-3 h-3" />;
      case 'prefix sum + hashmap':
        return <Hash className="w-3 h-3" />;
      case 'backtracking':
        return <GitBranch className="w-3 h-3" />;
      case 'dp':
        return <Repeat className="w-3 h-3" />;
      default:
        return <Code2 className="w-3 h-3" />;
    }
  };

  const getTopicIcon = (topic: string, courseId: number) => {
    if (courseId === 3) { // Programming 101 specific icons
      if (topic.includes('Hello World')) return <Terminal className="w-4 h-4" />;
      if (topic.includes('Input and Output')) return <Type className="w-4 h-4" />;
      if (topic.includes('Data Types')) return <FileText className="w-4 h-4" />;
      if (topic.includes('Conditional')) return <GitBranch className="w-4 h-4" />;
      if (topic.includes('Loops')) return <Repeat className="w-4 h-4" />;
      if (topic.includes('Functions')) return <Code2 className="w-4 h-4" />;
      if (topic.includes('Arrays')) return <List className="w-4 h-4" />;
      if (topic.includes('Strings')) return <Type className="w-4 h-4" />;
      if (topic.includes('Math')) return <Calculator className="w-4 h-4" />;
      if (topic.includes('Reverse')) return <RotateCcw className="w-4 h-4" />;
    }
    return <Code2 className="w-4 h-4" />;
  };

  const CourseModal = ({ course }: { course: Course }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-bg-secondary)] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${course.bgColor}`}>
                <course.icon className={`w-6 h-6 ${course.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{course.title}</h2>
                <p className="text-[var(--color-text-secondary)]">{course.description}</p>
                {course.languages && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">Languages:</span>
                    {course.languages.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-2xl"
            >
              ×
            </button>
          </div>

          {/* Course Level */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'topics', label: 'Topics', icon: FileText },
              { id: 'practice', label: 'Practice', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Concepts */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Key Concepts
                </h3>
                <div className="space-y-3">
                  {course.keyConcepts.map((concept, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[var(--color-bg-primary)] rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[var(--color-text-primary)]">{concept}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Takeaway */}
              <div className={`p-4 rounded-lg border ${
                course.id === 2 
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                  : course.id === 3
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${
                  course.id === 2 
                    ? 'text-purple-800 dark:text-purple-200'
                    : course.id === 3
                      ? 'text-emerald-800 dark:text-emerald-200'
                      : 'text-indigo-800 dark:text-indigo-200'
                }`}>
                  <Award className="w-5 h-5" />
                  Takeaway Technique
                </h3>
                <p className={
                  course.id === 2 
                    ? 'text-purple-700 dark:text-purple-300'
                    : course.id === 3
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-indigo-700 dark:text-indigo-300'
                }>
                  {course.takeaway}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Topics Covered {course.languages && <span className="text-sm text-[var(--color-text-secondary)]">(in all 3 languages)</span>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.topics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-[var(--color-bg-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      course.id === 2 
                        ? 'bg-purple-100 dark:bg-purple-900'
                        : course.id === 3
                          ? 'bg-emerald-100 dark:bg-emerald-900'
                          : 'bg-indigo-100 dark:bg-indigo-900'
                    }`}>
                      {course.id === 3 ? (
                        getTopicIcon(topic, course.id)
                      ) : (
                        <span className={`font-semibold text-sm ${
                          course.id === 2 
                            ? 'text-purple-600 dark:text-purple-300'
                            : 'text-indigo-600 dark:text-indigo-300'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span className="text-[var(--color-text-primary)] font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'practice' && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Practice Problems
              </h3>
              <div className="space-y-3">
                {course.practiceProblems.map((problem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[var(--color-bg-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {problem.technique ? getTechniqueIcon(problem.technique) : <Code2 className="w-4 h-4 text-[var(--color-text-secondary)]" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--color-text-primary)]">{problem.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          {problem.technique && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                              {problem.technique}
                            </span>
                          )}
                          {problem.languages && (
                            <div className="flex gap-1">
                              {problem.languages.map((lang) => (
                                <span key={lang} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/app/problems"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Solve
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)]">
          <button 
            onClick={() => {
              setSelectedCourse(null);
              startLearning(course.id, course.title);
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Play className="w-5 h-5" />
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );

  // Get featured course (Problem Solving Foundations)
  const featuredCourse = courses.find(course => course.featured) || courses[0];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text-primary)]">Learning Center</h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">Master coding concepts through structured courses and hands-on practice</p>
        </div>

        {/* Featured Course - Problem Solving Foundations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Featured Course</h2>
          <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <featuredCourse.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{featuredCourse.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Perfect for beginners</p>
                  </div>
                </div>
                
                <p className="text-[var(--color-text-secondary)] mb-4">
                  {featuredCourse.description}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getLevelColor(featuredCourse.level)}`}>
                    {featuredCourse.level}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {['Problem Analysis', 'Pattern Recognition', 'Brute Force', 'Optimization'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:w-80">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-[var(--color-text-primary)] mb-3">What you'll learn:</h4>
                  <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Understanding problem statements clearly
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Dry-running and input analysis techniques
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Pattern recognition (Two Pointers, Sliding Window)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Breaking down complex problems
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setSelectedCourse(featuredCourse)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Eye className="w-5 h-5" />
                View Details
              </button>
              <button 
                onClick={() => startLearning(featuredCourse.id, featuredCourse.title)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                Start Learning
              </button>
            </div>
          </div>
        </div>

        {/* All Courses - IMPROVED UI */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">All Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="relative overflow-hidden bg-[var(--color-bg-secondary)] rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] border border-[var(--color-border)]"
              >
                {/* Course Header with Gradient Background */}
                <div className={`p-6 ${
                  course.id === 1 
                    ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30'
                    : course.id === 2
                      ? 'bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:to-indigo-900/30'
                      : 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${course.bgColor} shadow-md`}>
                      <course.icon className={`w-6 h-6 ${course.color}`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)} shadow-sm`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">{course.title}</h3>
                  
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                    {course.description}
                  </p>
                </div>
                
                {/* Course Details */}
                <div className="p-6 border-t border-[var(--color-border)]">
                  {/* Language badges for Programming 101 */}
                  {course.languages && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-md text-xs font-medium shadow-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Topics Preview */}
                  <div className="mb-4">
                    <h4 className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">Topics include:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-[var(--color-bg-primary)] rounded-md text-[var(--color-text-secondary)]">
                          {topic.split(' ').slice(0, 2).join(' ')}...
                        </span>
                      ))}
                      {course.topics.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-[var(--color-bg-primary)] rounded-md text-[var(--color-text-secondary)]">
                          +{course.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors text-sm font-medium border border-[var(--color-border)]"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    <button 
                      onClick={() => startLearning(course.id, course.title)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg transition-colors text-sm font-medium ${
                        course.id === 1 
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : course.id === 2
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && <CourseModal course={selectedCourse} />}

      {/* Footer - Responsive */}
      <footer className="py-6 sm:py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
              <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
            </div>
            <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Learn;