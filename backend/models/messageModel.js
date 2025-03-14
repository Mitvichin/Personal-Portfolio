const pool = require("../config/db");

const Message = {
  async createMessage(firstName, lastName, email, message) {
    const { rows } = await pool.query(
      "INSERT INTO messages (firstName, lastName,email,message) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstName, lastName, email, message]
    );

    return rows[0];
  },

  async getMessages() {
    const { rows } = await pool.query("SELECT * FROM messages");
    return rows;
  },
};

module.exports = Message;
