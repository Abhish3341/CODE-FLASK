import { Problem } from '../models/Problems';

interface TemplateService {
  getTemplateForProblem: (language: string, problemId: string, problemData: Partial<Problem>) => string;
  detectProblemType: (title: string, description: string, category: string) => string;
}

class TemplateServiceImpl implements TemplateService {
  private templates: Record<string, Record<string, string>> = {
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
    char s[] = "Hello, World!";
    
    // Your code here
    printf("Processing string: %s\\n", s);
    
    return 0;
}`,

      math: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

/*
 * {description}
 */

int main() {
    // Example math problem
    int x = 121;
    
    // Your code here
    // For example, checking if x is a palindrome
    int original = x;
    int reversed = 0;
    
    if (x < 0) {
        printf("false\\n");
        return 0;
    }
    
    while (x > 0) {
        reversed = reversed * 10 + x % 10;
        x /= 10;
    }
    
    printf("%s\\n", original == reversed ? "true" : "false");
    return 0;
}`,

      roman: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * {description}
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
}`,

      binaryTree: `#include <stdio.h>
#include <stdlib.h>

/*
 * {description}
 */

// Definition for a binary tree node
struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

// Helper function to create a new node
struct TreeNode* newNode(int val) {
    struct TreeNode* node = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    node->val = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// Your solution function here
// For example, for inorder traversal:
void inorderTraversal(struct TreeNode* root, int* result, int* resultSize) {
    if (root == NULL) return;
    
    inorderTraversal(root->left, result, resultSize);
    result[(*resultSize)++] = root->val;
    inorderTraversal(root->right, result, resultSize);
}

int main() {
    // Create a sample binary tree
    struct TreeNode* root = newNode(1);
    root->right = newNode(2);
    root->right->left = newNode(3);
    
    // Call your solution
    int result[100];
    int resultSize = 0;
    inorderTraversal(root, result, &resultSize);
    
    // Print result
    printf("[");
    for (int i = 0; i < resultSize; i++) {
        printf("%d", result[i]);
        if (i < resultSize - 1) printf(",");
    }
    printf("]\\n");
    
    // Free memory
    // (In a real solution, you would need a proper function to free the tree)
    
    return 0;
}`,

      linkedList: `#include <stdio.h>
#include <stdlib.h>

/*
 * {description}
 */

// Definition for singly-linked list
struct ListNode {
    int val;
    struct ListNode *next;
};

// Helper function to create a new node
struct ListNode* newNode(int val) {
    struct ListNode* node = (struct ListNode*)malloc(sizeof(struct ListNode));
    node->val = val;
    node->next = NULL;
    return node;
}

// Helper function to create a linked list from an array
struct ListNode* createList(int* arr, int size) {
    if (size == 0) return NULL;
    
    struct ListNode* head = newNode(arr[0]);
    struct ListNode* current = head;
    
    for (int i = 1; i < size; i++) {
        current->next = newNode(arr[i]);
        current = current->next;
    }
    
