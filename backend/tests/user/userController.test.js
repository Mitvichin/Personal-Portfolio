// @ts-nocheck
const userController = require('../../controllers/userController');
const User = require('../../models/userModel');
const backendErrorsMap = require('../../utils/errorNames');

jest.mock('../../models/userModel');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getUsers', () => {
    it('should return 200 and paginated users', async () => {
      const mockUsers = [{ id: 1, name: 'User One' }];
      const mockTotal = 1;
      User.getUsers.mockResolvedValue({ users: mockUsers, total: mockTotal });

      req.query = { page: '1', limit: '10' };

      await userController.getUsers(req, res);

      expect(User.getUsers).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockUsers,
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should return 500 if an error occurs', async () => {
      User.getUsers.mockRejectedValue(new Error('DB error'));

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('deleteUserById', () => {
    it('should return 403 if user is admin', async () => {
      req.body = { id: 1 };
      User.getUserById.mockResolvedValue({ id: 1, role: 'admin' });

      await userController.deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.ACTION_FORBIDDEN,
      });
    });

    it('should delete and return user if user is not admin', async () => {
      const mockUser = { id: 2, role: 'user' };
      req.body = { id: 2 };
      User.getUserById.mockResolvedValue(mockUser);
      User.deleteUserById.mockResolvedValue();

      await userController.deleteUserById(req, res);

      expect(User.getUserById).toHaveBeenCalledWith(2);
      expect(User.deleteUserById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 404 if user is undefined', async () => {
      req.body = { id: 3 };
      User.getUserById.mockResolvedValue(undefined);

      await userController.deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.NOT_FOUND,
      });
    });

    it('should return 500 if an error occurs during deletion', async () => {
      req.body = { id: 4 };
      User.getUserById.mockRejectedValue(new Error('DB error'));

      await userController.deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
