const pool = require('../config/db');

const User = {
  async register(firstName, lastName, email, password) {
    const users = await pool.query(
      `INSERT INTO users ("firstName", "lastName",email,password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING users."roleId"`,
      [firstName, lastName, email, password],
    );

    const roles = await pool.query(
      `
      SELECT roles.name
      FROM roles
      WHERE id = $1
      `,
      [users.rows[0].roleId],
    );

    return { role: roles.rows[0].name };
  },

  async getUserByEmail(email) {
    const { rows } = await pool.query(
      `SELECT users.*, roles.name as role  
      FROM users
      LEFT JOIN roles ON users."roleId" = roles.id
      WHERE email=$1`,
      [email],
    );
    return rows[0];
  },
};

module.exports = User;
