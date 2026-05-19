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

  async updateProfile(id, { name, email }) {
    await db.query(
      `UPDATE users
          SET name       = COALESCE($1, name),
              email      = COALESCE($2, email),
              updated_at = NOW()
        WHERE id = $3`,
      [name || null, email || null, id]
    );
  },

  async updatePassword(id, hash) {
    await db.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [hash, id]
    );
  },
};

module.exports = UserModel;
