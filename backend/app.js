require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse URL-encoded form bodies
app.use(express.urlencoded({ extended: false }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Use EJS to render .html view files
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Session — stored in memory for MVP
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
}));

// Routes
app.get('/', (_req, res) => res.redirect('/login'));
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// TODO: mount projectRoutes when projects CRUD module is built
// TODO: mount userRoutes when user management module is built
// TODO: mount materialRoutes when materials module is built
// TODO: mount scheduleRoutes when scheduling module is built
// TODO: mount punchRoutes when punch module is built
// TODO: mount billingRoutes when QBO billing module is built

app.listen(PORT, () => {
  console.log(`James Blinds MVP running at http://localhost:${PORT}`);
});
