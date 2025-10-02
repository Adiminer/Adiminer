const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Problem', problemSchema);