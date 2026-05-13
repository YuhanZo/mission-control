const ProjectModel = require('../models/projectModel');

const dashboardController = {
  async showDashboard(req, res) {
    try {
      const [totalProjects, activeProjects, recentProjects] = await Promise.all([
        ProjectModel.countAll(),
        ProjectModel.countActive(),
        ProjectModel.findRecent(10),
      ]);

      res.render('dashboard', {
        user: req.session.user,
        totalProjects,
        activeProjects,
        recentProjects,
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      res.status(500).send('Server error — check your database connection.');
    }
  },
};

module.exports = dashboardController;
