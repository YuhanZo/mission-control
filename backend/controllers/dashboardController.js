const ProjectModel = require('../models/projectModel');

const dashboardController = {
  async getDashboard(req, res) {
    try {
      const [totalProjects, activeProjects, recentProjects] = await Promise.all([
        ProjectModel.countAll(),
        ProjectModel.countActive(),
        ProjectModel.findRecent(10),
      ]);

      res.json({
        user: req.session.user,
        stats: { totalProjects, activeProjects },
        recentProjects,
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      res.status(500).json({ error: 'Server error.' });
    }
  },
};

module.exports = dashboardController;
