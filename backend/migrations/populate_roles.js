const pool = require('../config/db');

async function populateRoles() {
  try {
    await pool.query(`
      INSERT INTO roles (name)
      VALUES ('admin'),('user'), ('hui')
      ON CONFLICT (name) DO NOTHING;
`);

    console.log('✅ Query executed successfully.');
  } catch (error) {
    console.error('Error running query:', error.message);
  } finally {
    // Close the pool connection
    await pool.end();
  }
}

populateRoles();
