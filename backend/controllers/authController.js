const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const authController = {
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      const user = await UserModel.findByEmail(email.trim().toLowerCase());
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Store minimal user info in session — never store password_hash
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        territoryId: user.territory_id,
      };

      res.json({ user: req.session.user });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  logout(req, res) {
    req.session.destroy(() => res.json({ message: 'Logged out.' }));
  },

  // Returns the currently logged-in user from session
  me(req, res) {
    res.json({ user: req.session.user });
  },

  async updateProfile(req, res) {
    const { name, email } = req.body;
    if (!name && !email) return res.status(400).json({ error: 'Nothing to update.' });
    try {
      await UserModel.updateProfile(req.session.user.id, { name, email });
      if (name)  req.session.user.name  = name;
      if (email) req.session.user.email = email;
      res.json({ ok: true, user: req.session.user });
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },

  async changePassword(req, res) {
    const { current, next } = req.body;
    if (!current || !next) return res.status(400).json({ error: 'Both current and new passwords are required.' });
    if (next.length < 8)   return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    try {
      const user = await UserModel.findById(req.session.user.id);
      if (!user) return res.status(404).json({ error: 'User not found.' });
      const match = await bcrypt.compare(current, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Current password is incorrect.' });
      const hash = await bcrypt.hash(next, 10);
      await UserModel.updatePassword(req.session.user.id, hash);
      res.json({ ok: true });
    } catch (err) {
      console.error('Password change error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },
};

module.exports = authController;
