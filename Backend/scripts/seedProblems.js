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
    version: "python3"
  },
  {
    title: "Add Two Numbers",
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

Example 1:
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.

Example 2:
Input: l1 = [0], l2 = [0]
Output: [0]

Example 3:
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]

Constraints:
• The number of nodes in each linked list is in the range [1, 100].
• 0 <= Node.val <= 9
• It is guaranteed that the list represents a number that does not have leading zeros.`,
    difficulty: "Medium",
    category: "Linked Lists",
    acceptance: 38,
    totalSubmissions: 800000,
    version: "python3"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.

Constraints:
• 0 <= s.length <= 5 * 10^4
• s consists of English letters, digits, symbols and spaces.`,
    difficulty: "Medium",
    category: "Strings",
    acceptance: 33,
    totalSubmissions: 900000,
    version: "python3"
  },
  {
    title: "Median of Two Sorted Arrays",
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

Example 1:
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.

Example 2:
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.

Constraints:
• nums1.length == m
• nums2.length == n
• 0 <= m <= 1000
• 0 <= n <= 1000
• 1 <= m + n <= 2000
• -10^6 <= nums1[i], nums2[i] <= 10^6`,
    difficulty: "Hard",
    category: "Arrays",
    acceptance: 35,
    totalSubmissions: 600000,
    version: "python3"
  },
  {
    title: "Longest Palindromic Substring",
    description: `Given a string s, return the longest palindromic substring in s.

Example 1:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:
Input: s = "cbbd"
Output: "bb"

Constraints:
• 1 <= s.length <= 1000
• s consist of only digits and English letters.`,
    difficulty: "Medium",
    category: "Strings",
    acceptance: 32,
    totalSubmissions: 750000,
    version: "python3"
  },
  {
    title: "ZigZag Conversion",
    description: `The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this:

P   A   H   R
A P L S I I G
Y   I   R

And then read line by line: "PAHRAPLSIIGYIR"

Write the code that will take a string and make this conversion given a number of rows.

Example 1:
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHRAPLSIIGYIR"

Example 2:
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"

Example 3:
Input: s = "A", numRows = 1
Output: "A"

Constraints:
• 1 <= s.length <= 1000
• s consists of English letters (lower-case and upper-case), ',' and '.'.
• 1 <= numRows <= 1000`,
    difficulty: "Medium",
    category: "Strings",
    acceptance: 42,
    totalSubmissions: 500000,
    version: "python3"
  },
  {
    title: "Reverse Integer",
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).

Example 1:
Input: x = 123
Output: 321

Example 2:
Input: x = -123
Output: -321

Example 3:
Input: x = 120
Output: 21

Constraints:
• -2^31 <= x <= 2^31 - 1`,
    difficulty: "Medium",
    category: "Math",
    acceptance: 26,
    totalSubmissions: 850000,
    version: "python3"
  },
  {
    title: "String to Integer (atoi)",
    description: `Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi function).

The algorithm for myAtoi(string s) is as follows:

1. Read in and ignore any leading whitespace.
2. Check if the next character (if not already at the end of the string) is '-' or '+'. Read this character in if it is either. This determines if the final result is negative or positive respectively. Assume the result is positive if neither is present.
3. Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.
4. Convert these digits into an integer (i.e. "123" -> 123, "0032" -> 32). If no digits were read, then the integer is 0. Change the sign as necessary (from step 2).
5. If the integer is out of the 32-bit signed integer range [-2^31, 2^31 - 1], then clamp the integer so that it remains in the range. Specifically, integers less than -2^31 should be clamped to -2^31, and integers greater than 2^31 - 1 should be clamped to 2^31 - 1.
6. Return the integer as the final result.

Note:
• Only the space character ' ' is considered a whitespace character.
• Do not ignore any characters other than the leading whitespace or the rest of the string after the digits.

Example 1:
Input: s = "42"
Output: 42

Example 2:
Input: s = "   -42"
Output: -42

Example 3:
Input: s = "4193 with words"
Output: 4193

Constraints:
• 0 <= s.length <= 200
• s consists of English letters (lower-case and upper-case), digits (0-9), ' ', '+', '-', and '.'.`,
    difficulty: "Medium",
    category: "Strings",
    acceptance: 16,
    totalSubmissions: 1200000,
    version: "python3"
  },
  {
    title: "Palindrome Number",
    description: `Given an integer x, return true if x is palindrome integer.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.

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
    version: "python3"
  },
  {
    title: "Regular Expression Matching",
    description: `Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:

• '.' Matches any single character.
• '*' Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).

