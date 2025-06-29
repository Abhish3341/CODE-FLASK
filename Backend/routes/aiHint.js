const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Problem = require('../models/Problems');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Hint endpoint with enhanced functionality
router.post('/hint', authMiddleware, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // Validate required fields
    if (!problemId || !language) {
      return res.status(400).json({
        error: 'Missing required fields: problemId and language are required'
      });
    }

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    let hint = '';
    let isAIGenerated = false;

    // Try AI hint first if code is provided and OpenAI is configured
    if (code && code.trim() && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        // Create AI prompt
        const prompt = `You are an AI assistant helping users solve coding problems on an online judge platform called CodeFlask.

Problem Title: ${problem.title}
Problem Difficulty: ${problem.difficulty}
Problem Category: ${problem.category}

Problem Description:
${problem.description}

The user is coding in ${language.toUpperCase()} and wrote the following code (may be partial, incomplete, or have errors):
\`\`\`${language}
${code}
\`\`\`

IMPORTANT GUIDELINES:
- Give a helpful, beginner-friendly hint that guides them toward the solution
- DO NOT provide the complete solution or full working code
- Focus on conceptual understanding and problem-solving approach
- Suggest algorithmic thinking, data structures, or debugging strategies
- Keep the hint concise (2-3 sentences maximum)
- Encourage independent problem-solving
- If the code has obvious syntax errors, mention them briefly
- If the approach seems wrong, suggest a better direction without giving away the answer

Provide a helpful hint:`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful coding mentor who provides hints without giving away complete solutions. Focus on guiding users toward understanding rather than providing answers."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        hint = completion.choices[0].message.content.trim();
        isAIGenerated = true;
        console.log(`🤖 AI hint generated for problem ${problemId} by user ${req.user.id}`);

      } catch (aiError) {
        console.error('AI hint generation failed:', aiError);
        // Fall back to manual hint
        isAIGenerated = false;
      }
    }

    // If AI hint failed or wasn't attempted, provide manual hint based on problem
    if (!hint) {
      hint = generateManualHint(problem, language, code);
      isAIGenerated = false;
      console.log(`💡 Manual hint generated for problem ${problemId} by user ${req.user.id}`);
    }

    res.json({
      hint,
      problemTitle: problem.title,
      language,
      timestamp: new Date().toISOString(),
      isAIGenerated,
      fallbackHint: !isAIGenerated ? hint : undefined
    });

  } catch (error) {
    console.error('❌ Hint Error:', error);

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'AI hint service is temporarily unavailable due to quota limits.',
        fallbackHint: 'Consider the problem step by step. Look at the examples and think about what pattern or algorithm might solve this efficiently.'
      });
    }

    if (error.code === 'invalid_api_key') {
      return res.status(503).json({
        error: 'AI hint service configuration error.',
        fallbackHint: 'Try to identify the core logic needed. Break the problem into smaller parts and solve each step.'
      });
    }

    // Generic fallback
    res.status(500).json({
      error: 'Failed to generate hint',
      fallbackHint: 'Think about the problem requirements carefully. Consider what data structure or algorithm would be most appropriate for this type of problem.'
    });
  }
});

