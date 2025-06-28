import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, Zap, ChevronRight, ChevronLeft, Target, Search, Hash, GitBranch, Repeat, TrendingUp, Code, Eye } from 'lucide-react';

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

const LearningContentMasteringTechniques: React.FC<LearningContentProps> = ({ courseId, courseTitle, onBack }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const courseContent = getMasteringTechniquesContent();
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
      // Mark the last section as complete when clicking "Complete" on the last page
      markSectionComplete(currentSectionIndex);
      // You could also add some completion logic here, like showing a completion modal
      // or redirecting back to the courses page
      onBack(); // Return to courses page when completed
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

  const getMasteringTechniquesContent = (): Section[] => [
    {
      id: 'overview',
      title: 'Course Overview',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Mastering Techniques</h2>
                <p className="text-purple-600 dark:text-purple-400">Level: Intermediate | Time: 90–120 mins</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-purple-800/30 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Target Audience</h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                For learners who have solved basic problems and now want to go deeper. Focus on the "how" and "why" behind efficient coding — uncovering patterns used by top coders.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">This course is for you if:</h3>
              <ul className="space-y-2 text-purple-700 dark:text-purple-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You can solve basic problems but want to improve efficiency
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You want to learn common algorithmic patterns
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You're ready to move beyond brute force solutions
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'two-pointers',
      title: 'Two Pointers Technique',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Two Pointers (Left/Right Scan)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-blue-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 When to Use:</h3>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Array is sorted</li>
                  <li>• You need to compare elements from both ends</li>
                  <li>• You're searching for a pair that satisfies a condition (e.g., sum, distance)</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Core Template:</h3>
                <pre className="text-green-700 dark:text-green-300 text-sm bg-white dark:bg-green-800/20 p-3 rounded">
{`let left = 0, right = arr.length - 1;
while (left < right) {
    if (condition_met) {
        // Found solution
        return result;
    } else if (need_larger_sum) {
        left++; // Move left pointer right
    } else {
        right--; // Move right pointer left
    }
}`}
                </pre>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📝 Example Problems:</h3>
                <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• <strong>Two Sum (sorted version):</strong> Find two numbers that add up to target</li>
                  <li>• <strong>Container With Most Water:</strong> Find two lines that contain most water</li>
                  <li>• <strong>Remove Duplicates:</strong> Remove duplicates from sorted array in-place</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🧠 Key Insight:</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  Two pointers work because they eliminate impossible solutions efficiently. When you move a pointer, you're saying "all combinations with the previous position are impossible."
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sliding-window',
      title: 'Sliding Window Technique',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-4 flex items-center gap-2">
              <Search className="w-6 h-6" />
              Sliding Window (Fixed + Variable Size)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-teal-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🪟 When to Use:</h3>
                <ul className="space-y-1 text-teal-700 dark:text-teal-300 text-sm">
                  <li>• Substring or subarray problems</li>
                  <li>• You're calculating something in a "moving range"</li>
                  <li>• Need to optimize from O(n²) to O(n)</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Fixed Size Window:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`// Maximum sum of k elements
let windowSum = 0;
for (let i = 0; i < k; i++) {
    windowSum += arr[i];
}
let maxSum = windowSum;

for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
}`}
                  </pre>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Variable Size Window:</h3>
                  <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded">
{`// Longest substring without repeating
let start = 0, maxLen = 0;
let seen = new Set();

for (let end = 0; end < s.length; end++) {
    while (seen.has(s[end])) {
        seen.delete(s[start]);
        start++;
    }
    seen.add(s[end]);
    maxLen = Math.max(maxLen, end - start + 1);
}`}
                  </pre>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🚀 Benefits:</h3>
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  Transforms brute-force O(n²) solutions into optimized O(n) solutions by avoiding redundant calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prefix-sum',
      title: 'Prefix Sum & Difference Arrays',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
              <Hash className="w-6 h-6" />
              Prefix Sum & Difference Arrays
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">📊 When to Use:</h3>
                <ul className="space-y-1 text-indigo-700 dark:text-indigo-300 text-sm">
                  <li>• Multiple range queries</li>
                  <li>• Repeated sum calculations</li>
                  <li>• Need to apply operations to ranges efficiently</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Prefix Sum:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded mb-2">
{`// Build prefix sum array
let prefix = [0];
for (let i = 0; i < arr.length; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
}

// Range sum from i to j (inclusive)
let rangeSum = prefix[j + 1] - prefix[i];`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs">
                    <strong>Use case:</strong> Subarray Sum Equals K
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Difference Array:</h3>
                  <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded mb-2">
{`// Apply range updates efficiently
let diff = new Array(n + 1).fill(0);

// Add val to range [l, r]
diff[l] += val;
diff[r + 1] -= val;

// Build final array
for (let i = 1; i < n; i++) {
    diff[i] += diff[i - 1];
}`}
                  </pre>
                  <p className="text-green-700 dark:text-green-300 text-xs">
                    <strong>Use case:</strong> Range Addition
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Key Insight:</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Prefix sums turn O(n) range queries into O(1) operations. Difference arrays turn O(n) range updates into O(1) operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'hashing',
      title: 'Hashing for Frequency & Pairing',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
              <Hash className="w-6 h-6" />
              Hashing for Fast Lookups
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-red-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">🔍 When to Use:</h3>
                <ul className="space-y-1 text-red-700 dark:text-red-300 text-sm">
                  <li>• You need fast lookup (O(1))</li>
                  <li>• Counting, pairing, frequency, uniqueness problems</li>
                  <li>• Need to check if something exists quickly</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">HashMap (Key-Value):</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded mb-2">
{`// Two Sum using HashMap
let map = new Map();
for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map.has(complement)) {
        return [map.get(complement), i];
    }
    map.set(nums[i], i);
}`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs">
                    <strong>Use case:</strong> Two Sum, Isomorphic Strings
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">HashSet (Uniqueness):</h3>
                  <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded mb-2">
{`// Check for duplicates
let seen = new Set();
for (let num of nums) {
    if (seen.has(num)) {
        return true; // Duplicate found
    }
    seen.add(num);
}
return false; // No duplicates`}
                  </pre>
                  <p className="text-green-700 dark:text-green-300 text-xs">
                    <strong>Use case:</strong> Contains Duplicate
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🧠 Always Ask:</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  "Can a map help me avoid re-computation?" Hash tables are your best friend for eliminating nested loops.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'binary-search',
      title: 'Binary Search Patterns',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center gap-2">
              <Search className="w-6 h-6" />
              Binary Search (Index & Answer)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-orange-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🎯 When to Use:</h3>
                <ul className="space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                  <li>• Sorted arrays</li>
                  <li>• Monotonic functions (output moves in one direction)</li>
                  <li>• "Find the minimum/maximum value that satisfies condition"</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Binary Search on Index:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded mb-2">
{`let low = 0, high = arr.length - 1;
while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
        return mid;
    } else if (arr[mid] < target) {
        low = mid + 1;
    } else {
        high = mid - 1;
    }
}
return -1; // Not found`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs">
                    <strong>Use case:</strong> Search Insert Position
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Binary Search on Answer:</h3>
                  <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded mb-2">
{`let low = 1, high = maxPossible;
while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (canAchieve(mid)) {
        high = mid; // Try smaller
    } else {
        low = mid + 1; // Need larger
    }
}
return low; // Minimum achievable`}
                  </pre>
                  <p className="text-green-700 dark:text-green-300 text-xs">
                    <strong>Use case:</strong> Capacity to Ship Packages
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tip:</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Binary search on answer is powerful for optimization problems. If you can check "is X achievable?", you can find the optimal X.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'recursion-backtracking',
      title: 'Recursion & Backtracking',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              Recursion & Backtracking
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-green-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🌳 When to Use:</h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• Problems that explore multiple paths (combinations, subsets)</li>
                  <li>• Tree problems, graph traversal, puzzles</li>
                  <li>• Need to try all possibilities and backtrack</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🧠 The Backtracking Template:</h3>
                <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
{`function backtrack(path, choices) {
    // Base case - found solution
    if (isComplete(path)) {
        result.push([...path]);
        return;
    }
    
    // Try each choice
    for (let choice of choices) {
        if (isValid(choice)) {
            path.push(choice);        // Make choice
            backtrack(path, newChoices); // Recurse
            path.pop();               // Backtrack
        }
    }
}`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Example: Subsets</h3>
                  <pre className="text-purple-700 dark:text-purple-300 text-xs bg-white dark:bg-purple-800/20 p-2 rounded">
{`function subsets(nums) {
    let result = [];
    
    function backtrack(start, path) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}`}
                  </pre>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Example: N-Queens</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`function solveNQueens(n) {
    let board = Array(n).fill().map(() => Array(n).fill('.'));
    let result = [];
    
    function backtrack(row) {
        if (row === n) {
            result.push(board.map(r => r.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (isValid(board, row, col)) {
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
            }
        }
    }
    
    backtrack(0);
    return result;
}`}
                  </pre>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚡ Key Points:</h3>
                <ul className="space-y-1 text-red-700 dark:text-red-300 text-sm">
                  <li>• <strong>Base case:</strong> When to stop recursion</li>
                  <li>• <strong>Recursive case:</strong> Explore all valid choices</li>
                  <li>• <strong>Backtrack:</strong> Undo the choice to try next option</li>
                  <li>• Use visited[] arrays or sets for tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dynamic-programming',
      title: 'Dynamic Programming Basics',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
              <Repeat className="w-6 h-6" />
              Dynamic Programming (1D + 2D)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🔄 When to Use:</h3>
                <ul className="space-y-1 text-indigo-700 dark:text-indigo-300 text-sm">
                  <li>• Overlapping subproblems</li>
                  <li>• You can solve large problems using results of smaller ones</li>
                  <li>• Optimization problems (min/max)</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">1D DP: Climbing Stairs</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`function climbStairs(n) {
    if (n <= 2) return n;
    
    let dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Pattern:</strong> dp[i] depends on previous states
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">2D DP: Unique Paths</h3>
                  <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded">
{`function uniquePaths(m, n) {
    let dp = Array(m).fill().map(() => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}`}
                  </pre>
                  <p className="text-green-700 dark:text-green-300 text-xs mt-2">
                    <strong>Pattern:</strong> dp[i][j] depends on neighbors
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 DP Strategy:</h3>
                <ol className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm list-decimal list-inside">
                  <li>Define what dp[i] represents</li>
                  <li>Find the recurrence relation</li>
                  <li>Identify base cases</li>
                  <li>Determine the order of computation</li>
                  <li>Optimize space if possible</li>
                </ol>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🧠 Pro Tip:</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  Bottom-up DP is often easier than recursion + memoization when starting. Build solutions from smallest to largest subproblems.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'takeaway',
      title: 'Final Thoughts',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Technique Mastery</h2>
            </div>
            
            <div className="bg-white dark:bg-purple-800/30 p-6 rounded-lg mb-6">
              <blockquote className="text-lg text-purple-800 dark:text-purple-200 font-medium italic text-center">
                "Before jumping into code, ask: 'Which category does this problem belong to?' Recognizing a technique early can save you time and unnecessary complexity."
              </blockquote>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Techniques You've Mastered
                </h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• Two Pointers for sorted arrays</li>
                  <li>• Sliding Window for subarray problems</li>
                  <li>• Prefix Sum for range queries</li>
                  <li>• Hashing for fast lookups</li>
                  <li>• Binary Search for optimization</li>
                  <li>• Backtracking for exploration</li>
                  <li>• Dynamic Programming for optimization</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  How to Practice
                </h3>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Pick one technique per week</li>
                  <li>• Solve 3–4 problems using that pattern only</li>
                  <li>• Summarize what worked and what confused you</li>
                  <li>• Revisit the pattern in 10 days</li>
                  <li>• Mix techniques in harder problems</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🧠 Remember:</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Techniques are tools. Problems are puzzles. You solve faster when you choose the right tool. Don't try to master all techniques at once—focus on one at a time and build your pattern recognition gradually.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🚀 Next Steps:</h3>
              <ul className="space-y-1 text-indigo-700 dark:text-indigo-300 text-sm">
                <li>• Practice medium-level problems using these techniques</li>
                <li>• Learn to combine multiple techniques in complex problems</li>
                <li>• Study advanced topics like graph algorithms and advanced DP</li>
                <li>• Participate in coding contests to test your skills</li>
              </ul>
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
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                    ? 'bg-purple-600 text-white'
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
                        ? 'bg-purple-600'
                        : index < currentSectionIndex
                        ? 'bg-green-500'
                        : 'bg-[var(--color-border)]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNextSection}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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

export default LearningContentMasteringTechniques;