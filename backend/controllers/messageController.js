const { logger } = require('../logger/winston');
const Message = require('../models/messageModel');
const backendErrorsMap = require('../utils/errorNames');
const { isMessageFormValid } = require('../utils/validationUtils');

const messageController = {
  async createMessage(req, res) {
    let isValid = isMessageFormValid(req.body);

    if (!isValid) {
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
      logger.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async getMessages(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const { messages, total } = await Message.getMessages(page, limit);
      res.status(200).json({
        data: messages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async deleteMessage(req, res) {
    const { id } = req.body;

    try {
      const message = await Message.deleteMessage(id);
      if (message !== undefined) {
        res.status(200).json({ message });
      } else {
        res.status(404).json({ message: backendErrorsMap.NOT_FOUND });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },
};

module.exports = messageController;
