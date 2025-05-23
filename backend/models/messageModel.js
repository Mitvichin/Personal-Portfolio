const pool = require('../config/db');

const Message = {
  async createMessage(firstName, lastName, email, message) {
    const { rows } = await pool.query(
      `INSERT INTO messages ("firstName", "lastName",email,message) VALUES ($1, $2, $3, $4) RETURNING *`,
      [firstName, lastName, email, message],
    );

    return rows[0];
  },

  async getMessages(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
      'SELECT * FROM messages LIMIT $1 OFFSET $2',
      [limit, offset],
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM messages`,
    );
    const total = parseInt(countResult.rows[0].total);

    return { messages: rows, total };
  },

  async deleteMessage(id) {
    let { rows } = await pool.query(
      'DELETE FROM messages WHERE id = $1 RETURNING *',
      [id],
    );

    return rows[0];
  },
};

module.exports = Message;
