const fs = require('fs').promises;
const path = require('path');

class TemplateService {
  constructor() {
    this.templates = {
      c: {
        basic: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * {description}
 */

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`,
        
        array: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * {description}
 */

int main() {
    // Example: Two Sum problem
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int size = sizeof(nums) / sizeof(nums[0]);
    
    // Your code here
    for (int i = 0; i < size; i++) {
        for (int j = i + 1; j < size; j++) {
            if (nums[i] + nums[j] == target) {
                printf("Indices: [%d, %d]\\n", i, j);
                return 0;
            }
        }
    }
    
    printf("No solution found\\n");
    return 0;
}`,
        
        string: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * {description}
 */

int main() {
    // Example string processing
    char s[] = "III";
    
    // Your code here
    printf("Processing string: %s\\n", s);
    
    return 0;
}`,

        roman: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * Roman to Integer
 * Convert a roman numeral to an integer
 */

int romanToInt(char* s) {
    int values[256] = {0}; // ASCII table size
    values['I'] = 1;
    values['V'] = 5;
    values['X'] = 10;
    values['L'] = 50;
    values['C'] = 100;
    values['D'] = 500;
    values['M'] = 1000;
    
    int total = 0;
    int prevValue = 0;
    int len = strlen(s);
    
    // Process from right to left
    for (int i = len - 1; i >= 0; i--) {
        int currentValue = values[(int)s[i]];
        
        if (currentValue < prevValue) {
            total -= currentValue;
        } else {
            total += currentValue;
        }
        prevValue = currentValue;
    }
    
    return total;
}

int main() {
    // Test cases
    char* testCases[] = {"III", "LVIII", "MCMXCIV"};
    int numTests = sizeof(testCases) / sizeof(testCases[0]);
    
    for (int i = 0; i < numTests; i++) {
        int result = romanToInt(testCases[i]);
        printf("Roman: %s -> Integer: %d\\n", testCases[i], result);
    }
    
    // Test with input
    printf("\\n--- Testing with input ---\\n");
    char input[100];
    printf("Enter a Roman numeral: ");
    if (scanf("%s", input)) {
        int result = romanToInt(input);
        printf("Roman: %s -> Integer: %d\\n", input, result);
    }
    
    return 0;
}`
      },
      
      cpp: {
        basic: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

/*
 * {description}
 */

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
        
        array: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

/*
 * {description}
 */

int main() {
    // Example: Two Sum problem
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    // Your code here
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                cout << "Indices: [" << i << ", " << j << "]" << endl;
                return 0;
            }
        }
    }
    
    cout << "No solution found" << endl;
    return 0;
}`,
        
        string: `#include <iostream>
#include <string>
using namespace std;

/*
 * {description}
 */

int main() {
    // Example string processing
    string s = "III";
    
    // Your code here
    cout << "Processing string: " << s << endl;
    
    return 0;
}`,

        roman: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

/*
 * Roman to Integer
 * Convert a roman numeral to an integer
 */

int romanToInt(string s) {
    unordered_map<char, int> romanMap = {
        {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},
        {'C', 100}, {'D', 500}, {'M', 1000}
    };
    
    int total = 0;
    int prevValue = 0;
    
    // Process from right to left
    for (int i = s.length() - 1; i >= 0; i--) {
        int currentValue = romanMap[s[i]];
        
        if (currentValue < prevValue) {
            total -= currentValue;
        } else {
            total += currentValue;
        }
        prevValue = currentValue;
    }
    
    return total;
}

int main() {
    // Test cases
    vector<string> testCases = {"III", "LVIII", "MCMXCIV"};
    
    for (const string& roman : testCases) {
        int result = romanToInt(roman);
        cout << "Roman: " << roman << " -> Integer: " << result << endl;
    }
    
    // Test with input
    cout << "\\n--- Testing with input ---" << endl;
    string input;
    cout << "Enter a Roman numeral: ";
    if (cin >> input) {
        int result = romanToInt(input);
        cout << "Roman: " << input << " -> Integer: " << result << endl;
    }
    
    return 0;
}`
      },
      
      java: {
        basic: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
        
        array: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    public static void main(String[] args) {
        // Example: Two Sum problem
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        // Your code here
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    System.out.println("Indices: [" + i + ", " + j + "]");
                    return;
                }
            }
        }
        
        System.out.println("No solution found");
    }
}`,
        
        string: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    public static void main(String[] args) {
        // Example string processing
        String s = "III";
        
        // Your code here
        System.out.println("Processing string: " + s);
    }
}`,

        roman: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * Roman to Integer
     * Convert a roman numeral to an integer
     */
    
    public static int romanToInt(String s) {
        Map<Character, Integer> romanMap = new HashMap<>();
        romanMap.put('I', 1);
        romanMap.put('V', 5);
        romanMap.put('X', 10);
        romanMap.put('L', 50);
        romanMap.put('C', 100);
        romanMap.put('D', 500);
        romanMap.put('M', 1000);
        
        int total = 0;
        int prevValue = 0;
        
        // Process from right to left
        for (int i = s.length() - 1; i >= 0; i--) {
            char c = s.charAt(i);
            int value = romanMap.get(c);
            
            if (value < prevValue) {
                total -= value;
            } else {
                total += value;
            }
            prevValue = value;
        }
        
        return total;
    }
    
    public static void main(String[] args) {
        // Test cases
        String[] testCases = {"III", "LVIII", "MCMXCIV"};
        
        for (String roman : testCases) {
            int result = romanToInt(roman);
            System.out.println("Roman: " + roman + " -> Integer: " + result);
        }
        
        // Test with input
        System.out.println("\\n--- Testing with input ---");
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a Roman numeral: ");
        
        try {
            String input = scanner.nextLine().trim();
            if (!input.isEmpty()) {
                int result = romanToInt(input);
                System.out.println("Roman: " + input + " -> Integer: " + result);
            }
        } catch (Exception e) {
            System.out.println("Error reading input: " + e.getMessage());
        } finally {
            scanner.close();
        }
    }
}`
      },
      
      python: {
        basic: `"""
{description}
"""

