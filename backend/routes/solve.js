const express = require('express');
const { solveProblem } = require('../controllers/solveController');

const router = express.Router();

// POST /api/solve
router.post('/', solveProblem);

module.exports = router;