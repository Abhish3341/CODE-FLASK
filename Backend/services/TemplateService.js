const fs = require('fs').promises;
const path = require('path');

class TemplateService {
  constructor() {
    this.templates = {
      python: {
        basic: `def solution():
    """
    {description}
    """
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`,
        
        array: `def solution():
    """
    {description}
    """
    # Example input
    {example_input}
    
    # Your code here
    {solution_hint}
    
    return []  # Return your result

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`,
        
        linkedlist: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def solution():
    """
    {description}
    """
    # Helper functions
    def list_to_linked(values):
        if not values:
            return None
        head = ListNode(values[0])
        current = head
        for val in values[1:]:
            current.next = ListNode(val)
            current = current.next
        return head
    
    def linked_to_list(node):
        result = []
        while node:
            result.append(node.val)
            node = node.next
        return result
    
    def parse_list_input(s):
        """Parse input like '[1,2,4]' or '1,2,4' into list of integers"""
        s = s.strip().replace('[', '').replace(']', '').replace(' ', '')
        if not s:
            return []
        try:
            return [int(x) for x in s.split(',') if x]
        except:
            return []
    
    # Read input from stdin if available
    import sys
    input_data = sys.stdin.read().strip()
    
    if input_data:
        try:
            lines = input_data.split('\\n')
            if len(lines) >= 2:
                list1_input = lines[0].strip()
                list2_input = lines[1].strip()
                
                list1_values = parse_list_input(list1_input)
                list2_values = parse_list_input(list2_input)
                
                print(f"Input: list1 = {list1_values}, list2 = {list2_values}")
                
                # Convert to linked lists
                list1 = list_to_linked(list1_values)
                list2 = list_to_linked(list2_values)
                
                # Merge two sorted lists solution
                dummy = ListNode()
                current = dummy
                
                while list1 and list2:
                    if list1.val <= list2.val:
                        current.next = list1
                        list1 = list1.next
                    else:
                        current.next = list2
                        list2 = list2.next
                    current = current.next
                
                current.next = list1 if list1 else list2
                
                result = linked_to_list(dummy.next)
                print(f"Output: {result}")
                return result
        except Exception as e:
            print(f"Error parsing input: {e}")
    
    # Fallback to example data
    print("Using example data:")
    list1_values = [1, 2, 4]
    list2_values = [1, 3, 4]
    print(f"Input: list1 = {list1_values}, list2 = {list2_values}")
    
    # Convert to linked lists
    list1 = list_to_linked(list1_values)
    list2 = list_to_linked(list2_values)
    
    # Merge two sorted lists solution
    dummy = ListNode()
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 if list1 else list2
    
    result = linked_to_list(dummy.next)
    print(f"Output: {result}")
    return result

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Final Result: {result}")`,
        
        string: `def solution():
    """
    {description}
    """
    # Read input from stdin if available
    import sys
    input_text = sys.stdin.read().strip()
    
    if input_text:
        s = input_text
        print(f"Input: {s}")
        
        # Your code here
        {solution_hint}
        
        result = ""  # Your result
        print(f"Output: {result}")
        return result
    
    # Fallback to example
    s = "{example_string}"
    print(f"Using example: {s}")
    
    # Your code here
    {solution_hint}
    
    result = ""
    print(f"Output: {result}")
    return result

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`,
        
        tree: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def solution():
    """
    {description}
    """
    # Helper function to build tree from array
    def build_tree(values):
        if not values:
            return None
        root = TreeNode(values[0])
        queue = [root]
        i = 1
        while queue and i < len(values):
            node = queue.pop(0)
            if i < len(values) and values[i] is not None:
                node.left = TreeNode(values[i])
                queue.append(node.left)
            i += 1
            if i < len(values) and values[i] is not None:
                node.right = TreeNode(values[i])
                queue.append(node.right)
            i += 1
        return root
    
    # Example: {example_input}
    # Your code here
    {solution_hint}
    
    return None

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`
      },
      
      javascript: {
        basic: `function solution() {
    /**
     * {description}
     */
    // Your code here
    return null;
}

// Test your solution
console.log("Result:", solution());`,
        
        array: `function solution() {
    /**
     * {description}
     */
    // Example input
    {example_input}
    
    // Your code here
    {solution_hint}
    
    return [];
}

// Test your solution
console.log("Result:", solution());`,
        
        linkedlist: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function solution() {
    /**
     * {description}
     */
    // Helper functions
    function listToLinked(values) {
        if (!values.length) return null;
        const head = new ListNode(values[0]);
        let current = head;
        for (let i = 1; i < values.length; i++) {
            current.next = new ListNode(values[i]);
            current = current.next;
        }
        return head;
    }
    
    function linkedToList(node) {
        const result = [];
        while (node) {
            result.push(node.val);
            node = node.next;
        }
        return result;
    }
    
    function parseListInput(s) {
        s = s.trim().replace(/[\\[\\]]/g, '').replace(/\\s/g, '');
        if (!s) return [];
        try {
            return s.split(',').map(x => parseInt(x)).filter(x => !isNaN(x));
        } catch (e) {
            return [];
        }
    }
    
    // Read input from stdin if available
    const fs = require('fs');
    try {
        const input = fs.readFileSync(0, 'utf-8').trim();
        if (input) {
            const lines = input.split('\\n');
            if (lines.length >= 2) {
                const list1Input = lines[0].trim();
                const list2Input = lines[1].trim();
                
                const list1Values = parseListInput(list1Input);
                const list2Values = parseListInput(list2Input);
                
                console.log(\`Input: list1 = [\${list1Values.join(',')}], list2 = [\${list2Values.join(',')}]\`);
                
                // Convert to linked lists
                const list1 = listToLinked(list1Values);
                const list2 = listToLinked(list2Values);
                
                // Merge two sorted lists solution
                const dummy = new ListNode();
                let current = dummy;
                let l1 = list1, l2 = list2;
                
                while (l1 && l2) {
                    if (l1.val <= l2.val) {
                        current.next = l1;
                        l1 = l1.next;
                    } else {
                        current.next = l2;
                        l2 = l2.next;
                    }
                    current = current.next;
                }
                
                current.next = l1 || l2;
                
                const result = linkedToList(dummy.next);
                console.log(\`Output: [\${result.join(',')}]\`);
                return result;
            }
        }
    } catch (e) {
        // Fallback to example data
    }
    
    // Fallback to example data
    console.log("Using example data:");
    const list1Values = [1, 2, 4];
    const list2Values = [1, 3, 4];
    console.log(\`Input: list1 = [\${list1Values.join(',')}], list2 = [\${list2Values.join(',')}]\`);
    
    // Convert to linked lists
    const list1 = listToLinked(list1Values);
    const list2 = listToLinked(list2Values);
    
    // Merge two sorted lists solution
    const dummy = new ListNode();
    let current = dummy;
    let l1 = list1, l2 = list2;
    
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 || l2;
    
    const result = linkedToList(dummy.next);
    console.log(\`Output: [\${result.join(',')}]\`);
    return result;
}

// Test your solution
console.log("Final Result:", solution());`,
        
        string: `function solution() {
    /**
     * {description}
     */
    // Read input from stdin if available
    const fs = require('fs');
    try {
        const input = fs.readFileSync(0, 'utf-8').trim();
        if (input) {
            console.log(\`Input: \${input}\`);
            
            // Your code here
            {solution_hint}
            
            const result = ""; // Your result
            console.log(\`Output: \${result}\`);
            return result;
        }
    } catch (e) {
        // Fallback to example
    }
    
    // Example: {example_input}
    const s = "{example_string}";
    console.log(\`Using example: \${s}\`);
    
    // Your code here
    {solution_hint}
    
    const result = "";
    console.log(\`Output: \${result}\`);
    return result;
}

// Test your solution
console.log("Result:", solution());`
      },
      
      java: {
        basic: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println("Result: " + solution.solve());
    }
}

class Solution {
    /**
     * {description}
     */
    public Object solve() {
        // Your code here
        return null;
    }
}`,
        
        array: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] result = solution.solve();
        System.out.println("Result: " + Arrays.toString(result));
    }
}

class Solution {
    /**
     * {description}
     */
    public int[] solve() {
        // Try to read from stdin first
        try {
            Scanner scanner = new Scanner(System.in);
            if (scanner.hasNextLine()) {
                String input = scanner.nextLine().trim();
                System.out.println("Input: " + input);
                
                // Parse input - example for array problems
                // Your parsing logic here
                
                // Your code here
                {solution_hint}
                
                scanner.close();
                return new int[]{};
            }
        } catch (Exception e) {
            // Fallback to example data
        }
        
        // Example input
        {example_input}
        
        // Your code here
        {solution_hint}
        
        return new int[]{};
    }
}`,
        
        linkedlist: `import java.util.*;
import java.io.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Try to read input
        try {
            Scanner scanner = new Scanner(System.in);
            StringBuilder inputBuilder = new StringBuilder();
            
            // Read all available input
            while (scanner.hasNextLine()) {
                inputBuilder.append(scanner.nextLine()).append("\\n");
            }
            
            String input = inputBuilder.toString().trim();
            if (!input.isEmpty()) {
                String[] lines = input.split("\\n");
                if (lines.length >= 2) {
                    String list1Input = lines[0].trim();
                    String list2Input = lines[1].trim();
                    
                    System.out.println("Input: list1 = " + list1Input + ", list2 = " + list2Input);
                    
                    // Parse and solve
                    int[] list1Values = parseList(list1Input);
                    int[] list2Values = parseList(list2Input);
                    
                    ListNode list1 = arrayToLinkedList(list1Values);
                    ListNode list2 = arrayToLinkedList(list2Values);
                    
                    ListNode result = solution.mergeTwoLists(list1, list2);
                    System.out.println("Output: " + linkedListToString(result));
                    
                    scanner.close();
                    return;
                }
            }
            scanner.close();
        } catch (Exception e) {
            // Fallback to example
        }
        
        // Fallback to example data
        System.out.println("Using example data:");
        System.out.println("Input: list1 = [1,2,4], list2 = [1,3,4]");
        
        int[] list1Values = {1, 2, 4};
        int[] list2Values = {1, 3, 4};
        
        ListNode list1 = arrayToLinkedList(list1Values);
        ListNode list2 = arrayToLinkedList(list2Values);
        
        ListNode result = solution.mergeTwoLists(list1, list2);
        System.out.println("Output: " + linkedListToString(result));
        System.out.println("Final Result: " + linkedListToString(result));
    }
    
    static int[] parseList(String s) {
        s = s.replaceAll("[\\[\\]]", "").trim();
        if (s.isEmpty()) return new int[0];
        try {
            String[] parts = s.split(",");
            int[] result = new int[parts.length];
            for (int i = 0; i < parts.length; i++) {
                result[i] = Integer.parseInt(parts[i].trim());
            }
            return result;
        } catch (Exception e) {
            return new int[0];
        }
    }
    
    static ListNode arrayToLinkedList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
    
    static String linkedListToString(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result.toString();
    }
}

class Solution {
    /**
     * {description}
     */
    public ListNode solve() {
        // Your code here
        return null;
    }
    
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode();
        ListNode current = dummy;
        
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }
        
        current.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`
      },
      
