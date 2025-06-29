const mongoose = require('mongoose');
require('dotenv').config();

// Import the model after ensuring it's not already compiled
require('../models/Problems');
const Problem = mongoose.model('Problem');

const problems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 49,
    totalSubmissions: 1000000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    constraints: "• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.",
    followUp: "Can you come up with an algorithm that is less than O(n²) time complexity?"
  },
  {
    title: "Palindrome Number",
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

A palindrome is a number that reads the same backward as forward.

Example 1:
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

Example 2:
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

Example 3:
Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.

Constraints:
• -2^31 <= x <= 2^31 - 1

Follow up: Could you solve it without converting the integer to a string?`,
    difficulty: "Easy",
    category: "Math",
    acceptance: 52,
    totalSubmissions: 900000,
    version: "multi-language",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome."
      }
    ],
    constraints: "• -2^31 <= x <= 2^31 - 1",
    followUp: "Could you solve it without converting the integer to a string?"
  },
  {
    title: "Roman to Integer",
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000

For example, 2 is written as II in Roman numeral, just two ones added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

• I can be placed before V (5) and X (10) to make 4 and 9.
• X can be placed before L (50) and C (100) to make 40 and 90.
• C can be placed before D (500) and M (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.

Example 1:
Input: s = "III"
Output: 3
Explanation: III = 3.

Example 2:
Input: s = "LVIII"
Output: 58
Explanation: L = 50, V= 5, III = 3.

Example 3:
Input: s = "MCMXCIV"
Output: 1994
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.

Constraints:
• 1 <= s.length <= 15
• s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
• It is guaranteed that s is a valid roman numeral in the range [1, 3999].`,
    difficulty: "Easy",
    category: "Math",
    acceptance: 58,
    totalSubmissions: 700000,
    version: "multi-language",
    examples: [
      {
        input: "s = \"III\"",
        output: "3",
        explanation: "III = 3."
      },
      {
        input: "s = \"LVIII\"",
        output: "58",
        explanation: "L = 50, V= 5, III = 3."
      },
      {
        input: "s = \"MCMXCIV\"",
        output: "1994",
        explanation: "M = 1000, CM = 900, XC = 90 and IV = 4."
      }
    ],
    constraints: "• 1 <= s.length <= 15\n• s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').\n• It is guaranteed that s is a valid roman numeral in the range [1, 3999].",
    followUp: ""
  },
  {
    title: "Longest Common Prefix",
    description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

Example 1:
Input: strs = ["flower","flow","flight"]
Output: "fl"

Example 2:
Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.

Constraints:
• 1 <= strs.length <= 200
• 0 <= strs[i].length <= 200
• strs[i] consists of only lowercase English letters.`,
    difficulty: "Easy",
    category: "Strings",
    acceptance: 40,
    totalSubmissions: 850000,
    version: "multi-language",
    examples: [
      {
        input: "strs = [\"flower\",\"flow\",\"flight\"]",
        output: "\"fl\"",
        explanation: ""
      },
      {
        input: "strs = [\"dog\",\"racecar\",\"car\"]",
        output: "\"\"",
        explanation: "There is no common prefix among the input strings."
      }
    ],
    constraints: "• 1 <= strs.length <= 200\n• 0 <= strs[i].length <= 200\n• strs[i] consists of only lowercase English letters.",
    followUp: ""
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Constraints:
• 1 <= s.length <= 10^4
• s consists of parentheses only '()[]{}'.`,
    difficulty: "Easy",
    category: "Stack",
    acceptance: 40,
    totalSubmissions: 1100000,
    version: "multi-language",
    examples: [
      {
        input: "s = \"()\"",
        output: "true",
        explanation: ""
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
        explanation: ""
      },
      {
        input: "s = \"(]\"",
        output: "false",
        explanation: ""
      }
    ],
    constraints: "• 1 <= s.length <= 10^4\n• s consists of parentheses only '()[]{}'.",
    followUp: ""
  },
  {
    title: "Merge Two Sorted Lists",
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: list1 = [], list2 = []
Output: []

Example 3:
Input: list1 = [], list2 = [0]
Output: [0]

Constraints:
• The number of nodes in both lists is in the range [0, 50].
• -100 <= Node.val <= 100
• Both list1 and list2 are sorted in non-decreasing order.`,
    difficulty: "Easy",
    category: "Linked Lists",
    acceptance: 61,
    totalSubmissions: 900000,
    version: "multi-language",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: ""
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
        explanation: ""
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]",
        explanation: ""
      }
    ],
    constraints: "• The number of nodes in both lists is in the range [0, 50].\n• -100 <= Node.val <= 100\n• Both list1 and list2 are sorted in non-decreasing order.",
    followUp: ""
  },
  {
    title: "Remove Duplicates from Sorted Array",
    description: `Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.

Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the first part of the array nums. More formally, if there are k elements after removing the duplicates, then the first k elements of nums should hold the final result. It does not matter what you leave beyond the first k elements.

Return k after placing the final result in the first k slots of nums.

Do not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.

Example 1:
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

Example 2:
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).

