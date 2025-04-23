const Message = require('../models/messageModel');
const backendErrorsMap = require('../utils/errorNames');
const { validateMessage } = require('../utils/validationUtils');

const messageController = {
  async createMessage(req, res) {
    let isInvalid = validateMessage(req.body);
    if (isInvalid) {
      res.status(400).json({ message: backendErrorsMap.INVALID_INPUT });
      return;
    }

    try {
      const { firstName, lastName, email, message } = req.body;
      const newMessage = await Message.createMessage(
        firstName,
        lastName,
        email,
        message,
      );
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async getMessages(req, res) {
    try {
      const messeges = await Message.getMessages();
      res.status(200).json(messeges);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },
};

module.exports = messageController;