      cpp: {
        basic: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

class Solution {
public:
    /**
     * {description}
     */
    auto solve() {
        // Your code here
        return 0;
    }
};

int main() {
    Solution solution;
    cout << "Result: " << solution.solve() << endl;
    return 0;
}`,
        
        array: `#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
#include <string>
using namespace std;

class Solution {
public:
    /**
     * {description}
     */
    vector<int> solve() {
        // Try to read from stdin
        string line;
        if (getline(cin, line) && !line.empty()) {
            cout << "Input: " << line << endl;
            
            // Parse input
            vector<int> nums = parseArray(line);
            
            // Your code here
            {solution_hint}
            
            return {};
        }
        
        // Example input
        {example_input}
        
        // Your code here
        {solution_hint}
        
        return {};
    }
    
private:
    vector<int> parseArray(string s) {
        vector<int> result;
        // Remove brackets
        s.erase(remove(s.begin(), s.end(), '['), s.end());
        s.erase(remove(s.begin(), s.end(), ']'), s.end());
        
        if (s.empty()) return result;
        
        stringstream ss(s);
        string item;
        while (getline(ss, item, ',')) {
            if (!item.empty()) {
                try {
                    result.push_back(stoi(item));
                } catch (...) {
                    // Skip invalid numbers
                }
            }
        }
        return result;
    }
};

int main() {
    Solution solution;
    vector<int> result = solution.solve();
    cout << "Result: [";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    return 0;
}`,
        
        linkedlist: `#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <algorithm>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    /**
     * {description}
     */
    ListNode* solve() {
        // Try to read input
        string line1, line2;
        if (getline(cin, line1) && getline(cin, line2)) {
            cout << "Input: list1 = " << line1 << ", list2 = " << line2 << endl;
            
            vector<int> list1Values = parseArray(line1);
            vector<int> list2Values = parseArray(line2);
            
            ListNode* list1 = arrayToLinkedList(list1Values);
            ListNode* list2 = arrayToLinkedList(list2Values);
            
            ListNode* result = mergeTwoLists(list1, list2);
            cout << "Output: " << linkedListToString(result) << endl;
            cout << "Final Result: " << linkedListToString(result) << endl;
            
            return result;
        }
        
        // Fallback to example data
        cout << "Using example data:" << endl;
        cout << "Input: list1 = [1,2,4], list2 = [1,3,4]" << endl;
        
        vector<int> list1Values = {1, 2, 4};
        vector<int> list2Values = {1, 3, 4};
        
        ListNode* list1 = arrayToLinkedList(list1Values);
        ListNode* list2 = arrayToLinkedList(list2Values);
        
        ListNode* result = mergeTwoLists(list1, list2);
        cout << "Output: " << linkedListToString(result) << endl;
        cout << "Final Result: " << linkedListToString(result) << endl;
        
        return result;
    }
    
private:
    vector<int> parseArray(string s) {
        vector<int> result;
        s.erase(remove(s.begin(), s.end(), '['), s.end());
        s.erase(remove(s.begin(), s.end(), ']'), s.end());
        s.erase(remove(s.begin(), s.end(), ' '), s.end());
        
        if (s.empty()) return result;
        
        stringstream ss(s);
        string item;
        while (getline(ss, item, ',')) {
            if (!item.empty()) {
                try {
                    result.push_back(stoi(item));
                } catch (...) {
                    // Skip invalid numbers
                }
            }
        }
        return result;
    }
    
    ListNode* arrayToLinkedList(vector<int>& values) {
        if (values.empty()) return nullptr;
        ListNode* head = new ListNode(values[0]);
        ListNode* current = head;
        for (int i = 1; i < values.size(); i++) {
            current->next = new ListNode(values[i]);
            current = current->next;
        }
        return head;
    }
    
    string linkedListToString(ListNode* head) {
        string result = "[";
        bool first = true;
        while (head) {
            if (!first) result += ",";
            result += to_string(head->val);
            head = head->next;
            first = false;
        }
        result += "]";
        return result;
    }
    
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy;
        ListNode* current = &dummy;
        
        while (list1 && list2) {
            if (list1->val <= list2->val) {
                current->next = list1;
                list1 = list1->next;
            } else {
                current->next = list2;
                list2 = list2->next;
            }
            current = current->next;
        }
        
        current->next = list1 ? list1 : list2;
        return dummy.next;
    }
};