Example 1:
Input: s = "aa", p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".

Example 2:
Input: s = "aa", p = "a*"
Output: true
Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".

Example 3:
Input: s = "ab", p = ".*"
Output: true
Explanation: ".*" means "zero or more (*) of any character (.)".

Constraints:
• 1 <= s.length <= 20
• 1 <= p.length <= 30
• s contains only lowercase English letters.
• p contains only lowercase English letters, '.', and '*'.
• It is guaranteed for each appearance of the character '*', there will be a previous valid character to match.`,
    difficulty: "Hard",
    category: "Dynamic Programming",
    acceptance: 27,
    totalSubmissions: 700000,
    version: "python3"
  },
  {
    title: "Container With Most Water",
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

Example 1:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

Example 2:
Input: height = [1,1]
Output: 1

Constraints:
• n == height.length
• 2 <= n <= 10^5
• 0 <= height[i] <= 10^4`,
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: 54,
    totalSubmissions: 800000,
    version: "python3"
  },
  {
    title: "Integer to Roman",
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000

For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

• I can be placed before V (5) and X (10) to make 4 and 9.
• X can be placed before L (50) and C (100) to make 40 and 90.
• C can be placed before D (500) and M (1000) to make 400 and 900.

Given an integer, convert it to a roman numeral.

Example 1:
Input: num = 3
Output: "III"
Explanation: 3 is represented as 3 ones.

Example 2:
Input: num = 58
Output: "LVIII"
Explanation: L = 50, V = 5, III = 3.

Example 3:
Input: num = 1994
Output: "MCMXCIV"
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.

Constraints:
• 1 <= num <= 3999`,
    difficulty: "Medium",
    category: "Math",
    acceptance: 59,
    totalSubmissions: 600000,
    version: "python3"
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

For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

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
    version: "python3"
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
    version: "python3"
  },
  {
    title: "3Sum",
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.

Example 2:
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.

Example 3:
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.

Constraints:
• 3 <= nums.length <= 3000
• -10^5 <= nums[i] <= 10^5`,
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: 32,
    totalSubmissions: 950000,
    version: "python3"
  },
  {
    title: "3Sum Closest",
    description: `Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.

Return the sum of the three integers.

You may assume that each input would have exactly one solution.

Example 1:
Input: nums = [-1,2,1,-4], target = 1
Output: 2
Explanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

Example 2:
Input: nums = [0,0,0], target = 1
Output: 0
Explanation: The sum that is closest to the target is 0. (0 + 0 + 0 = 0).

Constraints:
• 3 <= nums.length <= 500
• -1000 <= nums[i] <= 1000
• -10^4 <= target <= 10^4`,
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: 46,
    totalSubmissions: 600000,
    version: "python3"
  },
  {
    title: "Letter Combinations of a Phone Number",
    description: `Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.

A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

2: abc
3: def
4: ghi
5: jkl
6: mno
7: pqrs
8: tuv
9: wxyz

Example 1:
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Example 2:
Input: digits = ""
Output: []

Example 3:
Input: digits = "2"
Output: ["a","b","c"]

Constraints:
• 0 <= digits.length <= 4
• digits[i] is a digit in the range ['2', '9'].`,
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: 55,
    totalSubmissions: 700000,
    version: "python3"
  },
  {
    title: "4Sum",
    description: `Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that:

• 0 <= a, b, c, d < n
• a, b, c, and d are distinct.
• nums[a] + nums[b] + nums[c] + nums[d] == target

You may return the answer in any order.

Example 1:
Input: nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]

Example 2:
Input: nums = [2,2,2,2,2], target = 8
Output: [[2,2,2,2]]

Constraints:
• 1 <= nums.length <= 200
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9`,
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: 36,
    totalSubmissions: 550000,
    version: "python3"
  },
  {
    title: "Remove Nth Node From End of List",
    description: `Given the head of a linked list, remove the nth node from the end of the list and return its head.

Example 1:
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]

Example 2:
Input: head = [1], n = 1
Output: []

Example 3:
Input: head = [1,2], n = 1
Output: [1]

Constraints:
• The number of nodes in the list is sz.
• 1 <= sz <= 30
• 0 <= Node.val <= 100
• 1 <= n <= sz

Follow up: Could you do this in one pass?`,
    difficulty: "Medium",
    category: "Linked Lists",
    acceptance: 39,
    totalSubmissions: 800000,
    version: "python3"
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
    version: "python3"
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
    version: "python3"
  },
  {
    title: "Generate Parentheses",
    description: `Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

Example 1:
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]

Example 2:
Input: n = 1
Output: ["()"]

Constraints:
• 1 <= n <= 8`,
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: 71,
    totalSubmissions: 650000,
    version: "python3"
  },
  {
    title: "Merge k Sorted Lists",
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example 1:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6

Example 2:
Input: lists = []
Output: []

Example 3:
Input: lists = [[]]
Output: []

Constraints:
• k == lists.length
• 0 <= k <= 10^4
• 0 <= lists[i].length <= 500
• -10^4 <= lists[i][j] <= 10^4
• lists[i] is sorted in ascending order.
• The sum of lists[i].length will not exceed 10^4.`,
    difficulty: "Hard",
    category: "Linked Lists",
    acceptance: 47,
    totalSubmissions: 750000,
    version: "python3"
  },
  {
    title: "Swap Nodes in Pairs",
    description: `Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)

