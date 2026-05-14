const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', requireAuth, dashboardController.showDashboard);

module.exports = router;
