const pool = require('../config/db');

async function removeUniqueConstraint() {
  try {
    await pool.query(`
      ALTER TABLE messages
      DROP CONSTRAINT messages_email_key;
    `);

    console.log('Unique constraint removed successfully.');
  } catch (error) {
    console.error('Error removing unique constraint:', error.message);
  } finally {
    // Close the pool connection
    await pool.end();
  }
}

removeUniqueConstraint();