Example 1:
Input: head = [1,2,3,4]
Output: [2,1,4,3]

Example 2:
Input: head = []
Output: []

Example 3:
Input: head = [1]
Output: [1]

Constraints:
• The number of nodes in the list is in the range [0, 100].
• 0 <= Node.val <= 100

Follow up: Can you solve the problem in O(1) extra memory space?`,
    difficulty: "Medium",
    category: "Linked Lists",
    acceptance: 58,
    totalSubmissions: 600000,
    version: "python3"
  },
  {
    title: "Reverse Nodes in k-Group",
    description: `Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.

k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.

You may not alter the values in the list's nodes, only nodes themselves may be changed.

Example 1:
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]

Example 2:
Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]

Constraints:
• The number of nodes in the list is n.
• 1 <= k <= n <= 5000
• 0 <= Node.val <= 1000

Follow-up: Can you solve the problem in O(1) extra memory space?`,
    difficulty: "Hard",
    category: "Linked Lists",
    acceptance: 53,
    totalSubmissions: 500000,
    version: "python3"
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
    version: "python3"
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
    version: "python3"
  },
  {
    title: "Find the Index of the First Occurrence in a String",
    description: `Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

Example 1:
Input: haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" occurs at index 0 and 6.
The first occurrence is at index 0, so we return 0.

Example 2:
Input: haystack = "leetcode", needle = "leeto"
Output: -1
Explanation: "leeto" did not occur in "leetcode", so we return -1.

Constraints:
• 1 <= haystack.length, needle.length <= 10^4
• haystack and needle consist of only lowercase English characters.`,
    difficulty: "Easy",
    category: "Strings",
    acceptance: 37,
    totalSubmissions: 900000,
    version: "python3"
  },
  {
    title: "Divide Two Integers",
    description: `Given two integers dividend and divisor, divide two integers without using multiplication, division, and mod operator.

