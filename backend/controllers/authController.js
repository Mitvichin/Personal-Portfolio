const User = require('../models/authModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csrf = require('../config/csrf');
const { isUserValid, isLoginValid } = require('../utils/validationUtils');
const dbErrorsMap = require('../utils/dbErrorsMap');
const backendErrorsMap = require('../utils/errorNames');
const {
  JWT_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
} = require('../utils/constants');

const authCookiesOptions = {
  httpOnly: true,
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600000,
};

const authController = {
  async register(req, res) {
    const isValid = isUserValid(req.body);

    if (!isValid) {
      res.status(400).json({ message: backendErrorsMap.INVALID_INPUT });
      return;
    }

    try {
      const { firstName, lastName, email, password } = req.body;

      const hashedPass = await bcryptjs.hash(
        password,
        Number(process.env.SALT_ROUNDS),
      );

      const { role } = await User.register(
        firstName,
        lastName,
        email,
        hashedPass,
      );

      res.status(201).json({ firstName, lastName, email, role });
    } catch (error) {
      if (
        error.code &&
        dbErrorsMap[error.code] &&
        error.constraint.includes('email')
      ) {
        res
          .status(400)
          .json({ message: dbErrorsMap[error.code], key: 'email' });
        return;
      }
      console.log(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async login(req, res) {
    const body = req.body;
    const isValid = isLoginValid(req.body);

    if (!isValid) {
      res.status(400).json({ message: backendErrorsMap.INVALID_INPUT });
      return;
    }

    try {
      const dbResult = await User.getUserByEmail(body.email);

      if (
        dbResult &&
        (await bcryptjs.compare(body.password, dbResult.password))
      ) {
        const { id, email, firstName, lastName, role } = dbResult;

        const authToken = jwt.sign(
          { id, email, firstName, lastName, role },
          process.env.JWT_SECRET,
          {
            expiresIn: '1m',
          },
        );

        const authRefreshToken = jwt.sign(
          { id, email, firstName, lastName, role },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: '5m',
          },
        );

        res.cookie(JWT_TOKEN_NAME, authToken, authCookiesOptions);

        res.cookie(
          JWT_REFRESH_TOKEN_NAME,
          authRefreshToken,
          authCookiesOptions,
        );

        res.status(200).json({ id, firstName, lastName, email, role });
        return;
      } else {
        res.status(400).json({ message: backendErrorsMap.INVALID_CREDENTIALS });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async logout(_, res) {
    res.clearCookie(JWT_TOKEN_NAME);
    res.clearCookie(JWT_REFRESH_TOKEN_NAME);
    res.status(204).send();
  },

  async verifyAuthentication(req, res) {
    const token = req.cookies[JWT_TOKEN_NAME];

    if (!token) {
      return res
        .status(401)
        .json({ message: backendErrorsMap.UNAUTHENTICATED });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, { id, firstName, lastName, email, role } = {}) => {
        if (err || !id || !email || !firstName || !lastName || !role) {
          return res
            .status(401)
            .json({ message: backendErrorsMap.UNAUTHENTICATED });
        }

        res.json({ id, firstName, lastName, email, role });
      },
    );
  },

  async refreshAuthToken(req, res) {
    const refreshToken = req.cookies[JWT_REFRESH_TOKEN_NAME];

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: backendErrorsMap.INVALID_REFRESH_TOKEN });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, { id, email, firstName, lastName, role } = {}) => {
        if (err || !id || !email || !firstName || !lastName || !role) {
          return res
            .status(401)
            .json({ message: backendErrorsMap.INVALID_REFRESH_TOKEN });
        }

        const newAccessToken = jwt.sign(
          { id, email, firstName, lastName, role },
          process.env.JWT_SECRET,
          {
            expiresIn: '10m',
          },
        );

        res.cookie(JWT_TOKEN_NAME, newAccessToken, authCookiesOptions);

        return res.status(200).json();
      },
    );
  },

  async getCSRF(req, res) {
    try {
      const csrfToken = csrf.generateToken(req, res);
      return res.json({ csrfToken });
    } catch (error) {}
  },
};

module.exports = authController;
