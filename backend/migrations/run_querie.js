const pool = require('../config/db');

async function run_querie() {
  try {
    await pool.query(`
      ALTER TABLE users
      ALTER COLUMN "roleId" SET DEFAULT 2;
`);

    console.log('✅ Query executed successfully.');
  } catch (error) {
    console.error('Error running query:', error.message);
  } finally {
    // Close the pool connection
    await pool.end();
  }
}

run_querie();
