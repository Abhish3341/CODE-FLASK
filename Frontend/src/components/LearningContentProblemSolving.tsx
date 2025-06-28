import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, BookOpen, Code, Brain, Clock, TrendingUp, Target, Lightbulb, Play, ChevronRight, ChevronLeft } from 'lucide-react';

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

const LearningContentProblemSolving: React.FC<LearningContentProps> = ({ courseId, courseTitle, onBack }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const courseContent = getProblemSolvingContent();
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

  const getProblemSolvingContent = (): Section[] => [
    {
      id: 'overview',
      title: 'Course Overview',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">Problem Solving Foundations</h2>
                <p className="text-blue-600 dark:text-blue-400">Level: Beginner | Time: 60–90 mins</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-blue-800/30 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Target Audience</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Beginners stuck at the "how to start" stage or those struggling to build confidence in approaching problems.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">This section is for you if:</h3>
              <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You stare at a problem for 10+ minutes and feel lost
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You often write code before you're clear about the logic
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You want to improve your "approach" before your syntax
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'understanding-problems',
      title: 'Understanding Problem Statements',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">Step 1: Read Like a Detective</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🔍 What to Look For:</h3>
                <ul className="space-y-2 text-indigo-700 dark:text-indigo-300 text-sm">
                  <li>• <strong>Input format:</strong> What type of data are you getting?</li>
                  <li>• <strong>Output format:</strong> What exactly should you return?</li>
                  <li>• <strong>Constraints:</strong> How big can the input be?</li>
                  <li>• <strong>Edge cases:</strong> What happens with empty input, single elements?</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tip:</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Before writing any code, rewrite the problem in your own words. If you can't explain it simply, you don't understand it yet.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Practice Exercise:</h3>
                <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                  Read this problem: "Given an array of integers, return the two numbers that add up to a specific target."
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Now explain: What are you given? What should you return? What if no solution exists?
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dry-running',
      title: 'Dry-Running and Input Analysis',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">Step 2: Trace Through Examples by Hand</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-purple-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🎯 The Dry-Run Process:</h3>
                <ol className="space-y-2 text-purple-700 dark:text-purple-300 text-sm list-decimal list-inside">
                  <li>Take the given example input</li>
                  <li>Manually work through the problem step by step</li>
                  <li>Write down your thought process</li>
                  <li>Verify you get the expected output</li>
                  <li>Try with a different example</li>
                </ol>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 Example: Two Sum Problem</h3>
                <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                  <p><strong>Input:</strong> [2, 7, 11, 15], target = 9</p>
                  <p><strong>Manual process:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Check 2 + 7 = 9 ✓ (Found it!)</li>
                    <li>• Return indices [0, 1]</li>
                  </ul>
                  <p><strong>Pattern discovered:</strong> Need to check all pairs until we find the target sum</p>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">⚡ Why This Works:</h3>
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  When you solve by hand first, you naturally discover the algorithm. Your brain finds the pattern before your fingers touch the keyboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'brute-force',
      title: 'Brute Force Before Optimization',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">Step 3: Start Simple, Optimize Later</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-red-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">🎯 The Brute Force Mindset:</h3>
                <ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
                  <li>• <strong>Goal:</strong> Get a working solution first</li>
                  <li>• <strong>Don't worry about:</strong> Time complexity, elegance, efficiency</li>
                  <li>• <strong>Do worry about:</strong> Correctness, handling edge cases</li>
                  <li>• <strong>Remember:</strong> A working O(n²) solution beats a broken O(n) solution</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Brute Force Template:</h3>
                <pre className="text-green-700 dark:text-green-300 text-sm bg-white dark:bg-green-800/20 p-3 rounded">
{`// Two Sum - Brute Force
for (int i = 0; i < nums.length; i++) {
    for (int j = i + 1; j < nums.length; j++) {
        if (nums[i] + nums[j] == target) {
            return [i, j];
        }
    }
}
return []; // No solution found`}
                </pre>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🚀 From Brute Force to Optimization:</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                  Once you have a working solution, ask:
                </p>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm ml-4">
                  <li>• What work am I repeating?</li>
                  <li>• Can I store previous results?</li>
                  <li>• Is there a pattern I can exploit?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pattern-recognition',
      title: 'Pattern Recognition',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-4">Step 4: Recognize Common Patterns</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-teal-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🔍 Two Pointers Pattern:</h3>
                <div className="text-teal-700 dark:text-teal-300 text-sm space-y-2">
                  <p><strong>When to use:</strong> Array is sorted, looking for pairs, comparing from both ends</p>
                  <p><strong>Example problems:</strong> Two Sum (sorted), Container With Most Water</p>
                  <pre className="bg-teal-100 dark:bg-teal-800/50 p-2 rounded text-xs">
{`let left = 0, right = array.length - 1;
while (left < right) {
    // Check condition
    // Move pointers based on logic
}`}
                  </pre>
                </div>
              </div>

              <div className="bg-white dark:bg-teal-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🪟 Sliding Window Pattern:</h3>
                <div className="text-teal-700 dark:text-teal-300 text-sm space-y-2">
                  <p><strong>When to use:</strong> Substring/subarray problems, moving range calculations</p>
                  <p><strong>Example problems:</strong> Longest Substring Without Repeating Characters</p>
                  <pre className="bg-teal-100 dark:bg-teal-800/50 p-2 rounded text-xs">
{`let start = 0;
for (let end = 0; end < array.length; end++) {
    // Expand window
    while (/* condition violated */) {
        // Shrink window from start
        start++;
    }
    // Update result
}`}
                  </pre>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pattern Recognition Tips:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• Sorted array → Think binary search or two pointers</li>
                  <li>• Substring/subarray → Think sliding window</li>
                  <li>• Counting/frequency → Think hash map</li>
                  <li>• Tree problems → Think recursion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'breaking-down',
      title: 'Breaking Down Complex Problems',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-pink-800 dark:text-pink-200 mb-4">Step 5: Divide and Conquer Your Approach</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-pink-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">🧩 The Decomposition Process:</h3>
                <ol className="space-y-2 text-pink-700 dark:text-pink-300 text-sm list-decimal list-inside">
                  <li><strong>Identify the core task:</strong> What is the main thing you need to do?</li>
                  <li><strong>Break into subtasks:</strong> What smaller problems make up the big one?</li>
                  <li><strong>Solve each subtask:</strong> Handle one piece at a time</li>
                  <li><strong>Combine solutions:</strong> Put the pieces together</li>
                </ol>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 Example: Valid Parentheses</h3>
                <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                  <p><strong>Big problem:</strong> Check if parentheses are balanced</p>
                  <p><strong>Subtasks:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>1. Track opening brackets</li>
                    <li>2. Match closing brackets with most recent opening</li>
                    <li>3. Ensure all brackets are matched at the end</li>
                  </ul>
                  <p><strong>Solution approach:</strong> Use a stack data structure</p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Questions to Ask Yourself:</h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• What's the simplest version of this problem?</li>
                  <li>• Can I solve it for just one element first?</li>
                  <li>• What would I do if I had unlimited time and paper?</li>
                  <li>• What helper functions might I need?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'constraints-edge-cases',
      title: 'Reading Constraints and Edge Cases',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-4">Step 6: Master the Fine Print</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-orange-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">📏 Why Constraints Matter:</h3>
                <ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
                  <li>• <strong>Time complexity hints:</strong> n ≤ 100 → O(n²) is fine, n ≤ 10⁶ → need O(n) or O(n log n)</li>
                  <li>• <strong>Space limitations:</strong> Can you use extra memory or must you solve in-place?</li>
                  <li>• <strong>Input ranges:</strong> Are numbers positive? Can they be zero? Negative?</li>
                  <li>• <strong>Edge case discovery:</strong> What happens at the boundaries?</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">🚨 Common Edge Cases to Check:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-red-700 dark:text-red-300 text-sm">
                  <div>
                    <p><strong>Arrays/Lists:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Empty array</li>
                      <li>• Single element</li>
                      <li>• All elements same</li>
                      <li>• Already sorted</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Strings:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Empty string</li>
                      <li>• Single character</li>
                      <li>• All same character</li>
                      <li>• Special characters</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Edge Case Testing Strategy:</h3>
                <ol className="space-y-1 text-green-700 dark:text-green-300 text-sm list-decimal list-inside">
                  <li>Write your solution for the normal case</li>
                  <li>List all possible edge cases</li>
                  <li>Test each edge case manually</li>
                  <li>Add special handling if needed</li>
                  <li>Verify your solution handles all cases</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'test-driven-thinking',
      title: 'Test-Driven Thinking',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">Step 7: Think Like a Tester</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🧪 The Testing Mindset:</h3>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                  Before writing code, create test cases. This forces you to understand the problem completely and catches issues early.
                </p>
                <div className="bg-indigo-100 dark:bg-indigo-800/50 p-3 rounded">
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm font-medium">Test-First Approach:</p>
                  <ol className="text-indigo-700 dark:text-indigo-300 text-sm mt-2 space-y-1 list-decimal list-inside">
                    <li>Write down expected inputs and outputs</li>
                    <li>Include edge cases in your test list</li>
                    <li>Code your solution</li>
                    <li>Run through each test case manually</li>
                    <li>Fix any issues you find</li>
                  </ol>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 Example Test Cases for Two Sum:</h3>
                <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                  <div className="bg-white dark:bg-blue-800/30 p-2 rounded">
                    <p><strong>Normal case:</strong> [2,7,11,15], target=9 → [0,1]</p>
                  </div>
                  <div className="bg-white dark:bg-blue-800/30 p-2 rounded">
                    <p><strong>No solution:</strong> [1,2,3], target=7 → []</p>
                  </div>
                  <div className="bg-white dark:bg-blue-800/30 p-2 rounded">
                    <p><strong>Minimum input:</strong> [3,3], target=6 → [0,1]</p>
                  </div>
                  <div className="bg-white dark:bg-blue-800/30 p-2 rounded">
                    <p><strong>Negative numbers:</strong> [-1,-2,-3], target=-5 → [1,2]</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Testing Tips:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• Test the smallest possible input first</li>
                  <li>• Test boundary values (0, 1, maximum constraints)</li>
                  <li>• Test with duplicate elements</li>
                  <li>• Test with negative numbers if applicable</li>
                  <li>• Always test the "no solution" case</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'takeaway',
      title: 'Key Takeaway',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">The Golden Rule</h2>
            </div>
            
            <div className="bg-white dark:bg-blue-800/30 p-6 rounded-lg mb-6">
              <blockquote className="text-lg text-blue-800 dark:text-blue-200 font-medium italic text-center">
                "Always try solving a problem on paper first using real input values. Write out a few test cases by hand before you code. Coding should only start when your logic is sound on paper."
              </blockquote>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  What You've Learned
                </h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• How to read problems like a detective</li>
                  <li>• The power of dry-running examples</li>
                  <li>• Why brute force is your friend</li>
                  <li>• Common problem patterns to recognize</li>
                  <li>• How to break down complex problems</li>
                  <li>• The importance of edge cases and testing</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Next Steps
                </h3>
                <ul className="space-y-1 text-purple-700 dark:text-purple-300 text-sm">
                  <li>• Practice with 5-10 easy problems</li>
                  <li>• Apply the paper-first approach</li>
                  <li>• Focus on understanding over speed</li>
                  <li>• Move to "Mastering Techniques" when ready</li>
                  <li>• Join coding communities for support</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
                <strong>Remember:</strong> Problem-solving is a skill that improves with practice. Be patient with yourself and celebrate small wins along the way!
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>
          
          <div className="text-sm text-[var(--color-text-secondary)]">
            {currentSectionIndex + 1} of {sections.length}
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          {courseTitle}
        </h1>
        
        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-bg-primary)] rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-[var(--color-text-secondary)] text-sm">
          Progress: {Math.round(progress)}% complete
        </p>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] p-6">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">Course Sections</h2>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => goToSection(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  index === currentSectionIndex
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-[var(--color-hover-light)] text-[var(--color-text-primary)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                {currentSection?.title}
              </h2>
              {currentSection?.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <button
                onClick={goToPreviousSection}
                disabled={currentSectionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-hover-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSectionIndex
                        ? 'bg-blue-600'
                        : index < currentSectionIndex
                        ? 'bg-green-500'
                        : 'bg-[var(--color-border)]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNextSection}
                disabled={currentSectionIndex === sections.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentSectionIndex === sections.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningContentProblemSolving;