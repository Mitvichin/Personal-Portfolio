const pool = require('../config/db');

const createTables = async () => {
  const tables = [`DROP TABLE IF EXISTS grids;`];

  try {
    for (let table of tables) await pool.query(table);
    console.log('✅ Table dropped successfully!');
  } catch (error) {
    console.error('❌ Error dropping table:', error);
  } finally {
    pool.end();
  }
};

// Run script
createTables();
