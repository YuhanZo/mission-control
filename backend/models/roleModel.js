const db = require('../config/db');

const RoleModel = {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM roles ORDER BY name');
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
    return rows[0] || null;
  },
};

module.exports = RoleModel;