The integer division should truncate toward zero, which means losing its fractional part. For example, 8.345 would be truncated to 8, and -2.7335 would be truncated to -2.

Return the quotient after dividing dividend by divisor.

Note: Assume we are dealing with an environment that could only store integers within the 32-bit signed integer range: [−2^31, 2^31 − 1]. For this problem, if the quotient is strictly greater than 2^31 - 1, then return 2^31 - 1, and if the quotient is strictly smaller than -2^31, then return -2^31.

Example 1:
Input: dividend = 10, divisor = 3
Output: 3
Explanation: 10/3 = 3.33333.. which is truncated to 3.

Example 2:
Input: dividend = 7, divisor = -3
Output: -2
Explanation: 7/-3 = -2.33333.. which is truncated to -2.

Constraints:
• -2^31 <= dividend, divisor <= 2^31 - 1
• divisor != 0`,
    difficulty: "Medium",
    category: "Math",
    acceptance: 17,
    totalSubmissions: 850000,
    version: "python3"
  },
  {
    title: "Substring with Concatenation of All Words",
    description: `You are given a string s and an array of strings words. All the strings of words are of the same length.

A concatenated substring in s is a substring that contains all the strings of any permutation of words concatenated.

For example, if words = ["ab","cd","ef"], then "abcdef", "abefcd", "cdabef", "cdefab", "efabcd", and "efcdab" are all concatenated strings. "acdbef" is not a concatenated string because it is not the concatenation of any permutation of words.

Return the starting indices of all the concatenated substrings in s. You can return the answer in any order.

Example 1:
Input: s = "barfoothefoobarman", words = ["foo","bar"]
Output: [0,9]
Explanation: The substring starting at 0 is "barfoo". It is the concatenation of ["bar","foo"] which is a permutation of words.
The substring starting at 9 is "foobar". It is the concatenation of ["foo","bar"] which is a permutation of words.

Example 2:
Input: s = "wordgoodgoodgoodbestword", words = ["word","good","best","good"]
Output: []
Explanation: Since words.length == 4 and words[i].length == 4, the concatenated substring has to be of length 16.
There is no substring of length 16 is s that is equal to the concatenation of any permutation of words.
We return an empty array.

Example 3:
Input: s = "barfoobar", words = ["foo","bar"]
Output: [0,3]
Explanation: The substring starting at 0 is "barfoo". It is the concatenation of ["bar","foo"] which is a permutation of words.
The substring starting at 3 is "foobar". It is the concatenation of ["foo","bar"] which is a permutation of words.

Constraints:
• 1 <= s.length <= 10^4
• 1 <= words.length <= 5000
• 1 <= words[i].length <= 30
• s and words[i] consist of lowercase English letters.`,
    difficulty: "Hard",
    category: "Sliding Window",
    acceptance: 30,
    totalSubmissions: 400000,
    version: "python3"
  },
  {
    title: "Next Permutation",
    description: `A permutation of an array of integers is an arrangement of its members into a sequence or linear order.

For example, for arr = [1,2,3], the following are all the permutations of arr: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1].

The next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container.

If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

For example, the next permutation of arr = [1,2,3] is [1,3,2].
Similarly, the next permutation of arr = [2,3,1] is [3,1,2].
While the next permutation of arr = [3,2,1] is [1,2,3] since [3,2,1] does not have a lexicographically larger rearrangement.

Given an array of integers nums, find the next permutation of nums.

The replacement must be in place and use only constant extra memory.

Example 1:
Input: nums = [1,2,3]
Output: [1,3,2]

Example 2:
Input: nums = [3,2,1]
Output: [1,2,3]

Example 3:
Input: nums = [1,1,5]
Output: [1,5,1]

Constraints:
• 1 <= nums.length <= 100
• 0 <= nums[i] <= 100`,
    difficulty: "Medium",
    category: "Arrays",
    acceptance: 37,
    totalSubmissions: 700000,
    version: "python3"
  },
  {
    title: "Longest Valid Parentheses",
    description: `Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.