Constraints:
• 1 <= nums.length <= 3 * 10^4
• -100 <= nums[i] <= 100
• nums is sorted in non-decreasing order.`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 50,
    totalSubmissions: 1000000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [1,1,2]",
        output: "2, nums = [1,2,_]",
        explanation: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively. It does not matter what you leave beyond the returned k (hence they are underscores)."
      },
      {
        input: "nums = [0,0,1,1,1,2,2,3,3,4]",
        output: "5, nums = [0,1,2,3,4,_,_,_,_,_]",
        explanation: "Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively. It does not matter what you leave beyond the returned k (hence they are underscores)."
      }
    ],
    constraints: "• 1 <= nums.length <= 3 * 10^4\n• -100 <= nums[i] <= 100\n• nums is sorted in non-decreasing order.",
    followUp: ""
  },
  {
    title: "Remove Element",
    description: `Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The order of the elements may be changed. Then return the number of elements in nums which are not equal to val.

Consider the number of elements in nums which are not equal to val be k, to get accepted, you need to do the following things:

• Change the array nums such that the first k elements of nums contain the elements which are not equal to val. The remaining elements of nums are not important as well as the size of nums.
• Return k.

Example 1:
Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).

Example 2:
Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).

Constraints:
• 0 <= nums.length <= 100
• 0 <= nums[i] <= 50
• 0 <= val <= 100`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 53,
    totalSubmissions: 800000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [3,2,2,3], val = 3",
        output: "2, nums = [2,2,_,_]",
        explanation: "Your function should return k = 2, with the first two elements of nums being 2. It does not matter what you leave beyond the returned k (hence they are underscores)."
      },
      {
        input: "nums = [0,1,2,2,3,0,4,2], val = 2",
        output: "5, nums = [0,1,4,0,3,_,_,_]",
        explanation: "Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4. Note that the five elements can be returned in any order. It does not matter what you leave beyond the returned k (hence they are underscores)."
      }
    ],
    constraints: "• 0 <= nums.length <= 100\n• 0 <= nums[i] <= 50\n• 0 <= val <= 100",
    followUp: ""
  },
  {
    title: "Search Insert Position",
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [1,3,5,6], target = 5
Output: 2

Example 2:
Input: nums = [1,3,5,6], target = 2
Output: 1

Example 3:
Input: nums = [1,3,5,6], target = 7
Output: 4

Constraints:
• 1 <= nums.length <= 10^4
• -10^4 <= nums[i] <= 10^4
• nums contains distinct values sorted in ascending order.
• -10^4 <= target <= 10^4`,
    difficulty: "Easy",
    category: "Binary Search",
    acceptance: 42,
    totalSubmissions: 900000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [1,3,5,6], target = 5",
        output: "2",
        explanation: ""
      },
      {
        input: "nums = [1,3,5,6], target = 2",
        output: "1",
        explanation: ""
      },
      {
        input: "nums = [1,3,5,6], target = 7",
        output: "4",
        explanation: ""
      }
    ],
    constraints: "• 1 <= nums.length <= 10^4\n• -10^4 <= nums[i] <= 10^4\n• nums contains distinct values sorted in ascending order.\n• -10^4 <= target <= 10^4",
    followUp: ""
  },
  {
    title: "Length of Last Word",
    description: `Given a string s consisting of words and spaces, return the length of the last word in the string.

A word is a maximal substring consisting of non-space characters only.

Example 1:
Input: s = "Hello World"
Output: 5
Explanation: The last word is "World" with length 5.

Example 2:
Input: s = "   fly me   to   the moon  "
Output: 4
Explanation: The last word is "moon" with length 4.

Example 3:
Input: s = "luffy is still joyboy"
Output: 6
Explanation: The last word is "joyboy" with length 6.

Constraints:
• 1 <= s.length <= 10^4
• s consists of only English letters and spaces ' '.
• There will be at least one word in s.`,
    difficulty: "Easy",
    category: "Strings",
    acceptance: 45,
    totalSubmissions: 750000,
    version: "multi-language",
    examples: [
      {
        input: "s = \"Hello World\"",
        output: "5",
        explanation: "The last word is \"World\" with length 5."
      },
      {
        input: "s = \"   fly me   to   the moon  \"",
        output: "4",
        explanation: "The last word is \"moon\" with length 4."
      },
      {
        input: "s = \"luffy is still joyboy\"",
        output: "6",
        explanation: "The last word is \"joyboy\" with length 6."
      }
    ],
    constraints: "• 1 <= s.length <= 10^4\n• s consists of only English letters and spaces ' '.\n• There will be at least one word in s.",
    followUp: ""
  },
  {
    title: "Plus One",
    description: `You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0's.

Increment the large integer by one and return the resulting array of digits.

Example 1:
Input: digits = [1,2,3]
Output: [1,2,4]
Explanation: The array represents the integer 123.
Incrementing by one gives 123 + 1 = 124.
Thus, the result should be [1,2,4].

Example 2:
Input: digits = [4,3,2,1]
Output: [4,3,2,2]
Explanation: The array represents the integer 4321.
Incrementing by one gives 4321 + 1 = 4322.
Thus, the result should be [4,3,2,2].

Example 3:
Input: digits = [9]
Output: [1,0]
Explanation: The array represents the integer 9.
Incrementing by one gives 9 + 1 = 10.
Thus, the result should be [1,0].

Constraints:
• 1 <= digits.length <= 100
• 0 <= digits[i] <= 9
• digits does not contain any leading 0's.`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 43,
    totalSubmissions: 800000,
    version: "multi-language",
    examples: [
      {
        input: "digits = [1,2,3]",
        output: "[1,2,4]",
        explanation: "The array represents the integer 123. Incrementing by one gives 123 + 1 = 124. Thus, the result should be [1,2,4]."
      },
      {
        input: "digits = [4,3,2,1]",
        output: "[4,3,2,2]",
        explanation: "The array represents the integer 4321. Incrementing by one gives 4321 + 1 = 4322. Thus, the result should be [4,3,2,2]."
      },
      {
        input: "digits = [9]",
        output: "[1,0]",
        explanation: "The array represents the integer 9. Incrementing by one gives 9 + 1 = 10. Thus, the result should be [1,0]."
      }
    ],
    constraints: "• 1 <= digits.length <= 100\n• 0 <= digits[i] <= 9\n• digits does not contain any leading 0's.",
    followUp: ""
  },
  {
    title: "Add Binary",
    description: `Given two binary strings a and b, return their sum as a binary string.

Example 1:
Input: a = "11", b = "1"
Output: "100"

Example 2:
Input: a = "1010", b = "1011"
Output: "10101"

Constraints:
• 1 <= a.length, b.length <= 10^4
• a and b consist only of '0' or '1' characters.
• Each string does not contain leading zeros except for the zero itself.`,
    difficulty: "Easy",
    category: "Math",
    acceptance: 50,
    totalSubmissions: 700000,
    version: "multi-language",
    examples: [
      {
        input: "a = \"11\", b = \"1\"",
        output: "\"100\"",
        explanation: ""
      },
      {
        input: "a = \"1010\", b = \"1011\"",
        output: "\"10101\"",
        explanation: ""
      }
    ],
    constraints: "• 1 <= a.length, b.length <= 10^4\n• a and b consist only of '0' or '1' characters.\n• Each string does not contain leading zeros except for the zero itself.",
    followUp: ""
  },
  {
    title: "Sqrt(x)",
    description: `Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.

You must not use any built-in exponent function or operator.

For example, do not use pow(x, 0.5) in c++ or x ** 0.5 in python.

Example 1:
Input: x = 4
Output: 2
Explanation: The square root of 4 is 2, so we return 2.

Example 2:
Input: x = 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.

Constraints:
• 0 <= x <= 2^31 - 1`,
    difficulty: "Easy",
    category: "Math",
    acceptance: 37,
    totalSubmissions: 850000,
    version: "multi-language",
    examples: [
      {
        input: "x = 4",
        output: "2",
        explanation: "The square root of 4 is 2, so we return 2."
      },
      {
        input: "x = 8",
        output: "2",
        explanation: "The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned."
      }
    ],
    constraints: "• 0 <= x <= 2^31 - 1",
    followUp: "Can you implement a solution with O(log x) time complexity?"
  },
  {
    title: "Climbing Stairs",
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example 1:
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

Example 2:
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step

Constraints:
• 1 <= n <= 45`,
    difficulty: "Easy",
    category: "Dynamic Programming",
    acceptance: 51,
    totalSubmissions: 950000,
    version: "multi-language",
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps"
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step"
      }
    ],
    constraints: "• 1 <= n <= 45",
    followUp: "Can you solve it with O(1) space complexity?"
  },
  {
    title: "Merge Sorted Array",
    description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.

Example 1:
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.

Example 2:
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: The arrays we are merging are [1] and [].
The result of the merge is [1].

Example 3:
Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: The arrays we are merging are [] and [1].
The result of the merge is [1].
Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.

Constraints:
• nums1.length == m + n
• nums2.length == n
• 0 <= m, n <= 200
• 1 <= m + n <= 200
• -10^9 <= nums1[i], nums2[j] <= 10^9`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 45,
    totalSubmissions: 850000,
    version: "multi-language",
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        explanation: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1."
      },
      {
        input: "nums1 = [1], m = 1, nums2 = [], n = 0",
        output: "[1]",
        explanation: "The arrays we are merging are [1] and []. The result of the merge is [1]."
      },
      {
        input: "nums1 = [0], m = 0, nums2 = [1], n = 1",
        output: "[1]",
        explanation: "The arrays we are merging are [] and [1]. The result of the merge is [1]. Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1."
      }
    ],
    constraints: "• nums1.length == m + n\n• nums2.length == n\n• 0 <= m, n <= 200\n• 1 <= m + n <= 200\n• -10^9 <= nums1[i], nums2[j] <= 10^9",
    followUp: "Can you come up with an algorithm that runs in O(m + n) time?"
  },
  {
    title: "Binary Tree Inorder Traversal",
    description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Example 1:
Input: root = [1,null,2,3]
Output: [1,3,2]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [1]
Output: [1]

Constraints:
• The number of nodes in the tree is in the range [0, 100].
• -100 <= Node.val <= 100`,
    difficulty: "Easy",
    category: "Binary Tree",
    acceptance: 72,
    totalSubmissions: 950000,
    version: "multi-language",
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: ""
      },
      {
        input: "root = []",
        output: "[]",
        explanation: ""
      },
      {
        input: "root = [1]",
        output: "[1]",
        explanation: ""
      }
    ],
    constraints: "• The number of nodes in the tree is in the range [0, 100].\n• -100 <= Node.val <= 100",
    followUp: "Can you solve it iteratively?"
  },
  {
    title: "Symmetric Tree",
    description: `Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).

