const pool = require('../config/db');
const format = require('pg-format');

const Grid = {
  async createGrid(grid) {
    let query = `INSERT INTO grids (grid) VALUES ($1) RETURNING *`;
    const { rows } = await pool.query(query, [grid]);

    return rows[0];
  },
};

module.exports = Grid;
