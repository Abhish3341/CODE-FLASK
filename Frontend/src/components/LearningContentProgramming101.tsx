import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, ChevronRight, ChevronLeft, Terminal, Code, FileText, GitBranch, Repeat, List, Type, Calculator, GraduationCap } from 'lucide-react';

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
                  You want to learn multiple languages (Python, Java, C)
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
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">📝 Task: Print "Hello, World!"</h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-4">
                  The traditional first program in any language is to display the text "Hello, World!" on the screen. Let's see how to do this in three different languages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`print("Hello, World!")`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> Python uses the print() function to display text on the screen. The text is enclosed in quotes.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Explanation:</strong> Java requires a class and a main method. System.out.println() displays text.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C uses the printf() function from the stdio.h library. The \n creates a new line.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Key Concepts:</h3>
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
              <FileText className="w-6 h-6" />
              Variables & Data Types
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-purple-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">📝 Task: Store an integer and a string</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
                  Variables are like containers that store data. Different types of data (numbers, text, etc.) are stored in different types of variables.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`age = 20
name = "Alice"`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python is dynamically typed, so you don't need to declare the type.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`int age = 20;
String name = "Alice";`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java is statically typed, so you must declare the type of each variable.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`int age = 20;
char name[] = "Alice";`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> In C, strings are arrays of characters.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔍 Common Data Types:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-green-700 dark:text-green-300 text-sm">
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>Integer:</strong> Whole numbers (e.g., 42)</li>
                      <li>• <strong>Float/Double:</strong> Decimal numbers (e.g., 3.14)</li>
                      <li>• <strong>Boolean:</strong> True/False values</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>String:</strong> Text (e.g., "Hello")</li>
                      <li>• <strong>Character:</strong> Single character (e.g., 'A')</li>
                      <li>• <strong>Array/List:</strong> Collection of items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'input',
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
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 Task: Read two integers and print their sum</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Programs often need to get input from users. Let's see how to read input and process it in different languages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
print("Sum is:", a + b)`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> input() returns a string, so we convert it to an integer using int().
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println("Sum is: " + (a + b));
    }
}`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java uses the Scanner class to read input.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum is: %d\\n", a + b);
    return 0;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C uses scanf() to read input and printf() to display output.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Key Points:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• Input is often received as text (strings) and needs to be converted to the appropriate type</li>
                  <li>• Different languages have different ways of handling input</li>
                  <li>• Always validate user input to ensure it's in the expected format</li>
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
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              Conditionals (if, else)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-red-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">📝 Task: Check if a number is even or odd</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                  Conditionals allow your program to make decisions based on certain conditions. Let's see how to check if a number is even or odd.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`num = int(input())
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python uses indentation to define code blocks.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`if (num % 2 == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd");
}`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java uses curly braces {} to define code blocks.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`if (num % 2 == 0) {
    printf("Even\\n");
} else {
    printf("Odd\\n");
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C also uses curly braces {} to define code blocks.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔍 Conditional Operators:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-green-700 dark:text-green-300 text-sm">
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>==</strong> Equal to</li>
                      <li>• <strong>!=</strong> Not equal to</li>
                      <li>• <strong>&gt;</strong> Greater than</li>
                      <li>• <strong>&lt;</strong> Less than</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>&gt;=</strong> Greater than or equal to</li>
                      <li>• <strong>&lt;=</strong> Less than or equal to</li>
                      <li>• <strong>&&</strong> Logical AND</li>
                      <li>• <strong>||</strong> Logical OR</li>
                    </ul>
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
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
              <Repeat className="w-6 h-6" />
              Loops (for, while)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">📝 Task: Print numbers from 1 to 5</h3>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-4">
                  Loops allow you to repeat a block of code multiple times. Let's see how to print numbers from 1 to 5 using loops.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`# For loop
for i in range(1, 6):
    print(i)

# While loop
i = 1
while i <= 5:
    print(i)
    i += 1`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> range(1, 6) generates numbers from 1 to 5.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`// For loop
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

// While loop
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> i++ increments the value of i by 1.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`// For loop
for (int i = 1; i <= 5; i++) {
    printf("%d\\n", i);
}

// While loop
int i = 1;
while (i <= 5) {
    printf("%d\\n", i);
    i++;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> %d is a placeholder for an integer in printf().
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Loop Types:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• <strong>For Loop:</strong> Used when you know how many times you want to repeat a block of code</li>
                  <li>• <strong>While Loop:</strong> Used when you want to repeat a block of code as long as a condition is true</li>
                  <li>• <strong>Do-While Loop:</strong> Similar to while loop, but the condition is checked after the block of code is executed (not shown in examples)</li>
                </ul>
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
          <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Functions
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-teal-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">📝 Task: Write a function to return the square of a number</h3>
                <p className="text-teal-700 dark:text-teal-300 text-sm mb-4">
                  Functions are reusable blocks of code that perform a specific task. They help organize code and make it more modular.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`def square(x):
    return x * x