Example 1:
Input: s = "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()".

Example 2:
Input: s = ")()())"
Output: 4
Explanation: The longest valid parentheses substring is "()()".

Example 3:
Input: s = ""
Output: 0

Constraints:
• 0 <= s.length <= 3 * 10^4
• s[i] is '(', or ')'.`,
    difficulty: "Hard",
    category: "Dynamic Programming",
    acceptance: 32,
    totalSubmissions: 600000,
    version: "python3"
  },
  {
    title: "Search in Rotated Sorted Array",
    description: `There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].

Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4

Example 2:
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1

Example 3:
Input: nums = [1], target = 0
Output: -1

Constraints:
• 1 <= nums.length <= 5000
• -10^4 <= nums[i] <= 10^4
• All values of nums are unique.
• nums is an ascending array that is possibly rotated.
• -10^4 <= target <= 10^4`,
    difficulty: "Medium",
    category: "Binary Search",
    acceptance: 38,
    totalSubmissions: 850000,
    version: "python3"
  },
  {
    title: "Find First and Last Position of Element in Sorted Array",
    description: `Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.

If target is not found in the array, return [-1, -1].

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]

Example 2:
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]

Example 3:
Input: nums = [], target = 0
Output: [-1,-1]

Constraints:
• 0 <= nums.length <= 10^5
• -10^9 <= nums[i] <= 10^9
• nums is a non-decreasing array.
• -10^9 <= target <= 10^9`,
    difficulty: "Medium",
    category: "Binary Search",
    acceptance: 42,
    totalSubmissions: 750000,
    version: "python3"
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
    version: "python3"
  },
  {
    title: "Valid Sudoku",
    description: `Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

1. Each row must contain the digits 1-9 without repetition.
2. Each column must contain the digits 1-9 without repetition.
3. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.

Note:
• A Sudoku board (partially filled) could be valid but is not necessarily solvable.
• Only the filled cells need to be validated according to the mentioned rules.

