const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const authController = {
  showLogin(req, res) {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('login', { error: null });
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('login', { error: 'Email and password are required.' });
    }

    try {
      const user = await UserModel.findByEmail(email.trim().toLowerCase());
      if (!user) {
        return res.render('login', { error: 'Invalid email or password.' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.render('login', { error: 'Invalid email or password.' });
      }

      // Store minimal user info in session — never store password_hash
      req.session.user = {
        id:   user.id,
        name: user.name,
        role: user.role_name,
      };

      res.redirect('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      res.render('login', { error: 'Something went wrong. Please try again.' });
    }
  },

  logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  },
};

module.exports = authController;
