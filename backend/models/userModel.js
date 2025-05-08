const pool = require('../config/db');

const User = {
  async register(firstName, lastName, email, password) {
    const { rows } = await pool.query(
      `SELECT *
      FROM roles
      WHERE name = 'user'
      `,
    );

    await pool.query(
      `INSERT INTO users ("firstName", "lastName", email, password, "roleId") 
      VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, email, password, rows[0].id],
    );

    return { role: rows[0].name };
  },

  async getUserByEmail(email) {
    const { rows } = await pool.query(
      `SELECT users.id, users."firstName", users."lastName", users.email, users.password, roles.name as role  
      FROM users
      LEFT JOIN roles ON users."roleId" = roles.id
      WHERE email=$1`,
      [email],
    );
    return rows[0];
  },

  async getUserById(id) {
    const { rows } = await pool.query(
      `SELECT users.id, users."firstName", users."lastName", users.email, roles.name as role  
      FROM users
      LEFT JOIN roles ON users."roleId" = roles.id
      WHERE users.id=$1`,
      [id],
    );
    return rows[0];
  },

  async deleteUserById(id) {
    const { rows } = await pool.query(
      `DELETE FROM users
      WHERE id=$1`,
      [id],
    );

    return rows[0];
  },

  async getUsers(page, limit) {
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      `SELECT users.id, users."firstName", users."lastName", users.email, roles.name as role 
      FROM users 
      LEFT JOIN roles on users."roleId" = roles.id
      LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const countResult = await pool.query(`SELECT COUNT(*) AS total FROM users`);
    const total = parseInt(countResult.rows[0].total);

    return { users: rows, total };
  },
};

module.exports = User;
