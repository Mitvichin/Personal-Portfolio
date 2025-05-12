const redis = require('../config/redis');
const { logger, getLogMetaData } = require('../logger/winston');
const User = require('../models/userModel');
const { CACHE_TIME } = require('../utils/constants');
const backendErrorsMap = require('../utils/errorNames');

const userController = {
  async getUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const { users, total } = await User.getUsers(page, limit);

      const resData = {
        data: users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
      redis
        .setex(req.originalUrl, CACHE_TIME, JSON.stringify(resData))
        .catch(logger.error);
      res.status(200).json(resData);
    } catch (error) {
      logger.error(error, getLogMetaData(req, error));
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async deleteUserById(req, res) {
    const { id } = req.body;

    try {
      const user = await User.getUserById(id);

      if (user && user.role === 'admin') {
        return res
          .status(403)
          .json({ message: backendErrorsMap.ACTION_FORBIDDEN });
      }

      await User.deleteUserById(id);

      if (user !== undefined) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: backendErrorsMap.NOT_FOUND });
      }
    } catch (error) {
      logger.error(error, getLogMetaData(req, error));
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },
};

module.exports = userController;
