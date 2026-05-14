const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard
router.get('/dashboard', requireAuth, dashboardController.getDashboard);

module.exports = router;
