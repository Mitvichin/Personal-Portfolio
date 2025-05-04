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
      `SELECT roles.name
      FROM roles
      WHERE id = $1
      `,
      [users.rows[0].roleId],
    );

    return { role: roles.rows[0].name };
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
