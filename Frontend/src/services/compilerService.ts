import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const COMPILER_API_URL = `${BACKEND_URL}/api/compiler/submit`;

interface CompileRequest {
  language: string;
  code: string;
  input?: string;
  problemId?: string;
}

interface CompileResponse {
  output: string;
  error?: string;
  executionTime?: number;
}

export const compileCode = async (request: CompileRequest): Promise<CompileResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post(COMPILER_API_URL, {
      language: request.language,
      code: request.code,
      input: request.input || '',
      problemId: request.problemId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000 // 10 second timeout
    });

    return {
      output: response.data.output,
      executionTime: response.data.executionTime
    };
  } catch (error: any) {
    console.error('Compilation error:', error);
    if (error.response) {
      // Server responded with error
      return {
        output: '',
        error: error.response.data.error || 'Server error occurred'
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        output: '',
        error: 'Request timed out. Please try again.'
      };
    } else {
      return {
        output: '',
        error: 'Failed to connect to compilation service'
      };
    }
  }
};

export const getDefaultCode = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return `def twoSum(nums, target):
    # Create a hash map to store complements
    seen = {}
    
    # Iterate through the array
    for i, num in enumerate(nums):
        complement = target - num
        
        # If complement exists in map, return indices
        if complement in seen:
            return [seen[complement], i]
            
        # Add current number and index to map
        seen[num] = i
    
    return []  # No solution found

# Example usage
nums = list(map(int, input().split()))
target = int(input())
result = twoSum(nums, target)
print(result)`;
    
    case 'javascript':
      return `function twoSum(nums, target) {
    // Create a hash map to store complements
    const seen = new Map();
    
    // Iterate through the array
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // If complement exists in map, return indices
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        
        // Add current number and index to map
        seen.set(nums[i], i);
    }
    
    return [];  // No solution found
}

// Read input
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const nums = line.split(' ').map(Number);
    rl.on('line', (target) => {
        console.log(twoSum(nums, parseInt(target)));
        rl.close();
    });
});`;
    
    case 'java':
      return `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Create a hash map to store complements
        Map<Integer, Integer> seen = new HashMap<>();
        
        // Iterate through the array
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            // If complement exists in map, return indices
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            
            // Add current number and index to map
            seen.put(nums[i], i);
        }
        
        return new int[] {};  // No solution found
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read array
        String[] input = scanner.nextLine().split(" ");
        int[] nums = new int[input.length];
        for (int i = 0; i < input.length; i++) {
            nums[i] = Integer.parseInt(input[i]);
        }
        
        // Read target
        int target = scanner.nextInt();
        
        // Find solution
        int[] result = twoSum(nums, target);
        System.out.println(Arrays.toString(result));
        
        scanner.close();
    }
}`;
    
    case 'cpp':
    default:
      return `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Create a hash map to store complements
    unordered_map<int, int> seen;
    
    // Iterate through the array
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        // If complement exists in map, return indices
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        
        // Add current number and index to map
        seen[nums[i]] = i;
    }
    
    return {};  // No solution found
}

int main() {
    // Read array size
    int n;
    cin >> n;
    
    // Read array elements
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    // Read target
    int target;
    cin >> target;
    
    // Find solution
    vector<int> result = twoSum(nums, target);
    
    // Print result
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}`;
  }
};

export const getSupportedLanguages = () => [
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'java', name: 'Java', extension: '.java' }
];