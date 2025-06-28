import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, Terminal, Code, ChevronRight, ChevronLeft, GraduationCap, Type, FileText, GitBranch, Repeat, List, RotateCcw, Calculator } from 'lucide-react';

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
                  You want to learn multiple programming languages
                </li>
              </ul>
            </div>

            <div className="mt-4 bg-emerald-100 dark:bg-emerald-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Languages Covered:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-full text-sm">Python</span>
                <span className="px-3 py-1 bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-full text-sm">Java</span>
                <span className="px-3 py-1 bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-full text-sm">C</span>
              </div>
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
              Writing Your First Program
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-emerald-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">📝 Task: Print "Hello, World!"</h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-4">
                  The traditional first program in any language is to display the text "Hello, World!" on the screen. Let's see how to do this in different languages:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
{`print("Hello, World!")`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Explanation:</strong> Python uses the print() function to display text on the screen. Text is enclosed in quotes.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-3 rounded">
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
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-3 rounded">
{`#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Explanation:</strong> C uses printf() function from stdio.h library. The \n creates a new line.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Key Concepts:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• <strong>Output:</strong> Each language has a way to display text (print, System.out.println, printf)</li>
                  <li>• <strong>Strings:</strong> Text is enclosed in quotes</li>
                  <li>• <strong>Structure:</strong> Languages have different requirements for program structure</li>
                  <li>• <strong>Syntax:</strong> Each language has its own rules for writing code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'variables-data-types',
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
                  Variables are containers for storing data values. Each variable has a data type that determines what kind of value it can hold.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
{`age = 20
name = "Alice"

print(age)      # 20
print(name)     # Alice
print(type(age))   # <class 'int'>
print(type(name))  # <class 'str'>`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python is dynamically typed - you don't need to declare types.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-3 rounded">
{`int age = 20;
String name = "Alice";

System.out.println(age);   // 20
System.out.println(name);  // Alice`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java is statically typed - you must declare variable types.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-3 rounded">
{`#include <stdio.h>

int main() {
    int age = 20;
    char name[] = "Alice";
    
    printf("%d\\n", age);  // 20
    printf("%s\\n", name);  // Alice
    return 0;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C is statically typed and strings are character arrays.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🧠 Common Data Types:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-green-700 dark:text-green-300 text-sm">
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>Integer:</strong> Whole numbers (int)</li>
                      <li>• <strong>Float/Double:</strong> Decimal numbers</li>
                      <li>• <strong>String:</strong> Text</li>
                      <li>• <strong>Boolean:</strong> True/False values</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>Character:</strong> Single letters/symbols</li>
                      <li>• <strong>Array/List:</strong> Collections of items</li>
                      <li>• <strong>Object/Dictionary:</strong> Key-value pairs</li>
                      <li>• <strong>Null/None:</strong> Absence of value</li>
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
      id: 'user-input',
      title: 'Taking Input from the User',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-4 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Taking Input from the User
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-teal-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">📝 Task: Read two integers and print their sum</h3>
                <p className="text-teal-700 dark:text-teal-300 text-sm mb-4">
                  Programs often need to get input from users. Let's see how to read input and process it in different languages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
{`a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
print("Sum is:", a + b)`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> input() returns a string, so we convert to int.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-3 rounded">
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
                    <strong>Note:</strong> Scanner class is used for input in Java.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-3 rounded">
{`#include <stdio.h>

int main() {
    int a, b;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    printf("Sum is: %d\\n", a + b);
    return 0;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> scanf() reads formatted input, &a means "address of a".
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Input Tips:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• Always validate user input when possible</li>
                  <li>• Convert input to the appropriate data type</li>
                  <li>• Handle potential errors (e.g., if user enters text when expecting a number)</li>
                  <li>• Provide clear prompts so users know what to enter</li>
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
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              Conditionals (if, else)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-blue-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 Task: Check if a number is even or odd</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Conditional statements allow your program to make decisions based on conditions. They execute different code blocks depending on whether a condition is true or false.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
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
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-3 rounded">
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
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-3 rounded">
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
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🧠 Conditional Operators:</h3>
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

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">💡 Advanced Conditionals:</h3>
                <pre className="text-purple-700 dark:text-purple-300 text-xs bg-white dark:bg-purple-800/20 p-3 rounded mb-2">
{`// Multiple conditions with else if
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "F";
}`}
                </pre>
                <p className="text-purple-700 dark:text-purple-300 text-xs">
                  <strong>Tip:</strong> You can chain multiple conditions using else if statements.
                </p>
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
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
              <Repeat className="w-6 h-6" />
              Loops (for, while)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-amber-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📝 Task: Print numbers from 1 to 5</h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
                  Loops allow you to repeat a block of code multiple times. This is useful when you want to perform the same action on multiple items or a specific number of times.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">For Loops:</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-blue-800 dark:text-blue-200 text-xs font-medium mb-1">Python:</p>
                      <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`for i in range(1, 6):
    print(i)`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-blue-800 dark:text-blue-200 text-xs font-medium mb-1">Java:</p>
                      <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-blue-800 dark:text-blue-200 text-xs font-medium mb-1">C:</p>
                      <pre className="text-blue-700 dark:text-blue-300 text-xs bg-white dark:bg-blue-800/20 p-2 rounded">
{`for (int i = 1; i <= 5; i++) {
    printf("%d\\n", i);
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">While Loops:</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-green-800 dark:text-green-200 text-xs font-medium mb-1">Python:</p>
                      <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded">
{`i = 1
while i <= 5:
    print(i)
    i += 1`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-green-800 dark:text-green-200 text-xs font-medium mb-1">Java:</p>
                      <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded">
{`int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-green-800 dark:text-green-200 text-xs font-medium mb-1">C:</p>
                      <pre className="text-green-700 dark:text-green-300 text-xs bg-white dark:bg-green-800/20 p-2 rounded">
{`int i = 1;
while (i <= 5) {
    printf("%d\\n", i);
    i++;
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 When to Use Each Loop Type:</h3>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                  <li>• <strong>For loop:</strong> When you know exactly how many times you want to loop</li>
                  <li>• <strong>While loop:</strong> When you want to continue until a condition is no longer true</li>
                  <li>• <strong>Do-while loop:</strong> When you want to execute the loop at least once</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Common Loop Pitfalls:</h3>
                <ul className="space-y-1 text-red-700 dark:text-red-300 text-sm">
                  <li>• <strong>Infinite loops:</strong> Forgetting to update the loop variable</li>
                  <li>• <strong>Off-by-one errors:</strong> Looping one too many or too few times</li>
                  <li>• <strong>Array bounds:</strong> Accessing array elements outside valid indices</li>
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
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Functions
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-indigo-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">📝 Task: Write a function to return the square of a number</h3>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-4">
                  Functions are reusable blocks of code that perform a specific task. They help organize code, reduce repetition, and make programs more modular.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
{`def square(x):
    return x * x

print(square(4))  # 16`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python uses def to define functions.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-3 rounded">
{`public static int square(int x) {
    return x * x;
}

// Call it like this:
int result = square(4);  // 16`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java requires return type declaration.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-3 rounded">
{`int square(int x) {
    return x * x;
}

// Call it like this:
int result = square(4);  // 16`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C also requires return type declaration.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🧠 Function Components:</h3>
                <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                  <li>• <strong>Name:</strong> What you call the function (e.g., square)</li>
                  <li>• <strong>Parameters:</strong> Input values the function accepts (e.g., x)</li>
                  <li>• <strong>Body:</strong> The code that runs when the function is called</li>
                  <li>• <strong>Return value:</strong> The output of the function</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">💡 Why Use Functions?</h3>
                <ul className="space-y-1 text-purple-700 dark:text-purple-300 text-sm">
                  <li>• <strong>Reusability:</strong> Write code once, use it many times</li>
                  <li>• <strong>Modularity:</strong> Break complex problems into smaller parts</li>
                  <li>• <strong>Readability:</strong> Makes code easier to understand</li>
                  <li>• <strong>Maintainability:</strong> Easier to fix bugs and make changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'arrays-lists',
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
                  Arrays and lists are collections that store multiple values in a single variable. They are used to store related data of the same type.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
{`# Creating a list
arr = [1, 2, 3, 4, 5]

# Accessing elements
print(arr[0])  # 1 (first element)

# Iterating through the list
for num in arr:
    print(num)`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python lists are dynamic and can hold different types.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-3 rounded">
{`// Creating an array
int[] arr = {1, 2, 3, 4, 5};

// Accessing elements
System.out.println(arr[0]);  // 1

// Iterating through the array
for (int num : arr) {
    System.out.println(num);
}`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java arrays have fixed size and type.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-3 rounded">
{`#include <stdio.h>

int main() {
    // Creating an array
    int arr[] = {1, 2, 3, 4, 5};
    
    // Accessing elements
    printf("%d\\n", arr[0]);  // 1
    
    // Iterating through the array
    for (int i = 0; i < 5; i++) {
        printf("%d\\n", arr[i]);
    }
    return 0;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C arrays have fixed size and type.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🧠 Common Array Operations:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-green-700 dark:text-green-300 text-sm">
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>Accessing:</strong> arr[index]</li>
                      <li>• <strong>Updating:</strong> arr[index] = value</li>
                      <li>• <strong>Length:</strong> len(arr) or arr.length</li>
                      <li>• <strong>Adding:</strong> arr.append(value) (Python)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>Slicing:</strong> arr[start:end] (Python)</li>
                      <li>• <strong>Sorting:</strong> sort(arr) or arr.sort()</li>
                      <li>• <strong>Searching:</strong> arr.index(value) (Python)</li>
                      <li>• <strong>Removing:</strong> arr.remove(value) (Python)</li>
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
      id: 'strings',
      title: 'Strings',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-cyan-800 dark:text-cyan-200 mb-4 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Strings
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-cyan-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">📝 Task: Reverse a string</h3>
                <p className="text-cyan-700 dark:text-cyan-300 text-sm mb-4">
                  Strings are sequences of characters. They are used to store and manipulate text data. Let's see how to work with strings in different languages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Python:</h3>
                  <pre className="text-blue-700 dark:text-blue-300 text-sm bg-white dark:bg-blue-800/20 p-3 rounded">
{`# String reversal
s = "hello"
reversed_s = s[::-1]  # Using slicing
print(reversed_s)  # "olleh"

# String operations
print(len(s))         # 5 (length)
print(s.upper())      # "HELLO"
print(s + " world")   # "hello world"
print("e" in s)       # True`}
                  </pre>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    <strong>Note:</strong> Python has powerful string slicing and built-in methods.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Java:</h3>
                  <pre className="text-orange-700 dark:text-orange-300 text-xs bg-white dark:bg-orange-800/20 p-3 rounded">
{`// String reversal
String s = "hello";
String reversed = new StringBuilder(s)
    .reverse().toString();
System.out.println(reversed);  // "olleh"

// String operations
System.out.println(s.length());  // 5
System.out.println(s.toUpperCase());  // "HELLO"
System.out.println(s + " world");  // "hello world"
System.out.println(s.contains("e"));  // true`}
                  </pre>
                  <p className="text-orange-700 dark:text-orange-300 text-xs mt-2">
                    <strong>Note:</strong> Java has StringBuilder for efficient string manipulation.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">C:</h3>
                  <pre className="text-gray-700 dark:text-gray-300 text-xs bg-white dark:bg-gray-800/20 p-3 rounded">
{`#include <string.h>
#include <stdio.h>

int main() {
    // String reversal
    char s[] = "hello";
    int len = strlen(s);
    
    // Print in reverse
    for (int i = len - 1; i >= 0; i--) {
        printf("%c", s[i]);
    }
    printf("\\n");  // "olleh"
    
    // String operations
    printf("%d\\n", len);  // 5 (length)
    return 0;
}`}
                  </pre>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-2">
                    <strong>Note:</strong> C strings are character arrays terminated by '\0'.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Common String Operations:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-yellow-700 dark:text-yellow-300 text-sm">
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>Length:</strong> Finding string length</li>
                      <li>• <strong>Concatenation:</strong> Joining strings</li>
                      <li>• <strong>Substring:</strong> Getting part of a string</li>
                      <li>• <strong>Search:</strong> Finding characters/substrings</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>Case conversion:</strong> upper/lower</li>
                      <li>• <strong>Trim:</strong> Removing whitespace</li>
                      <li>• <strong>Replace:</strong> Substituting characters</li>
                      <li>• <strong>Split:</strong> Breaking into parts</li>
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
      title: 'Simple Problems to Practice',
      completed: false,
      content: (
        <div className="space-y-6">
          <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-violet-800 dark:text-violet-200 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Simple Problems to Practice
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-violet-800/30 p-4 rounded-lg">
                <h3 className="font-semibold text-violet-800 dark:text-violet-200 mb-2">🎯 Practice Makes Perfect</h3>
                <p className="text-violet-700 dark:text-violet-300 text-sm mb-4">
                  Now that you've learned the basics, it's time to practice with some simple problems. Try solving these in all three languages to build your skills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Problem 1: Reverse a String</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                    Write a function that takes a string as input and returns the string reversed.
                  </p>
                  <div className="bg-white dark:bg-blue-800/20 p-2 rounded">
                    <p className="text-blue-700 dark:text-blue-300 text-xs">
                      <strong>Example:</strong> Input: "hello" → Output: "olleh"
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Problem 2: Find the Maximum</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                    Write a function that finds the maximum value in an array/list of numbers.
                  </p>
                  <div className="bg-white dark:bg-green-800/20 p-2 rounded">
                    <p className="text-green-700 dark:text-green-300 text-xs">
                      <strong>Example:</strong> Input: [3, 7, 2, 9, 1] → Output: 9
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Problem 3: Print Even Numbers</h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-2">
                    Write a program that prints all even numbers from 1 to N.
                  </p>
                  <div className="bg-white dark:bg-yellow-800/20 p-2 rounded">
                    <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                      <strong>Example:</strong> Input: 10 → Output: 2, 4, 6, 8, 10
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Problem 4: Sum of Array</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                    Write a function that calculates the sum of all elements in an array/list.
                  </p>
                  <div className="bg-white dark:bg-red-800/20 p-2 rounded">
                    <p className="text-red-700 dark:text-red-300 text-xs">
                      <strong>Example:</strong> Input: [1, 2, 3, 4, 5] → Output: 15
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Problem 5: Count Vowels</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm mb-2">
                  Write a function that counts the number of vowels (a, e, i, o, u) in a string.
                </p>
                <div className="bg-white dark:bg-purple-800/20 p-2 rounded mb-3">
                  <p className="text-purple-700 dark:text-purple-300 text-xs">
                    <strong>Example:</strong> Input: "hello world" → Output: 3
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-800/50 p-3 rounded">
                  <p className="text-purple-800 dark:text-purple-200 text-xs font-medium">Python Solution:</p>
                  <pre className="text-purple-700 dark:text-purple-300 text-xs bg-white dark:bg-purple-800/20 p-2 rounded mt-1">
{`def count_vowels(s):
    vowels = "aeiouAEIOU"
    count = 0
    for char in s:
        if char in vowels:
            count += 1
    return count

print(count_vowels("hello world"))  # 3`}
                  </pre>
                </div>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">💡 Practice Tips:</h3>
                <ul className="space-y-1 text-teal-700 dark:text-teal-300 text-sm">
                  <li>• Try to solve each problem in all three languages</li>
                  <li>• Start by writing pseudocode before actual code</li>
                  <li>• Test your solutions with different inputs</li>
                  <li>• Don't worry about efficiency at first - focus on correctness</li>
                  <li>• If you get stuck, break the problem into smaller steps</li>
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
              <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Programming 101 - Final Notes</h2>
            </div>
            
            <div className="bg-white dark:bg-emerald-800/30 p-6 rounded-lg mb-6">
              <blockquote className="text-lg text-emerald-800 dark:text-emerald-200 font-medium italic text-center">
                "Mistakes are expected — debugging is part of learning. Always test with sample inputs. Once comfortable with this foundation, head to Problem Solving Foundations."
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
                  <li>• Working with variables and different data types</li>
                  <li>• Reading input and producing output</li>
                  <li>• Using conditionals to make decisions</li>
                  <li>• Creating loops to repeat actions</li>
                  <li>• Writing functions to organize code</li>
                  <li>• Working with arrays/lists and strings</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Programming Cycle
                </h3>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>1. <strong>Understand the problem</strong> - What are you trying to solve?</li>
                  <li>2. <strong>Plan your solution</strong> - How will you approach it?</li>
                  <li>3. <strong>Write the code</strong> - Implement your solution</li>
                  <li>4. <strong>Test and debug</strong> - Find and fix errors</li>
                  <li>5. <strong>Refine and optimize</strong> - Make your code better</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Remember:</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                You don't need to master everything before solving problems. Learn just enough to write simple logic, and grow from there. Solving problems is how you actually learn.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🚀 Next Steps:</h3>
              <ul className="space-y-1 text-indigo-700 dark:text-indigo-300 text-sm">
                <li>• Practice the example problems in all three languages</li>
                <li>• Try solving simple problems on coding platforms</li>
                <li>• Read and understand code written by others</li>
                <li>• Move on to the Problem Solving Foundations course</li>
                <li>• Join programming communities to ask questions and share knowledge</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg text-center">
              <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                Congratulations on completing Programming 101!
              </p>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">
                You now have the foundation to start your programming journey.
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
                disabled={currentSectionIndex === sections.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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