    return head;
}

// Helper function to print a linked list
void printList(struct ListNode* head) {
    printf("[");
    while (head != NULL) {
        printf("%d", head->val);
        if (head->next != NULL) printf(",");
        head = head->next;
    }
    printf("]\\n");
}

// Your solution function here
// For example, for merging two sorted lists:
struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {
    // Your code here
    return NULL; // Placeholder
}

int main() {
    // Example: Merge two sorted lists
    int arr1[] = {1, 2, 4};
    int arr2[] = {1, 3, 4};
    
    struct ListNode* list1 = createList(arr1, sizeof(arr1) / sizeof(arr1[0]));
    struct ListNode* list2 = createList(arr2, sizeof(arr2) / sizeof(arr2[0]));
    
    printf("List 1: ");
    printList(list1);
    printf("List 2: ");
    printList(list2);
    
    struct ListNode* merged = mergeTwoLists(list1, list2);
    
    printf("Merged list: ");
    printList(merged);
    
    // Free memory (in a real solution, you would need to free all nodes)
    
    return 0;
}`,

      stack: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

/*
 * {description}
 */

// Simple stack implementation
#define MAX_SIZE 10000

typedef struct {
    char items[MAX_SIZE];
    int top;
} Stack;

void initStack(Stack* stack) {
    stack->top = -1;
}

bool isEmpty(Stack* stack) {
    return stack->top == -1;
}

bool isFull(Stack* stack) {
    return stack->top == MAX_SIZE - 1;
}

void push(Stack* stack, char item) {
    if (isFull(stack)) return;
    stack->items[++stack->top] = item;
}

char pop(Stack* stack) {
    if (isEmpty(stack)) return '\\0';
    return stack->items[stack->top--];
}

char peek(Stack* stack) {
    if (isEmpty(stack)) return '\\0';
    return stack->items[stack->top];
}

// Your solution function here
// For example, for valid parentheses:
bool isValid(char* s) {
    // Your code here
    return false; // Placeholder
}

int main() {
    // Example: Valid Parentheses
    char* testCases[] = {"()", "()[]{}", "(]"};
    int numTests = sizeof(testCases) / sizeof(testCases[0]);
    
    for (int i = 0; i < numTests; i++) {
        bool valid = isValid(testCases[i]);
        printf("Input: \"%s\" -> %s\\n", testCases[i], valid ? "true" : "false");
    }
    
    return 0;
}`,

      bitManipulation: `#include <stdio.h>
#include <stdlib.h>

/*
 * {description}
 */

int singleNumber(int* nums, int numsSize) {
    // Your code here
    // Hint: XOR operation can be used to find the single number
    return 0; // Placeholder
}

int main() {
    // Example: Single Number
    int nums1[] = {2, 2, 1};
    int nums2[] = {4, 1, 2, 1, 2};
    int nums3[] = {1};
    
    printf("Input: [2,2,1] -> Output: %d\\n", singleNumber(nums1, 3));
    printf("Input: [4,1,2,1,2] -> Output: %d\\n", singleNumber(nums2, 5));
    printf("Input: [1] -> Output: %d\\n", singleNumber(nums3, 1));
    
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

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {}; // No solution found
}

int main() {
    // Example: Two Sum problem
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    vector<int> result = twoSum(nums, target);
    
    cout << "Indices: [";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
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
    string s = "Hello, World!";
    
    // Your code here
    cout << "Processing string: " << s << endl;
    
    return 0;
}`,

      math: `#include <iostream>
#include <string>
#include <cmath>
using namespace std;

/*
 * {description}
 */

bool isPalindrome(int x) {
    // Your code here
    // For example, checking if x is a palindrome
    if (x < 0) return false;
    
    long reversed = 0;
    int original = x;
    
    while (x > 0) {
        reversed = reversed * 10 + x % 10;
        x /= 10;
    }
    
    return original == reversed;
}

int main() {
    // Example: Palindrome Number
    int testCases[] = {121, -121, 10};
    
    for (int x : testCases) {
        bool result = isPalindrome(x);
        cout << "Input: " << x << " -> Output: " << (result ? "true" : "false") << endl;
    }
    
    return 0;
}`,

      roman: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

/*
 * {description}
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
}`,

      binaryTree: `#include <iostream>
#include <vector>
using namespace std;

/*
 * {description}
 */

// Definition for a binary tree node
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

// Your solution function here
// For example, for inorder traversal:
vector<int> inorderTraversal(TreeNode* root) {
    vector<int> result;
    // Your code here
    return result;
}

// Helper function to create a sample tree
TreeNode* createSampleTree() {
    TreeNode* root = new TreeNode(1);
    root->right = new TreeNode(2);
    root->right->left = new TreeNode(3);
    return root;
}

// Helper function to print a vector
void printVector(const vector<int>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); i++) {
        cout << vec[i];
        if (i < vec.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    // Create a sample binary tree
    TreeNode* root = createSampleTree();
    
    // Call your solution
    vector<int> result = inorderTraversal(root);
    
    // Print result
    cout << "Inorder traversal: ";
    printVector(result);
    
    // Free memory (in a real solution, you would need a proper function to delete the tree)
    
    return 0;
}`,

      linkedList: `#include <iostream>
#include <vector>
using namespace std;

/*
 * {description}
 */

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

// Helper function to create a linked list from a vector
ListNode* createList(const vector<int>& values) {
    if (values.empty()) return nullptr;
    
    ListNode* head = new ListNode(values[0]);
    ListNode* current = head;
    
    for (size_t i = 1; i < values.size(); i++) {
        current->next = new ListNode(values[i]);
        current = current->next;
    }
    
    return head;
}

// Helper function to print a linked list
void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val;
        if (head->next) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

// Your solution function here
// For example, for merging two sorted lists:
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Your code here
    return nullptr; // Placeholder
}

int main() {
    // Example: Merge two sorted lists
    vector<int> arr1 = {1, 2, 4};
    vector<int> arr2 = {1, 3, 4};
    
    ListNode* list1 = createList(arr1);
    ListNode* list2 = createList(arr2);
    
    cout << "List 1: ";
    printList(list1);
    cout << "List 2: ";
    printList(list2);
    
    ListNode* merged = mergeTwoLists(list1, list2);
    
    cout << "Merged list: ";
    printList(merged);
    
    // Free memory (in a real solution, you would need to free all nodes)
    
    return 0;
}`,

      stack: `#include <iostream>
#include <stack>
#include <string>
#include <vector>
using namespace std;

/*
 * {description}
 */

// Your solution function here
// For example, for valid parentheses:
bool isValid(string s) {
    // Your code here
    return false; // Placeholder
}

int main() {
    // Example: Valid Parentheses
    vector<string> testCases = {"()", "()[]{}", "(]"};
    
    for (const string& test : testCases) {
        bool valid = isValid(test);
        cout << "Input: \"" << test << "\" -> " << (valid ? "true" : "false") << endl;
    }
    
    return 0;
}`,

      bitManipulation: `#include <iostream>
#include <vector>
using namespace std;

/*
 * {description}
 */

int singleNumber(vector<int>& nums) {
    // Your code here
    // Hint: XOR operation can be used to find the single number
    return 0; // Placeholder
}