// Generate manual hint based on problem characteristics
function generateManualHint(problem, language, code) {
  const title = problem.title.toLowerCase();
  const description = problem.description.toLowerCase();
  const category = problem.category.toLowerCase();
  const difficulty = problem.difficulty.toLowerCase();

  // Analyze code if provided
  const hasCode = code && code.trim();
  const codeAnalysis = hasCode ? analyzeCode(code, language) : null;

  // Generate hints based on problem patterns
  if (title.includes('two sum') || title.includes('pair')) {
    if (codeAnalysis?.hasNestedLoops) {
      return "You're using nested loops which works but isn't optimal. Consider using a hash map to store values you've seen and check if the complement exists in O(1) time.";
    }
    return "Think about using a hash map to store numbers you've seen. For each number, check if its complement (target - current) exists in the map.";
  }

  if (title.includes('palindrome')) {
    if (codeAnalysis?.hasStringReversal) {
      return "Reversing the string works, but try the two-pointer approach: compare characters from both ends moving inward.";
    }
    return "Use two pointers - one at the start and one at the end. Compare characters and move pointers inward until they meet.";
  }

  if (title.includes('roman to integer')) {
    return "Roman numerals have a special rule: when a smaller value comes before a larger one, it represents subtraction. Otherwise, it's addition. Process the string from right to left to handle this elegantly.";
  }

  if (title.includes('valid parentheses')) {
    return "Consider using a stack data structure. Push opening brackets onto the stack, and when you encounter a closing bracket, check if it matches the most recent opening bracket.";
  }

  if (title.includes('merge two sorted')) {
    return "Since both lists are already sorted, you can compare the current nodes from each list and always pick the smaller one to add to your result list.";
  }

  if (title.includes('binary search') || category.includes('binary search')) {
    return "Remember the binary search pattern: compare with middle element, then search left or right half. Keep track of your bounds carefully.";
  }

  if (title.includes('linked list')) {
    if (codeAnalysis?.hasArrayAccess) {
      return "You can't access linked list elements by index like arrays. Use pointers to traverse: current = current.next.";
    }
    return "For linked list problems, consider using two pointers (slow/fast) or keeping track of previous nodes for modifications.";
  }

  if (category.includes('dynamic programming') || title.includes('dp')) {
    return "Break this into smaller subproblems. What's the base case? How does each step build on previous results? Consider memoization.";
  }

  if (category.includes('tree') || title.includes('tree')) {
    return "Tree problems often use recursion. Think about what you do at each node, then apply the same logic to left and right subtrees.";
  }

  if (category.includes('graph')) {
    return "Graph problems typically use BFS (shortest path) or DFS (exploring all paths). Consider which traversal method fits your problem.";
  }

  if (title.includes('sort') || category.includes('sorting')) {
    return "Consider the time complexity requirements. Built-in sort is O(n log n), but sometimes you can achieve O(n) with counting sort or bucket sort.";
  }

  if (title.includes('string') || category.includes('string')) {
    if (codeAnalysis?.hasStringConcatenation) {
      return "String concatenation in loops can be inefficient. Consider using a list/array to collect parts, then join at the end.";
    }
    return "For string problems, consider character frequency counting, sliding window technique, or two-pointer approaches.";
  }

  // Difficulty-based hints
  if (difficulty === 'easy') {
    return "Start with the most straightforward approach. Focus on correctness first, then optimize if needed. Check the examples carefully.";
  } else if (difficulty === 'medium') {
    return "This likely requires a specific algorithm or data structure. Think about the time complexity constraints and what approach would be most efficient.";
  } else if (difficulty === 'hard') {
    return "Hard problems often combine multiple concepts. Break it down into smaller parts, consider edge cases, and think about advanced techniques like DP or complex data structures.";
  }

  // Generic fallback based on code analysis
  if (codeAnalysis) {
    if (codeAnalysis.hasSyntaxIssues) {
      return "Check your syntax carefully - there might be missing brackets, semicolons, or incorrect indentation affecting your logic.";
    }
    if (codeAnalysis.hasLogicStructure) {
      return "Your code structure looks good. Focus on the algorithm logic - are you handling all the edge cases mentioned in the problem?";
    }
  }

  // Ultimate fallback
  return "Read the problem statement carefully and trace through the examples step by step. What pattern do you notice? What data structure would help you implement this pattern efficiently?";
}

// Simple code analysis helper
function analyzeCode(code, language) {
  const codeLines = code.toLowerCase().split('\n');
  const codeText = code.toLowerCase();

  return {
    hasNestedLoops: /for.*for|while.*while|for.*while|while.*for/.test(codeText),
    hasStringReversal: /reverse/.test(codeText) || codeText.includes('[::-1]'),
    hasArrayAccess: /\[\d+\]|\[.*\]/.test(codeText),
    hasStringConcatenation: /\+.*["']|["'].*\+/.test(codeText),
    hasSyntaxIssues: checkSyntaxIssues(code, language),
    hasLogicStructure: /if|for|while|function|def|class/.test(codeText),
    lineCount: codeLines.length
  };
}

function checkSyntaxIssues(code, language) {
  // Basic syntax checking
  const openBrackets = (code.match(/\{/g) || []).length;
  const closeBrackets = (code.match(/\}/g) || []).length;
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;

  return openBrackets !== closeBrackets || openParens !== closeParens;
}

// Get hint usage statistics for a user
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // This would typically come from a hints usage tracking collection
    // For now, we'll return basic stats
    res.json({
      totalHintsUsed: 0,
      hintsThisWeek: 0,
      favoriteCategories: [],
      message: 'Hint statistics tracking will be implemented in future updates'
    });
  } catch (error) {
    console.error('Error getting hint stats:', error);
    res.status(500).json({ error: 'Failed to get hint statistics' });
  }
});

module.exports = router;