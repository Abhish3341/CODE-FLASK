const mongoose = require('mongoose');
require('dotenv').config();

// Import the model after ensuring it's not already compiled
require('../models/Problems');
const Problem = mongoose.model('Problem');

const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    difficulty: "Easy",
    category: "Arrays",
    constraints: `2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= target <= 109
Only one valid answer exists.`,
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    testCases: [
      {
        input: "4\n2 7 11 15\n9",
        output: "0 1",
        isHidden: false
      },
      {
        input: "3\n3 2 4\n6",
        output: "1 2",
        isHidden: false
      }
    ]
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    difficulty: "Easy",
    category: "Strings",
    constraints: `1 <= s.length <= 105
s[i] is a printable ascii character.`,
    sampleInput: '["h","e","l","l","o"]',
    sampleOutput: '["o","l","l","e","h"]',
    testCases: [
      {
        input: "hello",
        output: "olleh",
        isHidden: false
      },
      {
        input: "world",
        output: "dlrow",
        isHidden: false
      }
    ]
  },
  {
    title: "Binary Search",
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target,
write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.
You must write an algorithm with O(log n) runtime complexity.`,
    difficulty: "Medium",
    category: "Binary Search",
    constraints: `1 <= nums.length <= 104
-104 < nums[i], target < 104
All the integers in nums are unique.
nums is sorted in ascending order.`,
    sampleInput: "nums = [-1,0,3,5,9,12], target = 9",
    sampleOutput: "4",
    testCases: [
      {
        input: "6\n-1 0 3 5 9 12\n9",
        output: "4",
        isHidden: false
      },
      {
        input: "6\n-1 0 3 5 9 12\n2",
        output: "-1",
        isHidden: false
      }
    ]
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
    const problems = await Problem.insertMany(sampleProblems);
    console.log(`Inserted ${problems.length} problems`);

    await mongoose.disconnect();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedProblems();