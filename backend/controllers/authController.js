const User = require("../models/authModel");
const bcryptjs = require("bcryptjs");
const { validateUser } = require("../utils/validationUtils");

const messageController = {
  async register(req, res) {
    let [errors, isInvalid] = validateUser(req.body);

    if (isInvalid) {
      res.status(400).json(errors);
      return;
    }

    try {
      const { firstName, lastName, email, password } = req.body;

      const hashedPass = bcryptjs.hash(email, Number(process.env.SALT_ROUNDS));

      const newMessage = await User.createMessage(
        firstName,
        lastName,
        email,
        hashedPass
      );
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.getUserByEmail(email);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = messageController;
