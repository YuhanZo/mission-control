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
// PATCH /api/auth/profile — update name and email
router.patch('/profile', requireAuth, authController.updateProfile);
// PATCH /api/auth/profile/password — change password
router.patch('/profile/password', requireAuth, authController.changePassword);

module.exports = router;
