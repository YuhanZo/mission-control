const db = require('../config/db');

const ProjectModel = {
  async countAll() {
    const { rows } = await db.query('SELECT COUNT(*) FROM projects');
    return parseInt(rows[0].count, 10);
  },

  async countActive() {
    const { rows } = await db.query(
      "SELECT COUNT(*) FROM projects WHERE status = 'active'"
    );
    return parseInt(rows[0].count, 10);
  },

  async findRecent(limit = 10) {
    const { rows } = await db.query(
      `SELECT p.*, u.name AS project_manager_name
         FROM projects p
         LEFT JOIN users u ON u.id = p.project_manager_user_id
        ORDER BY p.created_at DESC
        LIMIT $1`,
      [limit]
    );
    return rows;
  },

  // TODO: findById — needed for project detail page
  // TODO: create — needed for new project form
  // TODO: update — needed for project edit
};

module.exports = ProjectModel;
