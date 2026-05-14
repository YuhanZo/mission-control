const db = require('../config/db');

const ProjectUserModel = {
  async findByProjectId(projectId) {
    const { rows } = await db.query(
      `SELECT pu.*, u.name, u.email
         FROM project_users pu
         JOIN users u ON u.id = pu.user_id
        WHERE pu.project_id = $1`,
      [projectId]
    );
    return rows;
  },

  // TODO: assign — add a user to a project with a relationship_type
  // TODO: remove — remove a user from a project
};

module.exports = ProjectUserModel;
