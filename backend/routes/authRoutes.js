const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login',  authController.login);
// POST /api/auth/logout
router.post('/logout', authController.logout);
// GET  /api/auth/me  — returns current session user
router.get('/me', requireAuth, authController.me);

module.exports = router;
