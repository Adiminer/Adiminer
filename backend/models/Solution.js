const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  steps: [{
    stepNumber: Number,
    description: String,
    explanation: String
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Solution', solutionSchema);