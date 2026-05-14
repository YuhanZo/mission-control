// Seed script — inserts roles, admin user, and sample projects.
// Run after schema.sql:  npm run seed
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const ROLES = [
  'admin',
  'executive',
  'project_manager',
  'estimator',
  'installer',
  'accounting',
  'support_specialist',
];

const SAMPLE_PROJECTS = [
  { name: 'Smith Residence — Kitchen Blinds',   status: 'active',    value: 12500  },
  { name: 'Downtown Office Complex',             status: 'active',    value: 85000  },
  { name: 'Riverfront Condo Unit 4B',            status: 'completed', value: 6800   },
  { name: 'Greenway Shopping Center',            status: 'active',    value: 42000  },
  { name: 'Lakeside Hotel Renovation',           status: 'pending',   value: 120000 },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Roles
    for (const name of ROLES) {
      await client.query(
        'INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [name]
      );
    }
    console.log('Roles seeded.');

    // Admin user
    const passwordHash = await bcrypt.hash('password123', 10);
    const { rows: [adminRole] } = await client.query(
      "SELECT id FROM roles WHERE name = 'admin'"
    );
    await client.query(
      `INSERT INTO users (name, email, password_hash, user_type, role_id, active)
       VALUES ($1, $2, $3, 'internal', $4, true)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin User', 'admin@jamesblinds.com', passwordHash, adminRole.id]
    );
    console.log('Admin user seeded  (admin@jamesblinds.com / password123)');

    // Sample projects — linked to admin as project manager
    const { rows: [admin] } = await client.query(
      "SELECT id FROM users WHERE email = 'admin@jamesblinds.com'"
    );
    for (const p of SAMPLE_PROJECTS) {
      await client.query(
        `INSERT INTO projects (project_name, project_manager_user_id, status, contract_value, start_date)
         VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
        [p.name, admin.id, p.status, p.value]
      );
    }
    console.log('Sample projects seeded.');

    await client.query('COMMIT');
    console.log('\nSeed complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