int main() {
    // Example: Single Number
    vector<int> nums1 = {2, 2, 1};
    vector<int> nums2 = {4, 1, 2, 1, 2};
    vector<int> nums3 = {1};
    
    cout << "Input: [2,2,1] -> Output: " << singleNumber(nums1) << endl;
    cout << "Input: [4,1,2,1,2] -> Output: " << singleNumber(nums2) << endl;
    cout << "Input: [1] -> Output: " << singleNumber(nums3) << endl;
    
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
    
    public static int[] twoSum(int[] nums, int target) {
        // Your code here
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] {i, j};
                }
            }
        }
        return new int[] {}; // No solution found
    }
    
    public static void main(String[] args) {
        // Example: Two Sum problem
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = twoSum(nums, target);
        
        System.out.print("Indices: [");
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
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
        String s = "Hello, World!";
        
        // Your code here
        System.out.println("Processing string: " + s);
    }
}`,

      math: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    public static boolean isPalindrome(int x) {
        // Your code here
        // For example, checking if x is a palindrome
        if (x < 0) return false;
        
        int reversed = 0;
        int original = x;
        
        while (x > 0) {
            reversed = reversed * 10 + x % 10;
            x /= 10;
        }
        
        return original == reversed;
    }
    
    public static void main(String[] args) {
        // Example: Palindrome Number
        int[] testCases = {121, -121, 10};
        
        for (int x : testCases) {
            boolean result = isPalindrome(x);
            System.out.println("Input: " + x + " -> Output: " + result);
        }
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
}`,

      binaryTree: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    // Definition for a binary tree node
    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode() {}
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }
    
    // Your solution function here
    // For example, for inorder traversal:
    public static List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        // Your code here
        return result;
    }
    
    // Helper function to create a sample tree
    public static TreeNode createSampleTree() {
        TreeNode root = new TreeNode(1);
        root.right = new TreeNode(2);
        root.right.left = new TreeNode(3);
        return root;
    }
    
    public static void main(String[] args) {
        // Create a sample binary tree
        TreeNode root = createSampleTree();
        
        // Call your solution
        List<Integer> result = inorderTraversal(root);
        
        // Print result
        System.out.print("Inorder traversal: [");
        for (int i = 0; i < result.size(); i++) {
            System.out.print(result.get(i));
            if (i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,

      linkedList: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    // Definition for singly-linked list
    public static class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }
    
    // Helper function to create a linked list from an array
    public static ListNode createList(int[] values) {
        if (values.length == 0) return null;
        
        ListNode head = new ListNode(values[0]);
        ListNode current = head;
        
        for (int i = 1; i < values.length; i++) {
            current.next = new ListNode(values[i]);
            current = current.next;
        }
        
        return head;
    }
    
    // Helper function to print a linked list
    public static void printList(ListNode head) {
        System.out.print("[");
        while (head != null) {
            System.out.print(head.val);
            if (head.next != null) System.out.print(",");
            head = head.next;
        }
        System.out.println("]");
    }
    
    // Your solution function here
    // For example, for merging two sorted lists:
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your code here
        return null; // Placeholder
    }
    
    public static void main(String[] args) {
        // Example: Merge two sorted lists
        int[] arr1 = {1, 2, 4};
        int[] arr2 = {1, 3, 4};
        
        ListNode list1 = createList(arr1);
        ListNode list2 = createList(arr2);
        
        System.out.print("List 1: ");
        printList(list1);
        System.out.print("List 2: ");
        printList(list2);
        
        ListNode merged = mergeTwoLists(list1, list2);
        
        System.out.print("Merged list: ");
        printList(merged);
    }
}`,

      stack: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    // Your solution function here
    // For example, for valid parentheses:
    public static boolean isValid(String s) {
        // Your code here
        return false; // Placeholder
    }
    
    public static void main(String[] args) {
        // Example: Valid Parentheses
        String[] testCases = {"()", "()[]{}", "(]"};
        
        for (String test : testCases) {
            boolean valid = isValid(test);
            System.out.println("Input: \"" + test + "\" -> " + valid);
        }
    }
}`,

      bitManipulation: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * {description}
     */
    
    public static int singleNumber(int[] nums) {
        // Your code here
        // Hint: XOR operation can be used to find the single number
        return 0; // Placeholder
    }
    
    public static void main(String[] args) {
        // Example: Single Number
        int[] nums1 = {2, 2, 1};
        int[] nums2 = {4, 1, 2, 1, 2};
        int[] nums3 = {1};
        
        System.out.println("Input: [2,2,1] -> Output: " + singleNumber(nums1));
        System.out.println("Input: [4,1,2,1,2] -> Output: " + singleNumber(nums2));
        System.out.println("Input: [1] -> Output: " + singleNumber(nums3));
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
    return []  # No solution found

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
    s = "Hello, World!"
    result = process_string(s)
    print(f"Input: {s}")
    print(f"Output: {result}")`,

      math: `"""
{description}
"""

def is_palindrome(x):
    # Your code here
    # For example, checking if x is a palindrome
    if x < 0:
        return False
    
    original = x
    reversed_num = 0
    
    while x > 0:
        reversed_num = reversed_num * 10 + x % 10
        x //= 10
    
    return original == reversed_num

# Test your solution
if __name__ == "__main__":
    # Example test cases
    test_cases = [121, -121, 10]
    
    for x in test_cases:
        result = is_palindrome(x)
        print(f"Input: {x} -> Output: {result}")`,

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
        print(f"Error: {e}")`,

      binaryTree: `"""
{description}
"""

# Definition for a binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Your solution function here
# For example, for inorder traversal:
def inorder_traversal(root):
    result = []
    # Your code here
    return result

# Helper function to create a sample tree
def create_sample_tree():
    root = TreeNode(1)
    root.right = TreeNode(2)
    root.right.left = TreeNode(3)
    return root

# Test your solution
if __name__ == "__main__":
    # Create a sample binary tree
    root = create_sample_tree()
    
    # Call your solution
    result = inorder_traversal(root)
    
    # Print result
    print(f"Inorder traversal: {result}")`,

      linkedList: `"""
{description}
"""

# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Helper function to create a linked list from a list
def create_list(values):
    if not values:
        return None
    
    head = ListNode(values[0])
    current = head
    
    for val in values[1:]:
        current.next = ListNode(val)
        current = current.next
    
    return head

# Helper function to print a linked list
def print_list(head):
    values = []
    while head:
        values.append(head.val)
        head = head.next
    print(values)

# Your solution function here
# For example, for merging two sorted lists:
def merge_two_lists(list1, list2):
    # Your code here
    return None  # Placeholder

# Test your solution
if __name__ == "__main__":
    # Example: Merge two sorted lists
    list1 = create_list([1, 2, 4])
    list2 = create_list([1, 3, 4])
    
    print("List 1:", end=" ")
    print_list(list1)
    print("List 2:", end=" ")
    print_list(list2)
    
    merged = merge_two_lists(list1, list2)
    
    print("Merged list:", end=" ")
    print_list(merged)`,

      stack: `"""
{description}
"""

def is_valid(s):
    # Your code here
    # Hint: Use a stack to keep track of opening brackets
    return False  # Placeholder

# Test your solution
if __name__ == "__main__":
    # Example: Valid Parentheses
    test_cases = ["()", "()[]{}", "(]"]
    
    for test in test_cases:
        valid = is_valid(test)
        print(f'Input: "{test}" -> {valid}')`,

      bitManipulation: `"""
{description}
"""

def single_number(nums):
    # Your code here
    # Hint: XOR operation can be used to find the single number
    return 0  # Placeholder

# Test your solution
if __name__ == "__main__":
    # Example: Single Number
    test_cases = [
        [2, 2, 1],
        [4, 1, 2, 1, 2],
        [1]
    ]
    
    for nums in test_cases:
        result = single_number(nums)
        print(f"Input: {nums} -> Output: {result}")`
    }
  };

  detectProblemType(title: string, description: string, category: string): string {
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const catLower = category.toLowerCase();
    
    // Check for specific problem types
    if (titleLower.includes('roman')) {
      return 'roman';
    }
    
    if (titleLower.includes('binary tree') || catLower.includes('binary tree')) {
      return 'binaryTree';
    }
    
    if (titleLower.includes('linked list') || catLower.includes('linked list')) {
      return 'linkedList';
    }
    
    if (titleLower.includes('valid parentheses') || catLower.includes('stack')) {
      return 'stack';
    }
    
    if (titleLower.includes('single number') || catLower.includes('bit')) {
      return 'bitManipulation';
    }
    
    if (titleLower.includes('string') || catLower.includes('string') || descLower.includes('substring')) {
      return 'string';
    }
    
    if (titleLower.includes('palindrome') || titleLower.includes('sqrt') || catLower.includes('math')) {
      return 'math';
    }
    
    if (titleLower.includes('array') || catLower.includes('array') || 
        titleLower.includes('sum') || titleLower.includes('search') ||
        catLower.includes('two pointers')) {
      return 'array';
    }
    
    return 'basic';
  }

  getTemplateForProblem(language: string, problemId: string, problemData: Partial<Problem>): string {
    try {
      const problemType = this.detectProblemType(
        problemData.title || '', 
        problemData.description || '', 
        problemData.category || ''
      );
      
      const template = this.templates[language]?.[problemType] || this.templates[language]?.basic;
      
      if (!template) {
        throw new Error(`Template not found for language: ${language}`);
      }
      
      return template
        .replace(/{description}/g, problemData.description?.split('\n')[0] || problemData.title || '');
    } catch (error) {
      console.error(`Error generating template for ${language}:`, error);
      return this.templates[language]?.basic || `// Template not available for ${language}`;
    }
  }
}

export default new TemplateServiceImpl();