int main() {
    Solution solution;
    ListNode* result = solution.solve();
    return 0;
}`
      }
    };
  }

  detectProblemType(title, description, category) {
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const catLower = category.toLowerCase();
    
    // Check for specific patterns
    if (titleLower.includes('linked') || descLower.includes('linked list') || catLower.includes('linked')) {
      return 'linkedlist';
    }
    
    if (titleLower.includes('tree') || descLower.includes('binary tree') || catLower.includes('tree')) {
      return 'tree';
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
    // Extract first example from description
    const exampleMatch = description.match(/Example \d+:\s*Input:\s*([^\n]+)/i);
    if (exampleMatch) {
      return exampleMatch[1].trim();
    }
    return 'nums = [2, 7, 11, 15], target = 9';
  }

  generateSolutionHint(title, problemType) {
    const hints = {
      array: {
        'two sum': 'for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
        'default': '# Iterate through the array\n    # Apply your logic here\n    # Return the result'
      },
      linkedlist: {
        'merge': 'dummy = ListNode()\n    current = dummy\n    # Merge logic here\n    return dummy.next',
        'default': '# Process the linked list\n    # Your logic here\n    # Return modified list'
      },
      string: {
        'palindrome': '# Check if string is palindrome\n    # Compare characters from both ends',
        'default': '# Process the string\n    # Your logic here\n    # Return result'
      },
      basic: {
        'default': '# Write your solution here\n    # Return the result'
      }
    };
    
    const titleLower = title.toLowerCase();
    const typeHints = hints[problemType] || hints.basic;
    
    for (const [key, hint] of Object.entries(typeHints)) {
      if (key !== 'default' && titleLower.includes(key)) {
        return hint;
      }
    }
    
    return typeHints.default || hints.basic.default;
  }

  generateTemplate(language, problem) {
    const problemType = this.detectProblemType(problem.title, problem.description, problem.category);
    const template = this.templates[language]?.[problemType] || this.templates[language]?.basic;
    
    if (!template) {
      throw new Error(`Template not found for language: ${language}`);
    }
    
    const exampleInput = this.extractExampleFromDescription(problem.description);
    const solutionHint = this.generateSolutionHint(problem.title, problemType);
    const exampleString = problemType === 'string' ? 'hello world' : '';
    
    return template
      .replace(/{description}/g, problem.description.split('\n')[0] || problem.title)
      .replace(/{example_input}/g, `# ${exampleInput}`)
      .replace(/{solution_hint}/g, solutionHint)
      .replace(/{example_string}/g, exampleString);
  }

  // Enhanced method to get template with problem context
  getTemplateForProblem(language, problemId, problemData) {
    try {
      return this.generateTemplate(language, problemData);
    } catch (error) {
      console.error(`Error generating template for ${language}:`, error);
      // Fallback to basic template
      return this.templates[language]?.basic || `// Template not available for ${language}`;
    }
  }
}

module.exports = new TemplateService();