def solution():
    # Your code here
    return "Hello, World!"

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`,
        
        array: `"""
{description}
"""

def two_sum(nums, target):
    # Your code here
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

# Test your solution
if __name__ == "__main__":
    # Example test case
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(f"Input: nums = {nums}, target = {target}")
    print(f"Output: {result}")`,
        
        string: `"""
{description}
"""

def process_string(s):
    # Your code here
    return len(s)

# Test your solution
if __name__ == "__main__":
    # Example test case
    s = "III"
    result = process_string(s)
    print(f"Input: {s}")
    print(f"Output: {result}")`,

        roman: `"""
Roman to Integer
Convert a roman numeral to an integer
"""

def roman_to_int(s):
    roman_map = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    }
    
    total = 0
    prev_value = 0
    
    # Process from right to left
    for char in reversed(s.upper()):
        value = roman_map[char]
        if value < prev_value:
            total -= value
        else:
            total += value
        prev_value = value
    
    return total

# Test your solution
if __name__ == "__main__":
    # Test cases
    test_cases = ["III", "LVIII", "MCMXCIV"]
    
    for roman in test_cases:
        result = roman_to_int(roman)
        print(f"Roman: {roman} -> Integer: {result}")
    
    # Test with input
    print("\\n--- Testing with input ---")
    try:
        user_input = input("Enter a Roman numeral: ").strip()
        if user_input:
            result = roman_to_int(user_input)
            print(f"Roman: {user_input} -> Integer: {result}")
    except (EOFError, KeyboardInterrupt):
        print("\\nInput cancelled")
    except KeyError as e:
        print(f"Invalid Roman numeral character: {e}")
    except Exception as e:
        print(f"Error: {e}")`
      }
    };
  }

  detectProblemType(title, description, category) {
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const catLower = category.toLowerCase();
    
    // Check for specific problem types
    if (titleLower.includes('roman')) {
      return 'roman';
    }
    
    if (titleLower.includes('string') || catLower.includes('string') || descLower.includes('substring')) {
      return 'string';
    }
    
    if (titleLower.includes('array') || catLower.includes('array') || descLower.includes('array') || 
        titleLower.includes('sum') || titleLower.includes('search')) {
      return 'array';
    }
    
    return 'basic';
  }

  extractExampleFromDescription(description) {
    const exampleMatch = description.match(/Example \d+:\s*Input:\s*([^\n]+)/i);
    if (exampleMatch) {
      return exampleMatch[1].trim();
    }
    return 'nums = [2, 7, 11, 15], target = 9';
  }

  generateSolutionHint(title, problemType, language) {
    const hints = {
      c: {
        array: '// Iterate through the array\n    // Apply your logic here\n    // Print the result',
        string: '// Process the string\n    // Your logic here\n    // Print result',
        roman: '// Create a mapping for roman numerals\n    // Process from right to left\n    // Handle subtraction cases',
        basic: '// Write your solution here\n    // Print the result'
      },
      cpp: {
        array: '// Iterate through the array\n    // Apply your logic here\n    // Return the result',
        string: '// Process the string\n    // Your logic here\n    // Return result',
        roman: '// Create a mapping for roman numerals\n    // Process from right to left\n    // Handle subtraction cases',
        basic: '// Write your solution here\n    // Return the result'
      },
      java: {
        array: '// Iterate through the array\n        // Apply your logic here\n        // Print the result',
        string: '// Process the string\n        // Your logic here\n        // Print result',
        roman: '// Create a HashMap for roman numerals\n        // Process from right to left\n        // Handle subtraction cases',
        basic: '// Write your solution here\n        // Print the result'
      },
      python: {
        array: '# Iterate through the array\n    # Apply your logic here\n    # Return the result',
        string: '# Process the string\n    # Your logic here\n    # Return result',
        roman: '# Create a dictionary for roman numerals\n    # Process from right to left\n    # Handle subtraction cases',
        basic: '# Write your solution here\n    # Return the result'
      }
    };
    
    const langHints = hints[language] || hints.python;
    return langHints[problemType] || langHints.basic;
  }

  generateTemplate(language, problem) {
    const problemType = this.detectProblemType(problem.title, problem.description, problem.category);
    const template = this.templates[language]?.[problemType] || this.templates[language]?.basic;
    
    if (!template) {
      throw new Error(`Template not found for language: ${language}`);
    }
    
    const exampleInput = this.extractExampleFromDescription(problem.description);
    const solutionHint = this.generateSolutionHint(problem.title, problemType, language);
    const exampleString = problemType === 'string' ? 'hello world' : '';
    
    return template
      .replace(/{description}/g, problem.description.split('\n')[0] || problem.title)
      .replace(/{example_input}/g, `// ${exampleInput}`)
      .replace(/{solution_hint}/g, solutionHint)
      .replace(/{example_string}/g, exampleString);
  }

  getTemplateForProblem(language, problemId, problemData) {
    try {
      return this.generateTemplate(language, problemData);
    } catch (error) {
      console.error(`Error generating template for ${language}:`, error);
      return this.templates[language]?.basic || `// Template not available for ${language}`;
    }
  }
}

module.exports = new TemplateService();