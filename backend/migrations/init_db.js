const pool = require("../config/db");

const createTables = async () => {
  const tables = [
    ` CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message VARCHAR(1024) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
    ` CREATE TABLE IF NOT EXISTS grids (
        id SERIAL PRIMARY KEY,
        grid TEXT[][]
      );`,
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password TEXT NOT NULL
      );`,
  ];

  try {
    for (let table of tables) await pool.query(table);
    console.log("✅ Tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  } finally {
    pool.end();
  }
};

// Run script
createTables();
