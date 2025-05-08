// @ts-nocheck
const pool = require('../../config/db');
const Message = require('../../models/messageModel');

jest.mock('../../config/db');

describe('Message model', () => {
  describe('createMessage', () => {
    it('should insert a new message and return the inserted row', async () => {
      const mockMessage = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Hello World',
      };
      const mockRow = { id: 1, ...mockMessage };

      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await Message.createMessage(
        mockMessage.firstName,
        mockMessage.lastName,
        mockMessage.email,
        mockMessage.message,
      );

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO messages ("firstName", "lastName",email,message) VALUES ($1, $2, $3, $4) RETURNING *',
        [
          mockMessage.firstName,
          mockMessage.lastName,
          mockMessage.email,
          mockMessage.message,
        ],
      );

      expect(result).toEqual(mockRow);
    });

    it('should throw an error if query fails', async () => {
      const mockMessage = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Hello World',
      };
      const mockError = new Error('Database error');

      pool.query.mockRejectedValue(mockError);

      await expect(
        Message.createMessage(
          mockMessage.firstName,
          mockMessage.lastName,
          mockMessage.email,
          mockMessage.message,
        ),
      ).rejects.toThrow('Database error');
    });
  });

  describe('getMessages', () => {
    it('should return messages with pagination and total count', async () => {
      const mockMessages = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          message: 'Hello World',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          message: 'Hi World',
        },
      ];
      const mockCount = [{ total: 2 }];

      pool.query.mockResolvedValueOnce({ rows: mockMessages });
      pool.query.mockResolvedValueOnce({ rows: mockCount });

      const result = await Message.getMessages(1, 10);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM messages LIMIT $1 OFFSET $2',
        [10, 0],
      );
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS total FROM messages',
      );

      expect(result.messages.length).toBe(2);
      expect(result.total).toBe(2);
    });

    it('should handle pagination and return empty list if no messages are found', async () => {
      const mockMessages = [];
      const mockCount = [{ total: 0 }];

      pool.query.mockResolvedValueOnce({ rows: mockMessages });
      pool.query.mockResolvedValueOnce({ rows: mockCount });

      const result = await Message.getMessages(1, 10);

      expect(result.messages.length).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should throw an error if query fails', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValueOnce(mockError);

      await expect(Message.getMessages(1, 10)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message and return the deleted row', async () => {
      const mockMessage = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Hello World',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockMessage] });

      const result = await Message.deleteMessage(1);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM messages WHERE id = $1 RETURNING *',
        [1],
      );

      expect(result).toEqual(mockMessage);
    });

    it('should throw an error if query fails', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValueOnce(mockError);

      await expect(Message.deleteMessage(1)).rejects.toThrow('Database error');
    });

    it('should return undefined if no message is found to delete', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await Message.deleteMessage(999);
      expect(result).toBeUndefined();
    });
  });
});
