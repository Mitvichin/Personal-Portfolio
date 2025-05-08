// @ts-nocheck

jest.mock('../../models/messageModel');
jest.mock('../../utils/validationUtils');

const messageController = require('../../controllers/messageController');
const Message = require('../../models/messageModel');
const backendErrorsMap = require('../../utils/errorNames');
const { isMessageFormValid } = require('../../utils/validationUtils');

describe('messageController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Hello!',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createMessage', () => {
    it('should return 400 if message form is invalid', async () => {
      isMessageFormValid.mockReturnValue(false);

      await messageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_INPUT,
      });
    });

    it('should return 201 and the new message if form is valid', async () => {
      const mockMessage = { id: 1, ...req.body };
      isMessageFormValid.mockReturnValue(true);
      Message.createMessage.mockResolvedValue(mockMessage);

      await messageController.createMessage(req, res);

      expect(Message.createMessage).toHaveBeenCalledWith(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.message,
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMessage);
    });

    it('should return 500 if there is an error while creating the message', async () => {
      isMessageFormValid.mockReturnValue(true);
      Message.createMessage.mockRejectedValue(new Error('DB error'));

      await messageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('getMessages', () => {
    it('should return 200 with messages and pagination', async () => {
      const mockMessages = [{ id: 1, message: 'Test message' }];
      const mockTotal = 1;
      Message.getMessages.mockResolvedValue({
        messages: mockMessages,
        total: mockTotal,
      });

      req.query = { page: 1, limit: 10 };

      await messageController.getMessages(req, res);

      expect(Message.getMessages).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockMessages,
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should return 500 if there is an error fetching messages', async () => {
      Message.getMessages.mockRejectedValue(new Error('DB error'));

      await messageController.getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('deleteMessage', () => {
    it('should return 200 and deleted message if message exists', async () => {
      const mockDeletedMessage = { id: 1, message: 'Deleted' };
      Message.deleteMessage.mockResolvedValue(mockDeletedMessage);

      req.body = { id: 1 };

      await messageController.deleteMessage(req, res);

      expect(Message.deleteMessage).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: mockDeletedMessage });
    });

    it('should return 404 if message is not found', async () => {
      Message.deleteMessage.mockResolvedValue(undefined);

      req.body = { id: 999 };

      await messageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.NOT_FOUND,
      });
    });

    it('should return 500 if there is an error during deletion', async () => {
      Message.deleteMessage.mockRejectedValue(new Error('DB error'));

      await messageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
