const Message = require("../models/messageModel");
const validateInput = require("../utils/validationUtils");

const messageController = {
  async createMessage(req, res) {
    let [errors, isInvalid] = validateInput(req.body);

    if (isInvalid) {
      res.status(400).json(errors);
      return;
    }

    try {
      const { firstName, lastName, email, message } = req.body;
      const newMessage = await Message.createMessage(
        firstName,
        lastName,
        email,
        message
      );
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async getUsers(req, res) {
    try {
      const messeges = await Message.getMessages();
      res.status(200).json(messeges);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = messageController;