Example 1:
Input: board = 
[["5","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]]
Output: true

Example 2:
Input: board = 
[["8","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]]
Output: false
Explanation: Same as Example 1, except with the 5 in the top left corner being modified to 8. Since there are two 8's in the top left 3x3 sub-box, it is invalid.

Constraints:
• board.length == 9
• board[i].length == 9
• board[i][j] is a digit 1-9 or '.'.`,
    difficulty: "Medium",
    category: "Hash Table",
    acceptance: 56,
    totalSubmissions: 650000,
    version: "python3"
  },
  {
    title: "Sudoku Solver",
    description: `Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:

1. Each of the digits 1-9 must occur exactly once in each row.
2. Each of the digits 1-9 must occur exactly once in each column.
3. Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.

The '.' character indicates empty cells.

Example 1:
Input: board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
Output: [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
Explanation: The input board is shown above and the only valid solution is shown below:

Constraints:
• board.length == 9
• board[i].length == 9
• board[i][j] is a digit or '.'.
• It is guaranteed that the input board has only one solution.`,
    difficulty: "Hard",
    category: "Backtracking",
    acceptance: 59,
    totalSubmissions: 400000,
    version: "python3"
  },
  {
    title: "Count and Say",
    description: `The count-and-say sequence is a sequence of digit strings defined by the recursive formula:

• countAndSay(1) = "1"
• countAndSay(n) is the way you would "say" the digit string from countAndSay(n-1), which is then converted into a different digit string.

To determine how you "say" a digit string, you read it from left to right and verbally describe the digits. For example, the digit string "3322251" would be said as "two 3's, three 2's, one 5, and one 1", which can be written as "23321511".

Given a positive integer n, return the nth term of the count-and-say sequence.

Example 1:
Input: n = 1
Output: "1"
Explanation: This is the base case.

Example 2:
Input: n = 4
Output: "1211"
Explanation:
countAndSay(1) = "1"
countAndSay(2) = say "1" = one 1 = "11"
countAndSay(3) = say "11" = two 1's = "21"
countAndSay(4) = say "21" = one 2 + one 1 = "12" + "11" = "1211"

Constraints:
• 1 <= n <= 30`,
    difficulty: "Medium",
    category: "Strings",
    acceptance: 50,
    totalSubmissions: 600000,
    version: "python3"
  },
  {
    title: "Combination Sum",
    description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.

Example 1:
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.

Example 2:
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]

Example 3:
Input: candidates = [2], target = 1
Output: []

Constraints:
• 1 <= candidates.length <= 30
• 2 <= candidates[i] <= 40
• All elements of candidates are distinct.
• 1 <= target <= 40`,
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: 68,
    totalSubmissions: 700000,
    version: "python3"
  },
  {
    title: "Combination Sum II",
    description: `Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target.

Each number in candidates may only be used once in the combination.

Note: The solution set must not contain duplicate combinations.

Example 1:
Input: candidates = [10,1,2,7,6,1,5], target = 8
Output: 
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]

Example 2:
Input: candidates = [2,5,2,1,2], target = 5
Output: 
[
[1,2,2],
[5]
]

Constraints:
• 1 <= candidates.length <= 100
• 1 <= candidates[i] <= 50
• 1 <= target <= 30`,
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: 52,
    totalSubmissions: 550000,
    version: "python3"
  },
  {
    title: "First Missing Positive",
    description: `Given an unsorted integer array nums, return the smallest missing positive integer.

You must implement an algorithm that runs in O(n) time and uses constant extra space.

Example 1:
Input: nums = [1,2,0]
Output: 3
Explanation: The numbers in the range [1,2] are all in the array.

Example 2:
Input: nums = [3,4,-1,1]
Output: 2
Explanation: 1 is in the array but 2 is missing.

Example 3:
Input: nums = [7,8,9,11,12]
Output: 1
Explanation: The smallest positive integer 1 is missing.

Constraints:
• 1 <= nums.length <= 10^5
• -2^31 <= nums[i] <= 2^31 - 1`,
    difficulty: "Hard",
    category: "Arrays",
    acceptance: 36,
    totalSubmissions: 650000,
    version: "python3"
  },
  {
    title: "Trapping Rain Water",
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Example 1:
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.

Example 2:
Input: height = [4,2,0,3,2,5]
Output: 9

Constraints:
• n == height.length
• 1 <= n <= 2 * 10^4
• 0 <= height[i] <= 3 * 10^4`,
    difficulty: "Hard",
    category: "Two Pointers",
    acceptance: 58,
    totalSubmissions: 800000,
    version: "python3"
  },
  {
    title: "Multiply Strings",
    description: `Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.

Note: You must not use any built-in BigInteger library or convert the inputs to integer directly.

Example 1:
Input: num1 = "2", num2 = "3"
Output: "6"

Example 2:
Input: num1 = "123", num2 = "456"
Output: "56088"

Constraints:
• 1 <= num1.length, num2.length <= 200
• num1 and num2 consist of digits only.
• Both num1 and num2 do not contain any leading zero, except the number 0 itself.`,
    difficulty: "Medium",
    category: "Math",
    acceptance: 38,
    totalSubmissions: 600000,
    version: "python3"
  },
  {
    title: "Wildcard Matching",
    description: `Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:

• '?' Matches any single character.
• '*' Matches any sequence of characters (including the empty sequence).

The matching should cover the entire input string (not partial).

Example 1:
Input: s = "aa", p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".

Example 2:
Input: s = "aa", p = "*"
Output: true
Explanation: '*' matches any sequence.

Example 3:
Input: s = "cb", p = "?a"
Output: false
Explanation: '?' matches 'c', but the second letter is 'a', which does not match 'b'.

Constraints:
• 0 <= s.length, p.length <= 2000
• s contains only lowercase English letters.
• p contains only lowercase English letters, '?' or '*'.`,
    difficulty: "Hard",
    category: "Dynamic Programming",
    acceptance: 26,
    totalSubmissions: 500000,
    version: "python3"
  },
  {
    title: "Jump Game II",
    description: `You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0].

Each element nums[i] represents the maximum length of a forward jump from index i. In other words, if you are at nums[i], you can jump to any nums[i + j] where:

• 0 <= j <= nums[i] and
• i + j < n

Return the minimum number of jumps to reach nums[n - 1].

The test cases are generated such that you can reach nums[n - 1].

Example 1:
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.

Example 2:
Input: nums = [2,3,0,1,4]
Output: 2

Constraints:
• 1 <= nums.length <= 10^4
• 0 <= nums[i] <= 1000
• It's guaranteed that you can reach nums[n - 1].`,
    difficulty: "Medium",
    category: "Greedy",
    acceptance: 38,
    totalSubmissions: 650000,
    version: "python3"
  },
  {
    title: "Permutations",
    description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

Example 1:
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

Example 2:
Input: nums = [0,1]
Output: [[0,1],[1,0]]

Example 3:
Input: nums = [1]
Output: [[1]]

Constraints:
• 1 <= nums.length <= 6
• -10 <= nums[i] <= 10
• All the integers of nums are unique.`,
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: 74,
    totalSubmissions: 800000,
    version: "python3"
  },
  {
    title: "Permutations II",
    description: `Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations in any order.

Example 1:
Input: nums = [1,1,2]
Output:
[[1,1,2],
 [1,2,1],
 [2,1,1]]

Example 2:
Input: nums = [1,2,1,3]
Output:
[[1,1,2,3],
 [1,1,3,2],
 [1,2,1,3],
 [1,2,3,1],
 [1,3,1,2],
 [1,3,2,1],
 [2,1,1,3],
 [2,1,3,1],
 [2,3,1,1],
 [3,1,1,2],
 [3,1,2,1],
 [3,2,1,1]]

Constraints:
• 1 <= nums.length <= 8
• -10 <= nums[i] <= 10`,
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: 57,
    totalSubmissions: 600000,
    version: "python3"
  },
  {
    title: "Rotate Image",
    description: `You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.

Example 1:
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]

Example 2:
Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

Constraints:
• n == matrix.length == matrix[i].length
• 1 <= n <= 20
• -1000 <= matrix[i][j] <= 1000`,
    difficulty: "Medium",
    category: "Arrays",
    acceptance: 70,
    totalSubmissions: 750000,
    version: "python3"
  },
  {
    title: "Group Anagrams",
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Example 1:
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

Example 2:
Input: strs = [""]
Output: [[""]]

Example 3:
Input: strs = ["a"]
Output: [["a"]]

Constraints:
• 1 <= strs.length <= 10^4
• 0 <= strs[i].length <= 100
• strs[i] consists of lowercase English letters only.`,
    difficulty: "Medium",
    category: "Hash Table",
    acceptance: 67,
    totalSubmissions: 900000,
    version: "python3"
  },
  {
    title: "Pow(x, n)",
    description: `Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).

Example 1:
Input: x = 2.00000, n = 10
Output: 1024.00000

Example 2:
Input: x = 2.10000, n = 3
Output: 9.26100

Example 3:
Input: x = 2.00000, n = -2
Output: 0.25000
Explanation: 2^-2 = 1/2^2 = 1/4 = 0.25

Constraints:
• -100.0 < x < 100.0
• -2^31 <= n <= 2^31-1
• n is an integer.
• Either x is not zero or n > 0.
• -10^4 <= x^n <= 10^4`,
    difficulty: "Medium",
    category: "Math",
    acceptance: 33,
    totalSubmissions: 850000,
    version: "python3"
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
    console.log('Database seeded successfully with 50 problems');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedProblems();