const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csrf = require('../config/csrf');
const { isUserValid, isLoginValid } = require('../utils/validationUtils');
const dbErrorsMap = require('../utils/dbErrorsMap');
const backendErrorsMap = require('../utils/errorNames');
const {
  JWT_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  CSRF_TOKEN_NAME,
  VISITOR_ID_NAME,
} = require('../utils/constants');

const authCookiesOptions = {
  httpOnly: true,
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600000,
};

const AUTH_TOKEN_DURATION = '30m';

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
        const tokenInfo = { user: { id, email, firstName, lastName, role } };

        const authToken = jwt.sign(tokenInfo, process.env.JWT_SECRET, {
          expiresIn: AUTH_TOKEN_DURATION,
        });

        const authRefreshToken = jwt.sign(
          tokenInfo,
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: '1d',
          },
        );

        res.cookie(JWT_TOKEN_NAME, authToken, authCookiesOptions);

        res.cookie(
          JWT_REFRESH_TOKEN_NAME,
          authRefreshToken,
          authCookiesOptions,
        );

        res.clearCookie(CSRF_TOKEN_NAME);
        res.status(200).json(tokenInfo.user);
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
    res.clearCookie(CSRF_TOKEN_NAME);
    res.status(204).send();
  },

  async verifyAuthentication(req, res) {
    const token = req.cookies[JWT_TOKEN_NAME];

    if (!token) {
      return res
        .status(401)
        .json({ message: backendErrorsMap.UNAUTHENTICATED });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, { user } = {}) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ message: backendErrorsMap.UNAUTHENTICATED });
      }

      res.json(user);
    });
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
      (err, { user } = {}) => {
        if (err || !user) {
          return res
            .status(401)
            .json({ message: backendErrorsMap.INVALID_REFRESH_TOKEN });
        }

        const newAccessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: AUTH_TOKEN_DURATION,
        });

        res.cookie(JWT_TOKEN_NAME, newAccessToken, authCookiesOptions);
        res.clearCookie(CSRF_TOKEN_NAME);

        return res.status(200).json();
      },
    );
  },

  async getCSRF(req, res) {
    try {
      const token = req.cookies[JWT_TOKEN_NAME];
      const visitor = req.cookies[VISITOR_ID_NAME];

      if (!token && !visitor) {
        const id = crypto.randomUUID();
        res.cookie(VISITOR_ID_NAME, id, authCookiesOptions);
        req.cookies[VISITOR_ID_NAME] = id;
      }

      const csrfToken = csrf.generateToken(req, res);
      return res.json({ csrfToken });
    } catch (error) {
      console.error(error);
      res.status(403).json({ message: backendErrorsMap.CSRF_INVALID_TOKEN });
    }
  },
};

module.exports = authController;
