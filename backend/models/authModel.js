const pool = require("../config/db");

const User = {
  async register(firstName, lastName, email, password) {
    const { rows } = await pool.query(
      `INSERT INTO users ("firstName", "lastName",email,password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [firstName, lastName, email, password]
    );

    return rows[0];
  },

  async getUserByEmail(email) {
    const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    return rows[0];
  },
};

module.exports = User;
