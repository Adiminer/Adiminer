const express = require('express');
const { getHistory, getProblemDetails, saveToHistory } = require('../controllers/historyController');

const router = express.Router();

// GET /api/history
router.get('/', getHistory);

// GET /api/history/:id
router.get('/:id', getProblemDetails);

// POST /api/history
router.post('/', saveToHistory);

module.exports = router;