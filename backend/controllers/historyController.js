const Problem = require('../models/Problem');
const Solution = require('../models/Solution');

const getHistory = async (req, res) => {
  try {
    const problems = await Problem.find()
      .sort({ createdAt: -1 })
      .limit(50);

    const historyData = await Promise.all(
      problems.map(async (problem) => {
        const solution = await Solution.findOne({ problemId: problem._id });
        
        return {
          id: problem._id,
          text: problem.text,
          type: problem.type,
          createdAt: problem.createdAt,
          solutionPreview: solution ? solution.answer.substring(0, 100) + '...' : 'No solution found',
          confidence: solution ? solution.confidence : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: historyData
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getProblemDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const solution = await Solution.findOne({ problemId: id });
    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        problem: {
          id: problem._id,
          text: problem.text,
          type: problem.type,
          createdAt: problem.createdAt
        },
        solution: {
          answer: solution.answer,
          steps: solution.steps,
          confidence: solution.confidence,
          createdAt: solution.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error fetching problem details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const saveToHistory = async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID is required'
      });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Problem is already saved when created, so just return success
    res.status(200).json({
      success: true,
      message: 'Problem saved to history successfully'
    });

  } catch (error) {
    console.error('Error saving to history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getHistory,
  getProblemDetails,
  saveToHistory
};