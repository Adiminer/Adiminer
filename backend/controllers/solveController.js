const Problem = require('../models/Problem');
const Solution = require('../models/Solution');

// Dummy AI solver - will be replaced with real AI integration later
const dummySolver = (problemText) => {
  const steps = [
    {
      stepNumber: 1,
      description: "Analyze the problem",
      explanation: "First, we need to understand what the problem is asking for."
    },
    {
      stepNumber: 2,
      description: "Identify key information",
      explanation: "Extract the relevant data and variables from the problem statement."
    },
    {
      stepNumber: 3,
      description: "Apply appropriate method",
      explanation: "Use the most suitable mathematical or logical approach to solve this problem."
    },
    {
      stepNumber: 4,
      description: "Calculate the result",
      explanation: "Perform the necessary calculations to arrive at the final answer."
    }
  ];

  return {
    answer: "This is a placeholder solution for the problem. Real AI integration will provide actual solutions.",
    steps: steps,
    confidence: Math.floor(Math.random() * 20) + 80 // Random confidence between 80-100
  };
};

const solveProblem = async (req, res) => {
  try {
    const { text, type = 'text' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Problem text is required'
      });
    }

    // Create new problem record
    const problem = new Problem({
      text,
      type
    });

    const savedProblem = await problem.save();

    // Generate solution using dummy solver
    const solutionData = dummySolver(text);

    // Create solution record
    const solution = new Solution({
      problemId: savedProblem._id,
      answer: solutionData.answer,
      steps: solutionData.steps,
      confidence: solutionData.confidence
    });

    const savedSolution = await solution.save();

    res.status(200).json({
      success: true,
      data: {
        problemId: savedProblem._id,
        problem: text,
        solution: savedSolution.answer,
        steps: savedSolution.steps,
        confidence: savedSolution.confidence
      }
    });

  } catch (error) {
    console.error('Error solving problem:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  solveProblem
};