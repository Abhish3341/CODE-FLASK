import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, GraduationCap, ChevronRight, ChevronLeft, Terminal, Type, FileText, GitBranch, Repeat, Code2, List, Calculator, RotateCcw } from 'lucide-react';

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
      // Mark the last section as complete when clicking "Complete" on the last page
      markSectionComplete(currentSectionIndex);
      // Return to courses page when completed
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
    {
      id: 'overview',
      title: 'Course Overview',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Programming 101</h2>
                <p className="text-emerald-600 dark:text-emerald-400">Level: Beginner | Time: 60–90 mins</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-emerald-800/30 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Target Audience</h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                Designed for absolute beginners — especially students from non-computer science backgrounds — who want to start solving problems but lack the basic coding foundation.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">This course is for you if:</h3>
              <ul className="space-y-2 text-emerald-700 dark:text-emerald-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You're new to programming and want to learn the basics
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You want to understand fundamental programming concepts
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  You want to learn multiple programming languages (Python, Java, C)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'first-program',
      title: 'Writing Your First Program',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center gap-2">
              <Terminal className="w-6 h-6" />
              Hello, World!
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-emerald-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">🎯 Task: Print "Hello, World!"</h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                  The traditional first program in any language is to display the text "Hello, World!" on the screen. Let's see how to do this in three different languages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">print("Hello, World!")</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> Python uses the print() function to display text on the screen. The text is enclosed in quotes.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java requires a class and a main method. System.out.println() displays text.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C uses the printf() function from the stdio.h library. The \\n creates a new line.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🔑 Key Concepts:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• <strong>Output:</strong> All programming languages have ways to display text</li>
                  <li>• <strong>Syntax:</strong> Each language has its own rules for writing code</li>
                  <li>• <strong>Structure:</strong> Some languages (like Java and C) require more structure than others</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'variables',
      title: 'Variables & Data Types',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Variables & Data Types
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-purple-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🎯 Task: Store an integer and a string</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  Variables are like containers that store data. Different types of data (numbers, text, etc.) are stored in different types of variables.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`age = 20
name = "Alice"`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> Python automatically determines the data type based on the value.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`int age = 20;
String name = "Alice";`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java requires you to specify the data type before the variable name.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`int age = 20;
char name[] = "Alice";`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C also requires data types. Strings are stored as character arrays.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔑 Common Data Types:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white dark:bg-green-800/50 p-2 rounded">
                    <span className="font-medium text-green-700 dark:text-green-300">Integer:</span> Whole numbers (1, 42, -3)
                  </div>
                  <div className="bg-white dark:bg-green-800/50 p-2 rounded">
                    <span className="font-medium text-green-700 dark:text-green-300">Float/Double:</span> Decimal numbers (3.14, 2.5)
                  </div>
                  <div className="bg-white dark:bg-green-800/50 p-2 rounded">
                    <span className="font-medium text-green-700 dark:text-green-300">String:</span> Text ("Hello", "Alice")
                  </div>
                  <div className="bg-white dark:bg-green-800/50 p-2 rounded">
                    <span className="font-medium text-green-700 dark:text-green-300">Boolean:</span> True/False values
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'user-input',
      title: 'Taking Input from the User',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Taking Input from the User
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-blue-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Task: Read two integers and print their sum</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Programs often need to interact with users by taking input. Let's see how to read input and process it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
print("Sum is:", a + b)`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> input() reads a string, and int() converts it to an integer.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();
    int b = sc.nextInt();
    System.out.println("Sum is: " + (a + b));
  }
}`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Scanner class is used to read input from various sources.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`#include <stdio.h>

int main() {
  int a, b;
  scanf("%d %d", &a, &b);
  printf("Sum is: %d\\n", a + b);
  return 0;
}`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> scanf() reads formatted input. The & operator gets the memory address.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🔑 Key Points:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• Input is typically read as strings (text)</li>
                  <li>• You often need to convert input to the right data type</li>
                  <li>• Different languages have different ways to handle input</li>
                  <li>• Always validate user input in real applications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'conditionals',
      title: 'Conditionals (if, else)',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              Conditionals (if, else)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🎯 Task: Check if a number is even or odd</h3>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                  Conditionals allow your program to make decisions based on certain conditions. They create different paths in your code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`num = int(input())
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> Python uses indentation to define code blocks. The % operator gives the remainder after division.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`if (num % 2 == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd");
}`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java uses curly braces {} to define code blocks.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`if (num % 2 == 0) {
    printf("Even\\n");
} else {
    printf("Odd\\n");
}`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C also uses curly braces {} to define code blocks, similar to Java.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🔑 Conditional Operators:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">==</span> Equal to
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">!=</span> Not equal to
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">&lt;</span> Less than
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">&gt;</span> Greater than
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">&lt;=</span> Less than or equal to
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">&gt;=</span> Greater than or equal to
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'loops',
      title: 'Loops (for, while)',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
              <Repeat className="w-6 h-6" />
              Loops (for, while)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-green-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🎯 Task: Print numbers from 1 to 5</h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Loops allow you to repeat a block of code multiple times. This is useful when you want to perform the same action on multiple items.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`for i in range(1, 6):
    print(i)`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> range(1, 6) creates a sequence from 1 to 5 (the end value is exclusive).
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> The for loop has three parts: initialization, condition, and increment.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`for (int i = 1; i <= 5; i++) {
    printf("%d\\n", i);
}`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C's for loop is similar to Java's. %d is a placeholder for an integer.
                  </p>
                </div>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🔄 Types of Loops:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white dark:bg-teal-800/50 p-3 rounded">
                    <h4 className="font-medium text-teal-700 dark:text-teal-300 mb-1">For Loop</h4>
                    <p className="text-teal-600 dark:text-teal-400 text-xs">
                      Used when you know in advance how many times you want to execute a block of code.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-teal-800/50 p-3 rounded">
                    <h4 className="font-medium text-teal-700 dark:text-teal-300 mb-1">While Loop</h4>
                    <p className="text-teal-600 dark:text-teal-400 text-xs">
                      Used when you want to continue executing as long as a condition is true.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'functions',
      title: 'Functions',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-pink-800 dark:text-pink-200 mb-4 flex items-center gap-2">
              <Code2 className="w-6 h-6" />
              Functions
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-pink-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">🎯 Task: Write a function to return the square of a number</h3>
                <p className="text-pink-700 dark:text-pink-300 text-sm">
                  Functions are reusable blocks of code that perform a specific task. They help organize code and avoid repetition.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`def square(x):
    return x * x

print(square(4))  # Output: 16`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> def defines a function. The function takes a parameter x and returns its square.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`public static int square(int x) {
    return x * x;
}

// Call it like this:
// int result = square(4);  // result = 16`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java functions specify return type (int) and parameter types.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`int square(int x) {
    return x * x;
}

// Call it like this:
// int result = square(4);  // result = 16`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C functions also specify return type and parameter types, similar to Java.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🔑 Function Components:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">Name:</span> Identifies the function
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">Parameters:</span> Input values
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">Body:</span> Code to execute
                  </div>
                  <div className="bg-white dark:bg-purple-800/50 p-2 rounded">
                    <span className="font-medium text-purple-700 dark:text-purple-300">Return value:</span> Output of the function
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'arrays',
      title: 'Arrays / Lists',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
              <List className="w-6 h-6" />
              Arrays / Lists
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-amber-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">🎯 Task: Store 5 numbers and print them</h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  Arrays and lists are collections that store multiple values in a single variable. They're essential for working with groups of related data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`arr = [1, 2, 3, 4, 5]
for num in arr:
    print(num)`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> Python uses lists (denoted by square brackets). The for loop iterates through each element.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`int[] arr = {1, 2, 3, 4, 5};
for (int num : arr) {
    System.out.println(num);
}`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java uses arrays. The enhanced for loop (for-each) iterates through elements.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`int arr[] = {1, 2, 3, 4, 5};
for (int i = 0; i < 5; i++) {
    printf("%d\\n", arr[i]);
}`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C uses arrays. The traditional for loop uses an index to access elements.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">🔑 Array Operations:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white dark:bg-amber-800/50 p-2 rounded">
                    <span className="font-medium text-amber-700 dark:text-amber-300">Access:</span> Get an element by index
                  </div>
                  <div className="bg-white dark:bg-amber-800/50 p-2 rounded">
                    <span className="font-medium text-amber-700 dark:text-amber-300">Modify:</span> Change an element's value
                  </div>
                  <div className="bg-white dark:bg-amber-800/50 p-2 rounded">
                    <span className="font-medium text-amber-700 dark:text-amber-300">Length:</span> Get the number of elements
                  </div>
                  <div className="bg-white dark:bg-amber-800/50 p-2 rounded">
                    <span className="font-medium text-amber-700 dark:text-amber-300">Iterate:</span> Process each element
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'strings',
      title: 'Strings',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-4 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Strings
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-teal-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🎯 Task: Reverse a string</h3>
                <p className="text-teal-700 dark:text-teal-300 text-sm">
                  Strings are sequences of characters. They're used to store and manipulate text.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`s = "hello"