Example 1:
Input: root = [1,2,2,3,4,4,3]
Output: true

Example 2:
Input: root = [1,2,2,null,3,null,3]
Output: false

Constraints:
• The number of nodes in the tree is in the range [1, 1000].
• -100 <= Node.val <= 100`,
    difficulty: "Easy",
    category: "Binary Tree",
    acceptance: 52,
    totalSubmissions: 900000,
    version: "multi-language",
    examples: [
      {
        input: "root = [1,2,2,3,4,4,3]",
        output: "true",
        explanation: ""
      },
      {
        input: "root = [1,2,2,null,3,null,3]",
        output: "false",
        explanation: ""
      }
    ],
    constraints: "• The number of nodes in the tree is in the range [1, 1000].\n• -100 <= Node.val <= 100",
    followUp: "Could you solve it both recursively and iteratively?"
  },
  {
    title: "Maximum Depth of Binary Tree",
    description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: 3

Example 2:
Input: root = [1,null,2]
Output: 2

Constraints:
• The number of nodes in the tree is in the range [0, 10^4].
• -100 <= Node.val <= 100`,
    difficulty: "Easy",
    category: "Binary Tree",
    acceptance: 72,
    totalSubmissions: 1000000,
    version: "multi-language",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
        explanation: ""
      },
      {
        input: "root = [1,null,2]",
        output: "2",
        explanation: ""
      }
    ],
    constraints: "• The number of nodes in the tree is in the range [0, 10^4].\n• -100 <= Node.val <= 100",
    followUp: ""
  },
  {
    title: "Convert Sorted Array to Binary Search Tree",
    description: `Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.

A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.

Example 1:
Input: nums = [-10,-3,0,5,9]
Output: [0,-3,9,-10,null,5]
Explanation: [0,-10,5,null,-3,null,9] is also accepted:

Example 2:
Input: nums = [1,3]
Output: [3,1]
Explanation: [1,null,3] and [3,1] are both height-balanced BSTs.

Constraints:
• 1 <= nums.length <= 10^4
• -10^4 <= nums[i] <= 10^4
• nums is sorted in a strictly increasing order.`,
    difficulty: "Easy",
    category: "Binary Search Tree",
    acceptance: 65,
    totalSubmissions: 800000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [-10,-3,0,5,9]",
        output: "[0,-3,9,-10,null,5]",
        explanation: "[0,-10,5,null,-3,null,9] is also accepted"
      },
      {
        input: "nums = [1,3]",
        output: "[3,1]",
        explanation: "[1,null,3] and [3,1] are both height-balanced BSTs."
      }
    ],
    constraints: "• 1 <= nums.length <= 10^4\n• -10^4 <= nums[i] <= 10^4\n• nums is sorted in a strictly increasing order.",
    followUp: ""
  },
  {
    title: "Balanced Binary Tree",
    description: `Given a binary tree, determine if it is height-balanced.

A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.

Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: true

Example 2:
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false

Example 3:
Input: root = []
Output: true

Constraints:
• The number of nodes in the tree is in the range [0, 5000].
• -10^4 <= Node.val <= 10^4`,
    difficulty: "Easy",
    category: "Binary Tree",
    acceptance: 48,
    totalSubmissions: 850000,
    version: "multi-language",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "true",
        explanation: ""
      },
      {
        input: "root = [1,2,2,3,3,null,null,4,4]",
        output: "false",
        explanation: ""
      },
      {
        input: "root = []",
        output: "true",
        explanation: ""
      }
    ],
    constraints: "• The number of nodes in the tree is in the range [0, 5000].\n• -10^4 <= Node.val <= 10^4",
    followUp: ""
  },
  {
    title: "Minimum Depth of Binary Tree",
    description: `Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.

Note: A leaf is a node with no children.

Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: 2

Example 2:
Input: root = [2,null,3,null,4,null,5,null,6]
Output: 5

Constraints:
• The number of nodes in the tree is in the range [0, 10^5].
• -1000 <= Node.val <= 1000`,
    difficulty: "Easy",
    category: "Binary Tree",
    acceptance: 43,
    totalSubmissions: 800000,
    version: "multi-language",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "2",
        explanation: ""
      },
      {
        input: "root = [2,null,3,null,4,null,5,null,6]",
        output: "5",
        explanation: ""
      }
    ],
    constraints: "• The number of nodes in the tree is in the range [0, 10^5].\n• -1000 <= Node.val <= 1000",
    followUp: ""
  },
  {
    title: "Path Sum",
    description: `Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.

A leaf is a node with no children.

Example 1:
Input: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
Output: true
Explanation: The root-to-leaf path with the target sum is shown.

Example 2:
Input: root = [1,2,3], targetSum = 5
Output: false
Explanation: There two root-to-leaf paths in the tree:
(1 --> 2): The sum is 3.
(1 --> 3): The sum is 4.
There is no root-to-leaf path with sum = 5.

Example 3:
Input: root = [], targetSum = 0
Output: false
Explanation: Since the tree is empty, there are no root-to-leaf paths.

Constraints:
• The number of nodes in the tree is in the range [0, 5000].
• -1000 <= Node.val <= 1000
• -1000 <= targetSum <= 1000`,
    difficulty: "Easy",
    category: "Binary Tree",
    acceptance: 47,
    totalSubmissions: 900000,
    version: "multi-language",
    examples: [
      {
        input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22",
        output: "true",
        explanation: "The root-to-leaf path with the target sum is shown."
      },
      {
        input: "root = [1,2,3], targetSum = 5",
        output: "false",
        explanation: "There two root-to-leaf paths in the tree:\n(1 --> 2): The sum is 3.\n(1 --> 3): The sum is 4.\nThere is no root-to-leaf path with sum = 5."
      },
      {
        input: "root = [], targetSum = 0",
        output: "false",
        explanation: "Since the tree is empty, there are no root-to-leaf paths."
      }
    ],
    constraints: "• The number of nodes in the tree is in the range [0, 5000].\n• -1000 <= Node.val <= 1000\n• -1000 <= targetSum <= 1000",
    followUp: ""
  },
  {
    title: "Pascal's Triangle",
    description: `Given an integer numRows, return the first numRows of Pascal's triangle.

In Pascal's triangle, each number is the sum of the two numbers directly above it as shown:

Example 1:
Input: numRows = 5
Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]

Example 2:
Input: numRows = 1
Output: [[1]]

Constraints:
• 1 <= numRows <= 30`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 65,
    totalSubmissions: 750000,
    version: "multi-language",
    examples: [
      {
        input: "numRows = 5",
        output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
        explanation: ""
      },
      {
        input: "numRows = 1",
        output: "[[1]]",
        explanation: ""
      }
    ],
    constraints: "• 1 <= numRows <= 30",
    followUp: ""
  },
  {
    title: "Pascal's Triangle II",
    description: `Given an integer rowIndex, return the rowIndexth (0-indexed) row of the Pascal's triangle.

In Pascal's triangle, each number is the sum of the two numbers directly above it as shown:

Example 1:
Input: rowIndex = 3
Output: [1,3,3,1]

Example 2:
Input: rowIndex = 0
Output: [1]

Example 3:
Input: rowIndex = 1
Output: [1,1]

Constraints:
• 0 <= rowIndex <= 33`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 58,
    totalSubmissions: 650000,
    version: "multi-language",
    examples: [
      {
        input: "rowIndex = 3",
        output: "[1,3,3,1]",
        explanation: ""
      },
      {
        input: "rowIndex = 0",
        output: "[1]",
        explanation: ""
      },
      {
        input: "rowIndex = 1",
        output: "[1,1]",
        explanation: ""
      }
    ],
    constraints: "• 0 <= rowIndex <= 33",
    followUp: "Could you optimize your algorithm to use only O(rowIndex) extra space?"
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.

Constraints:
• 1 <= prices.length <= 10^5
• 0 <= prices[i] <= 10^4`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 54,
    totalSubmissions: 1200000,
    version: "multi-language",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0."
      }
    ],
    constraints: "• 1 <= prices.length <= 10^5\n• 0 <= prices[i] <= 10^4",
    followUp: ""
  },
  {
    title: "Valid Palindrome",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.

Example 1:
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Example 2:
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

Example 3:
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.

Constraints:
• 1 <= s.length <= 2 * 10^5
• s consists only of printable ASCII characters.`,
    difficulty: "Easy",
    category: "Two Pointers",
    acceptance: 43,
    totalSubmissions: 1100000,
    version: "multi-language",
    examples: [
      {
        input: "s = \"A man, a plan, a canal: Panama\"",
        output: "true",
        explanation: "\"amanaplanacanalpanama\" is a palindrome."
      },
      {
        input: "s = \"race a car\"",
        output: "false",
        explanation: "\"raceacar\" is not a palindrome."
      },
      {
        input: "s = \" \"",
        output: "true",
        explanation: "s is an empty string \"\" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome."
      }
    ],
    constraints: "• 1 <= s.length <= 2 * 10^5\n• s consists only of printable ASCII characters.",
    followUp: ""
  },
  {
    title: "Single Number",
    description: `Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.

Example 1:
Input: nums = [2,2,1]
Output: 1

Example 2:
Input: nums = [4,1,2,1,2]
Output: 4

Example 3:
Input: nums = [1]
Output: 1

Constraints:
• 1 <= nums.length <= 3 * 10^4
• -3 * 10^4 <= nums[i] <= 3 * 10^4
• Each element in the array appears twice except for one element which appears only once.`,
    difficulty: "Easy",
    category: "Bit Manipulation",
    acceptance: 69,
    totalSubmissions: 1000000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [2,2,1]",
        output: "1",
        explanation: ""
      },
      {
        input: "nums = [4,1,2,1,2]",
        output: "4",
        explanation: ""
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: ""
      }
    ],
    constraints: "• 1 <= nums.length <= 3 * 10^4\n• -3 * 10^4 <= nums[i] <= 3 * 10^4\n• Each element in the array appears twice except for one element which appears only once.",
    followUp: ""
  },
  {
    title: "Linked List Cycle",
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.

Return true if there is a cycle in the linked list. Otherwise, return false.

Example 1:
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).