# Call the function
result = square(4)
print(result)  # Output: 16`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python uses the def keyword to define functions.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`public static int square(int x) {
    return x * x;
}

// Call the function
int result = square(4);
System.out.println(result);  // Output: 16`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java functions must specify return type and parameter types.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`int square(int x) {
    return x * x;
}

// Call the function
int result = square(4);
printf("%d\\n", result);  // Output: 16`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C functions must be declared before they are used.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔍 Function Components:</h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• <strong>Name:</strong> What the function is called (e.g., square)</li>
                  <li>• <strong>Parameters:</strong> Input values the function accepts (e.g., x)</li>
                  <li>• <strong>Return Type:</strong> The type of value the function returns (e.g., int)</li>
                  <li>• <strong>Body:</strong> The code that runs when the function is called</li>
                </ul>
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
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-pink-800 dark:text-pink-200 mb-4 flex items-center gap-2">
              <List className="w-6 h-6" />
              Arrays / Lists
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-pink-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">📝 Task: Store 5 numbers and print them</h3>
                <p className="text-pink-700 dark:text-pink-300 text-sm mb-4">
                  Arrays and lists are used to store multiple values in a single variable. They are useful for working with collections of data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`# Create a list
arr = [1, 2, 3, 4, 5]

# Print each element
for num in arr:
    print(num)

# Access by index
print(arr[0])  # Output: 1`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python uses lists, which are more flexible than arrays.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`// Create an array
int[] arr = {1, 2, 3, 4, 5};

// Print each element
for (int num : arr) {
    System.out.println(num);
}

// Access by index
System.out.println(arr[0]);  // Output: 1`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java arrays have a fixed size once created.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`// Create an array
int arr[] = {1, 2, 3, 4, 5};

// Print each element
for (int i = 0; i < 5; i++) {
    printf("%d\\n", arr[i]);
}

// Access by index
printf("%d\\n", arr[0]);  // Output: 1`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C arrays have a fixed size and no built-in methods.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Key Operations:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• <strong>Accessing:</strong> Get an element by its index (position)</li>
                  <li>• <strong>Modifying:</strong> Change the value of an element</li>
                  <li>• <strong>Iterating:</strong> Go through all elements one by one</li>
                  <li>• <strong>Length:</strong> Get the number of elements in the array</li>
                </ul>
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
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Strings
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-orange-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">📝 Task: Reverse a string</h3>
                <p className="text-orange-700 dark:text-orange-300 text-sm mb-4">
                  Strings are sequences of characters. They are used to store and manipulate text.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`s = "hello"
reversed = s[::-1]
print(reversed)  # Output: "olleh"

# Alternative method
reversed = ""
for char in s:
    reversed = char + reversed
print(reversed)  # Output: "olleh"`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> s[::-1] is a slice that steps backwards through the string.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`String s = "hello";
String reversed = new StringBuilder(s)
    .reverse().toString();
System.out.println(reversed);  // Output: "olleh"

// Alternative method
String reversed2 = "";
for (int i = s.length() - 1; i >= 0; i--) {
    reversed2 += s.charAt(i);
}
System.out.println(reversed2);  // Output: "olleh"`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> StringBuilder is more efficient for string manipulation.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`#include <string.h>

char s[] = "hello";
int len = strlen(s);
char reversed[len + 1];

for (int i = 0; i < len; i++) {
    reversed[i] = s[len - 1 - i];
}
reversed[len] = '\\0';  // Null terminator

printf("%s\\n", reversed);  // Output: "olleh"`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> In C, strings must end with a null terminator '\0'.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔍 Common String Operations:</h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• <strong>Length:</strong> Get the number of characters in a string</li>
                  <li>• <strong>Concatenation:</strong> Combine two or more strings</li>
                  <li>• <strong>Substring:</strong> Get a portion of a string</li>
                  <li>• <strong>Searching:</strong> Find a character or substring within a string</li>
                  <li>• <strong>Replacing:</strong> Replace characters or substrings</li>
                </ul>
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
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Operators
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-purple-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">📝 Task: Check if two numbers are equal</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
                  Operators are symbols that perform operations on variables and values. Let's explore different types of operators.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`a = 5
b = 5

if a == b:
    print("Equal")
else:
    print("Not equal")

# Arithmetic operators
print(a + b)  # Addition: 10
print(a - b)  # Subtraction: 0
print(a * b)  # Multiplication: 25
print(a / b)  # Division: 1.0
print(a % b)  # Modulus: 0`}
                  </pre>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-2 rounded">
{`int a = 5;
int b = 5;

if (a == b) {
    System.out.println("Equal");
} else {
    System.out.println("Not equal");
}

// Arithmetic operators
System.out.println(a + b);  // Addition: 10
System.out.println(a - b);  // Subtraction: 0
System.out.println(a * b);  // Multiplication: 25
System.out.println(a / b);  // Division: 1
System.out.println(a % b);  // Modulus: 0`}
                  </pre>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-2 rounded">
{`int a = 5;
int b = 5;

if (a == b) {
    printf("Equal\\n");
} else {
    printf("Not equal\\n");
}

// Arithmetic operators
printf("%d\\n", a + b);  // Addition: 10
printf("%d\\n", a - b);  // Subtraction: 0
printf("%d\\n", a * b);  // Multiplication: 25
printf("%d\\n", a / b);  // Division: 1
printf("%d\\n", a % b);  // Modulus: 0`}
                  </pre>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Types of Operators:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-yellow-700 dark:text-yellow-300 text-sm">
                  <div>
                    <p className="font-medium mb-1">Arithmetic Operators:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• <strong>+</strong> Addition</li>
                      <li>• <strong>-</strong> Subtraction</li>
                      <li>• <strong>*</strong> Multiplication</li>
                      <li>• <strong>/</strong> Division</li>
                      <li>• <strong>%</strong> Modulus (remainder)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Comparison Operators:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• <strong>==</strong> Equal to</li>
                      <li>• <strong>!=</strong> Not equal to</li>
                      <li>• <strong>&gt;</strong> Greater than</li>
                      <li>• <strong>&lt;</strong> Less than</li>
                      <li>• <strong>&gt;=</strong> Greater than or equal to</li>
                      <li>• <strong>&lt;=</strong> Less than or equal to</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'practice-problems',
      title: 'Simple Practice Problems',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Simple Practice Problems
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-blue-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Practice Makes Perfect</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Now that you've learned the basics, it's time to practice with some simple problems. Try solving these in all three languages to build your skills.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Problem 1: Reverse a string</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Write a function that takes a string as input and returns the reverse of that string.
                  </p>
                  <div className="mt-2 text-green-700 dark:text-green-300 text-xs">
                    <p><strong>Example:</strong></p>
                    <p>Input: "hello"</p>
                    <p>Output: "olleh"</p>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Problem 2: Find the maximum of two numbers</h3>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">
                    Write a function that takes two numbers as input and returns the larger of the two.
                  </p>
                  <div className="mt-2 text-purple-700 dark:text-purple-300 text-xs">
                    <p><strong>Example:</strong></p>
                    <p>Input: 5, 10</p>
                    <p>Output: 10</p>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Problem 3: Print all even numbers up to N</h3>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    Write a function that takes a number N as input and prints all even numbers from 1 to N.
                  </p>
                  <div className="mt-2 text-orange-700 dark:text-orange-300 text-xs">
                    <p><strong>Example:</strong></p>
                    <p>Input: 10</p>
                    <p>Output: 2 4 6 8 10</p>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Problem 4: Sum all numbers in an array</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Write a function that takes an array of numbers as input and returns the sum of all the numbers.
                  </p>
                  <div className="mt-2 text-red-700 dark:text-red-300 text-xs">
                    <p><strong>Example:</strong></p>
                    <p>Input: [1, 2, 3, 4, 5]</p>
                    <p>Output: 15</p>
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Problem 5: Count vowels in a string</h3>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                    Write a function that takes a string as input and returns the number of vowels (a, e, i, o, u) in the string.
                  </p>
                  <div className="mt-2 text-indigo-700 dark:text-indigo-300 text-xs">
                    <p><strong>Example:</strong></p>
                    <p>Input: "hello world"</p>
                    <p>Output: 3 (e, o, o)</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Tips for Practice:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• Start by solving the problem in one language, then try the others</li>
                  <li>• Break down each problem into smaller steps</li>
                  <li>• Test your solution with different inputs</li>
                  <li>• Don't worry about efficiency at first—focus on correctness</li>
                  <li>• If you get stuck, try to solve a simpler version of the problem first</li>
                </ul>
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
                  <li>• How to write basic programs in Python, Java, and C</li>
                  <li>• Working with variables and data types</li>
                  <li>• Reading input and displaying output</li>
                  <li>• Using conditionals and loops for control flow</li>
                  <li>• Creating and using functions</li>
                  <li>• Working with arrays/lists and strings</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Next Steps
                </h3>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Practice with the example problems in all three languages</li>
                  <li>• Try solving simple problems on your own</li>
                  <li>• Experiment with different approaches</li>
                  <li>• Move on to "Problem Solving Foundations" when ready</li>
                  <li>• Join coding communities for support and learning</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Remember:</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Mistakes are expected — debugging is part of learning. Always test with sample inputs and don't be afraid to experiment. Programming is a skill that improves with practice, so keep coding!
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🚀 Language Comparison:</h3>
              <ul className="space-y-1 text-indigo-700 dark:text-indigo-300 text-sm">
                <li>• <strong>Python:</strong> Easiest to learn, great for beginners, very readable</li>
                <li>• <strong>Java:</strong> More verbose, strongly typed, widely used in industry</li>
                <li>• <strong>C:</strong> Lower-level, gives more control, but requires more attention to detail</li>
                <li>• Learning multiple languages helps you understand programming concepts better</li>
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