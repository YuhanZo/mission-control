const db = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
        WHERE u.email = $1 AND u.active = true`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
        WHERE u.id = $1`,
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = UserModel;