print(s[::-1])  # Output: "olleh"`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> s[::-1] is a slice that steps backwards through the string.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`String s = "hello";
String reversed = new StringBuilder(s)
    .reverse().toString();
System.out.println(reversed);`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java uses the StringBuilder class to efficiently manipulate strings.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`#include <string.h>

char s[] = "hello";
int len = strlen(s);
for (int i = len - 1; i >= 0; i--) {
    printf("%c", s[i]);
}`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C uses character arrays for strings. strlen() gets the length, and we print characters in reverse.
                  </p>
                </div>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🔑 Common String Operations:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white dark:bg-teal-800/50 p-2 rounded">
                    <span className="font-medium text-teal-700 dark:text-teal-300">Length:</span> Get the number of characters
                  </div>
                  <div className="bg-white dark:bg-teal-800/50 p-2 rounded">
                    <span className="font-medium text-teal-700 dark:text-teal-300">Concatenation:</span> Combine strings
                  </div>
                  <div className="bg-white dark:bg-teal-800/50 p-2 rounded">
                    <span className="font-medium text-teal-700 dark:text-teal-300">Substring:</span> Get part of a string
                  </div>
                  <div className="bg-white dark:bg-teal-800/50 p-2 rounded">
                    <span className="font-medium text-teal-700 dark:text-teal-300">Search:</span> Find characters or substrings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'operators',
      title: 'Operators',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Operators
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-red-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">🎯 Task: Check if two numbers are equal</h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Operators are symbols that perform operations on variables and values. They're the building blocks of expressions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="bg-white dark:bg-blue-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-blue-700 dark:text-blue-300">{`if a == b:
    print("Equal")`}</code>
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> == is the equality operator. It returns True if both sides are equal.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="bg-white dark:bg-orange-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-orange-700 dark:text-orange-300">{`if (a == b) {
    System.out.println("Equal");
}`}</code>
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java also uses == for primitive types. For objects, use .equals().
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="bg-white dark:bg-gray-800/50 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code className="text-gray-700 dark:text-gray-300">{`if (a == b) {
    printf("Equal\\n");
}`}</code>
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C uses == to compare values, just like Python and Java.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">🔑 Types of Operators:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white dark:bg-red-800/50 p-3 rounded">
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">Arithmetic Operators</h4>
                    <p className="text-red-600 dark:text-red-400 text-xs">
                      +, -, *, /, % (modulo), ** (exponent in Python)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-red-800/50 p-3 rounded">
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">Comparison Operators</h4>
                    <p className="text-red-600 dark:text-red-400 text-xs">
                      ==, !=, &lt;, &gt;, &lt;=, &gt;=
                    </p>
                  </div>
                  <div className="bg-white dark:bg-red-800/50 p-3 rounded">
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">Logical Operators</h4>
                    <p className="text-red-600 dark:text-red-400 text-xs">
                      AND, OR, NOT (syntax varies by language)
                    </p>
                  </div>
                  <div className="bg-white dark:bg-red-800/50 p-3 rounded">
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">Assignment Operators</h4>
                    <p className="text-red-600 dark:text-red-400 text-xs">
                      =, +=, -=, *=, /=
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'practice',
      title: 'Simple Practice Problems',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
              <Code2 className="w-6 h-6" />
              Simple Practice Problems
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🎯 Practice Makes Perfect</h3>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                  Now that you've learned the basics, it's time to practice! Here are some simple problems to solve in any of the three languages.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reverse a String
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                    Write a program that takes a string as input and prints it in reverse.
                  </p>
                  <div className="bg-white dark:bg-blue-800/50 p-3 rounded">
                    <p className="text-blue-600 dark:text-blue-400 text-xs">
                      <strong>Example:</strong> Input: "hello" → Output: "olleh"
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Find the Maximum of Two Numbers
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                    Write a program that takes two numbers as input and prints the larger one.
                  </p>
                  <div className="bg-white dark:bg-green-800/50 p-3 rounded">
                    <p className="text-green-600 dark:text-green-400 text-xs">
                      <strong>Example:</strong> Input: 5, 10 → Output: 10
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                    <Repeat className="w-4 h-4" />
                    Print All Even Numbers Up to N
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 text-sm mb-2">
                    Write a program that takes a number N as input and prints all even numbers from 2 to N.
                  </p>
                  <div className="bg-white dark:bg-purple-800/50 p-3 rounded">
                    <p className="text-purple-600 dark:text-purple-400 text-xs">
                      <strong>Example:</strong> Input: 10 → Output: 2 4 6 8 10
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Sum All Numbers in an Array
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300 text-sm mb-2">
                    Write a program that calculates the sum of all numbers in an array/list.
                  </p>
                  <div className="bg-white dark:bg-orange-800/50 p-3 rounded">
                    <p className="text-orange-600 dark:text-orange-400 text-xs">
                      <strong>Example:</strong> Input: [1, 2, 3, 4, 5] → Output: 15
                    </p>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Count Vowels in a String
                  </h3>
                  <p className="text-teal-700 dark:text-teal-300 text-sm mb-2">
                    Write a program that counts the number of vowels (a, e, i, o, u) in a given string.
                  </p>
                  <div className="bg-white dark:bg-teal-800/50 p-3 rounded">
                    <p className="text-teal-600 dark:text-teal-400 text-xs">
                      <strong>Example:</strong> Input: "hello world" → Output: 3
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tip:</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Try solving each problem in all three languages to build cross-language comfort. Start with the language you find easiest, then challenge yourself with the others.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'takeaway',
      title: 'Final Notes',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
              <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Programming Fundamentals</h2>
            </div>
            
            <div className="bg-white dark:bg-emerald-800/30 p-6 rounded-lg mb-6">
              <blockquote className="text-lg text-emerald-800 dark:text-emerald-200 font-medium italic text-center">
                "You don't need to master everything before solving problems. Learn just enough to write simple logic, and grow from there. Solving problems is how you actually learn."
              </blockquote>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  What You've Learned
                </h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• Basic syntax in Python, Java, and C</li>
                  <li>• How to write and run simple programs</li>
                  <li>• Working with variables and data types</li>
                  <li>• Using conditionals and loops</li>
                  <li>• Creating and using functions</li>
                  <li>• Working with arrays/lists and strings</li>
                  <li>• Understanding different operators</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Key Takeaways
                </h3>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Code is just a set of instructions for the computer</li>
                  <li>• Different languages have different syntax, but similar logic</li>
                  <li>• Focus on small tasks: read input → process → print output</li>
                  <li>• Learn how to trace code by hand to predict what it will do</li>
                  <li>• You don't need to memorize syntax — understand the flow</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🧠 Remember:</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Mistakes are expected — debugging is part of learning. Always test with sample inputs and don't be afraid to experiment. Programming is a skill that improves with practice.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🚀 Next Steps:</h3>
              <ul className="space-y-1 text-indigo-700 dark:text-indigo-300 text-sm">
                <li>• Practice the simple problems in all three languages</li>
                <li>• Try creating your own small programs</li>
                <li>• Move on to "Problem Solving Foundations" to learn how to approach coding challenges</li>
                <li>• Join coding communities for support and learning</li>
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
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
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
                    ? 'bg-emerald-600 text-white'
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
                        ? 'bg-emerald-600'
                        : index < currentSectionIndex
                        ? 'bg-green-500'
                        : 'bg-[var(--color-border)]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNextSection}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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

export default LearningContentProgramming101;