Example 2:
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.

Example 3:
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.

Constraints:
• The number of the nodes in the list is in the range [0, 10^4].
• -10^5 <= Node.val <= 10^5
• pos is -1 or a valid index in the linked-list.`,
    difficulty: "Easy",
    category: "Linked Lists",
    acceptance: 46,
    totalSubmissions: 1100000,
    version: "multi-language",
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
      },
      {
        input: "head = [1,2], pos = 0",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 0th node."
      },
      {
        input: "head = [1], pos = -1",
        output: "false",
        explanation: "There is no cycle in the linked list."
      }
    ],
    constraints: "• The number of the nodes in the list is in the range [0, 10^4].\n• -10^5 <= Node.val <= 10^5\n• pos is -1 or a valid index in the linked-list.",
    followUp: "Can you solve it using O(1) (i.e. constant) memory?"
  },
  {
    title: "Intersection of Two Linked Lists",
    description: `Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.

For example, the following two linked lists begin to intersect at node c1:

The test cases are generated such that there are no cycles anywhere in the entire linked structure.

Note that the linked lists must retain their original structure after the function returns.

Example 1:
Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
Output: Intersected at '8'
Explanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect).
From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,6,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.

Example 2:
Input: intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
Output: Intersected at '2'
Explanation: The intersected node's value is 2 (note that this must not be 0 if the two lists intersect).
From the head of A, it reads as [1,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.

Example 3:
Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
Output: No intersection
Explanation: From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.
Explanation: The two lists do not intersect, so return null.

Constraints:
• The number of nodes of listA is in the m.
• The number of nodes of listB is in the n.
• 1 <= m, n <= 3 * 10^4
• 1 <= Node.val <= 10^5
• 0 <= skipA < m
• 0 <= skipB < n
• intersectVal is 0 if listA and listB do not intersect.
• intersectVal == listA[skipA] == listB[skipB] if listA and listB intersect.`,
    difficulty: "Easy",
    category: "Linked Lists",
    acceptance: 51,
    totalSubmissions: 850000,
    version: "multi-language",
    examples: [
      {
        input: "intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3",
        output: "Intersected at '8'",
        explanation: "The intersected node's value is 8 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,6,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B."
      },
      {
        input: "intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1",
        output: "Intersected at '2'",
        explanation: "The intersected node's value is 2 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [1,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B."
      },
      {
        input: "intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2",
        output: "No intersection",
        explanation: "From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values. The two lists do not intersect, so return null."
      }
    ],
    constraints: "• The number of nodes of listA is in the m.\n• The number of nodes of listB is in the n.\n• 1 <= m, n <= 3 * 10^4\n• 1 <= Node.val <= 10^5\n• 0 <= skipA < m\n• 0 <= skipB < n\n• intersectVal is 0 if listA and listB do not intersect.\n• intersectVal == listA[skipA] == listB[skipB] if listA and listB intersect.",
    followUp: "Could you write a solution that runs in O(m + n) time and use only O(1) memory?"
  },
  {
    title: "Majority Element",
    description: `Given an array nums of size n, return the majority element.

The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.

Example 1:
Input: nums = [3,2,3]
Output: 3

Example 2:
Input: nums = [2,2,1,1,1,2,2]
Output: 2

Constraints:
• n == nums.length
• 1 <= n <= 5 * 10^4
• -10^9 <= nums[i] <= 10^9`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 62,
    totalSubmissions: 950000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [3,2,3]",
        output: "3",
        explanation: ""
      },
      {
        input: "nums = [2,2,1,1,1,2,2]",
        output: "2",
        explanation: ""
      }
    ],
    constraints: "• n == nums.length\n• 1 <= n <= 5 * 10^4\n• -10^9 <= nums[i] <= 10^9",
    followUp: "Could you solve the problem in linear time and in O(1) space?"
  },
  {
    title: "Excel Sheet Column Number",
    description: `Given a string columnTitle that represents the column title as appears in an Excel sheet, return its corresponding column number.

For example:
A -> 1
B -> 2
C -> 3
...
Z -> 26
AA -> 27
AB -> 28 
...

Example 1:
Input: columnTitle = "A"
Output: 1

Example 2:
Input: columnTitle = "AB"
Output: 28

Example 3:
Input: columnTitle = "ZY"
Output: 701

Constraints:
• 1 <= columnTitle.length <= 7
• columnTitle consists only of uppercase English letters.
• columnTitle is in the range ["A", "FXSHRXW"].`,
    difficulty: "Easy",
    category: "Math",
    acceptance: 60,
    totalSubmissions: 700000,
    version: "multi-language",
    examples: [
      {
        input: "columnTitle = \"A\"",
        output: "1",
        explanation: ""
      },
      {
        input: "columnTitle = \"AB\"",
        output: "28",
        explanation: ""
      },
      {
        input: "columnTitle = \"ZY\"",
        output: "701",
        explanation: ""
      }
    ],
    constraints: "• 1 <= columnTitle.length <= 7\n• columnTitle consists only of uppercase English letters.\n• columnTitle is in the range [\"A\", \"FXSHRXW\"].",
    followUp: ""
  },
  {
    title: "Happy Number",
    description: `Write an algorithm to determine if a number n is happy.

A happy number is a number defined by the following process:
• Starting with any positive integer, replace the number by the sum of the squares of its digits.
• Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
• Those numbers for which this process ends in 1 are happy.

Return true if n is a happy number, and false if not.

Example 1:
Input: n = 19
Output: true
Explanation:
1² + 9² = 82
8² + 2² = 68
6² + 8² = 100
1² + 0² + 0² = 1

Example 2:
Input: n = 2
Output: false

Constraints:
• 1 <= n <= 2^31 - 1`,
    difficulty: "Easy",
    category: "Hash Table",
    acceptance: 54,
    totalSubmissions: 800000,
    version: "multi-language",
    examples: [
      {
        input: "n = 19",
        output: "true",
        explanation: "1² + 9² = 82\n8² + 2² = 68\n6² + 8² = 100\n1² + 0² + 0² = 1"
      },
      {
        input: "n = 2",
        output: "false",
        explanation: ""
      }
    ],
    constraints: "• 1 <= n <= 2^31 - 1",
    followUp: ""
  },
  {
    title: "Reverse Linked List",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Example 1:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Example 2:
Input: head = [1,2]
Output: [2,1]

Example 3:
Input: head = []
Output: []

Constraints:
• The number of nodes in the list is the range [0, 5000].
• -5000 <= Node.val <= 5000`,
    difficulty: "Easy",
    category: "Linked Lists",
    acceptance: 70,
    totalSubmissions: 1500000,
    version: "multi-language",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: ""
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation: ""
      },
      {
        input: "head = []",
        output: "[]",
        explanation: ""
      }
    ],
    constraints: "• The number of nodes in the list is the range [0, 5000].\n• -5000 <= Node.val <= 5000",
    followUp: "A linked list can be reversed either iteratively or recursively. Could you implement both?"
  },
  {
    title: "Contains Duplicate",
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

Example 1:
Input: nums = [1,2,3,1]
Output: true

Example 2:
Input: nums = [1,2,3,4]
Output: false

Example 3:
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true

Constraints:
• 1 <= nums.length <= 10^5
• -10^9 <= nums[i] <= 10^9`,
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 60,
    totalSubmissions: 1200000,
    version: "multi-language",
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: ""
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: ""
      },
      {
        input: "nums = [1,1,1,3,3,4,3,2,4,2]",
        output: "true",
        explanation: ""
      }
    ],
    constraints: "• 1 <= nums.length <= 10^5\n• -10^9 <= nums[i] <= 10^9",
    followUp: ""
  }
];

async function seedProblems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    // Insert sample problems
    const insertedProblems = await Problem.insertMany(problems);
    console.log(`Inserted ${insertedProblems.length} problems`);

    await mongoose.disconnect();
    console.log('Database seeded successfully with new problems supporting all 4 languages (C, C++, Java, Python)');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedProblems();