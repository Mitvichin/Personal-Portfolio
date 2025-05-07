// @ts-nocheck
jest.mock('../../models/userModel');
jest.mock('../../utils/validationUtils');
jest.mock('bcryptjs');
jest.mock('../../config/csrf');

const authController = require('../../controllers/authController');
const jwt = require('jsonwebtoken');
const csrf = require('../../config/csrf');
const User = require('../../models/userModel');
const {
  CSRF_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  JWT_TOKEN_NAME,
  VISITOR_ID_NAME,
} = require('../../utils/constants');
const backendErrorsMap = require('../../utils/errorNames');
const { isUserValid, isLoginValid } = require('../../utils/validationUtils');
const bcryptjs = require('bcryptjs');

const authCookiesOptions = {
  httpOnly: true,
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600000,
};

const authRequestCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

describe('authController', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      set: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    let req;

    beforeEach(() => {
      req = {
        body: {
          firstName: 'Test',
          lastName: 'Test',
          email: 'test@example.com',
          password: 'test123',
        },
      };
    });

    it('should return 201 and the new user if user is valid', async () => {
      isUserValid.mockReturnValue(true);

      User.register.mockReturnValue({ role: 'user' });

      await authController.register(req, res);

      let { firstName, lastName, email, password } = req.body;

      const hashedPass = await bcryptjs.hash(
        password,
        Number(process.env.SALT_ROUNDS),
      );

      expect(User.register).toHaveBeenCalledWith(
        firstName,
        lastName,
        email,
        expect.not.stringMatching(password),
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        firstName,
        lastName,
        email,
        role: 'user',
      });
    });

    it('should return 400 when user is invalid', async () => {
      isUserValid.mockReturnValue(false);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_INPUT,
      });
    });

    it('should return 400 if user with the same email exists', async () => {
      isUserValid.mockReturnValue(true);

      User.register.mockRejectedValue({ code: 23505, constraint: 'email' });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.DUBLICATE_KEY,
        key: 'email',
      });
    });

    it('should return 500 if there is an error while registration', async () => {
      isUserValid.mockReturnValue(true);

      User.register.mockRejectedValue(new Error('DB error'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('login', () => {
    let req;

    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'test123',
        },
      };
    });

    it('should return 200 and the logged user', async () => {
      isLoginValid.mockReturnValue(true);
      let dbRes = {
        ...req.body,
        id: 1,
        firstName: 'Test',
        lastName: 'Test',
        role: 'admin',
      };

      bcryptjs.compare.mockResolvedValue(true);
      User.getUserByEmail.mockReturnValue(dbRes);

      await authController.login(req, res);

      const { password, ...user } = dbRes;

      expect(User.getUserByEmail).toHaveBeenCalledWith(req.body.email);

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith(
        JWT_TOKEN_NAME,
        expect.any(String),
        authCookiesOptions,
      );
      expect(res.cookie).toHaveBeenCalledWith(
        JWT_REFRESH_TOKEN_NAME,
        expect.any(String),
        authCookiesOptions,
      );
      expect(res.clearCookie).toHaveBeenCalledWith(CSRF_TOKEN_NAME);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 400 when password doesnt match', async () => {
      isLoginValid.mockReturnValue(true);
      let dbRes = {
        ...req.body,
        id: 1,
        firstName: 'Test',
        lastName: 'Test',
        role: 'admin',
      };

      bcryptjs.compare.mockResolvedValue(false);
      User.getUserByEmail.mockReturnValue(dbRes);

      await authController.login(req, res);

      expect(User.getUserByEmail).toHaveBeenCalledWith(req.body.email);

      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.clearCookie).not.toHaveBeenCalledWith();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_CREDENTIALS,
      });
    });

    it('should return 500 when there is error during login', async () => {
      isLoginValid.mockReturnValue(true);
      let dbRes = {
        ...req.body,
        id: 1,
        firstName: 'Test',
        lastName: 'Test',
        role: 'admin',
      };

      User.getUserByEmail.mockRejectedValue(new Error('DB error'));

      await authController.login(req, res);

      expect(User.getUserByEmail).toHaveBeenCalledWith(req.body.email);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });

    it('should return 400 when input is invalid', async () => {
      isLoginValid.mockReturnValue(false);
      let dbRes = {
        ...req.body,
        id: 1,
        firstName: 'Test',
        lastName: 'Test',
        role: 'admin',
      };

      await authController.login(req, res);

      expect(User.getUserByEmail).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_INPUT,
      });
    });
  });

  describe('logout', () => {
    it('should return 204 and clear auth and csrf cookies', async () => {
      await authController.logout(null, res);

      expect(res.clearCookie).toHaveBeenCalledTimes(3);
      expect(res.clearCookie).toHaveBeenCalledWith(JWT_TOKEN_NAME);
      expect(res.clearCookie).toHaveBeenCalledWith(JWT_REFRESH_TOKEN_NAME);
      expect(res.clearCookie).toHaveBeenCalledWith(CSRF_TOKEN_NAME);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('verifyAuthentication', () => {
    let req;
    const user = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'test',
      role: 'admin',
    };

    beforeEach(() => {
      req = {
        cookies: {
          [JWT_TOKEN_NAME]: jwt.sign(
            { user: { id: 1, role: 'admin' } },
            process.env.JWT_SECRET,
            {
              expiresIn: '2m',
            },
          ),
        },
      };
    });

    it('should return 200 and the verified user', async () => {
      User.getUserById.mockReturnValue(user);

      await authController.verifyAuthentication(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(User.getUserById).toHaveBeenCalledWith(1);
      expect(res.set).toHaveBeenCalledWith(authRequestCacheHeaders);
    });

    it('should return 401 if auth token is missing', async () => {
      await authController.verifyAuthentication({ cookies: {} }, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.UNAUTHENTICATED,
      });
    });

    it('should return 401 if auth token is missing id', async () => {
      await authController.verifyAuthentication(
        {
          cookies: {
            [JWT_TOKEN_NAME]: jwt.sign(
              { user: { role: 'admin' } },
              process.env.JWT_SECRET,
              {
                expiresIn: '2m',
              },
            ),
          },
        },
        res,
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.UNAUTHENTICATED,
      });
    });

    it('should return 401 if auth token is invalid', async () => {
      await authController.verifyAuthentication(
        { cookies: { [JWT_TOKEN_NAME]: 'test123' } },
        res,
      );

      expect(User.getUserById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.UNAUTHENTICATED,
      });
    });

    it('should return 401 if user is not found', async () => {
      User.getUserById.mockReturnValue(undefined);

      await authController.verifyAuthentication(req, res);

      expect(User.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.UNAUTHENTICATED,
      });
    });
  });

  describe('refreshAuthToken', () => {
    const user = {
      id: 1,
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@example.com',
      role: 'admin',
    };

    const refreshToken = jwt.sign(
      { user: { id: 1, role: 'admin' } },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '10m',
      },
    );

    let req;

    beforeEach(() => {
      req = {
        cookies: { [JWT_REFRESH_TOKEN_NAME]: refreshToken },
      };
    });

    it('should return 200 and the logged user', async () => {
      User.getUserById.mockReturnValue(user);

      await authController.refreshAuthToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(User.getUserById).toHaveBeenCalledWith(1);
      expect(res.set).toHaveBeenCalledWith(authRequestCacheHeaders);
      expect(res.clearCookie).toHaveBeenCalledWith(CSRF_TOKEN_NAME);
      expect(res.cookie).toHaveBeenCalledWith(
        JWT_TOKEN_NAME,
        expect.any(String),
        authCookiesOptions,
      );
    });

    it('should return 401 if auth token is invalid', async () => {
      await authController.refreshAuthToken(
        { cookies: { [JWT_REFRESH_TOKEN_NAME]: 'test123' } },
        res,
      );

      expect(User.getUserById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_REFRESH_TOKEN,
      });
    });

    it('should return 401 if user is not found', async () => {
      User.getUserById.mockReturnValue(undefined);

      await authController.refreshAuthToken(req, res);

      expect(User.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_REFRESH_TOKEN,
      });
    });

    it('should return 401 if auth token is missing id', async () => {
      await authController.refreshAuthToken(
        {
          cookies: {
            [JWT_REFRESH_TOKEN_NAME]: jwt.sign(
              { user: { role: 'admin' } },
              process.env.JWT_SECRET,
              {
                expiresIn: '2m',
              },
            ),
          },
        },
        res,
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_REFRESH_TOKEN,
      });
    });

    it('should return 401 if auth token is missing', async () => {
      await authController.refreshAuthToken({ cookies: {} }, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_REFRESH_TOKEN,
      });
    });
  });

  describe('getCSRF', () => {
    it('should return 200 and the newly created csrf token when JWT is available', async () => {
      let req = {
        cookies: { [JWT_TOKEN_NAME]: 'token' },
      };
      csrf.generateToken.mockReturnValue('csrfToken');

      await authController.getCSRF(req, res);

      expect(csrf.generateToken).toHaveBeenCalledWith(req, res);
      expect(res.set).toHaveBeenCalledWith(authRequestCacheHeaders);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ csrfToken: 'csrfToken' });
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('should return 200 and the newly created csrf token when visitor id is available', async () => {
      let req = {
        cookies: { [VISITOR_ID_NAME]: 'some_random_id' },
      };
      csrf.generateToken.mockReturnValue('csrfToken');

      await authController.getCSRF(req, res);

      expect(csrf.generateToken).toHaveBeenCalledWith(req, res);
      expect(res.set).toHaveBeenCalledWith(authRequestCacheHeaders);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ csrfToken: 'csrfToken' });
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('should return 200 and the newly created csrf token when no identification is available', async () => {
      let req = {
        cookies: {},
      };
      csrf.generateToken.mockReturnValue('csrfToken');

      await authController.getCSRF(req, res);

      expect(csrf.generateToken).toHaveBeenCalledWith(req, res);
      expect(res.set).toHaveBeenCalledWith(authRequestCacheHeaders);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ csrfToken: 'csrfToken' });
      expect(res.cookie).toHaveBeenCalledWith(
        VISITOR_ID_NAME,
        expect.any(String),
        authCookiesOptions,
      );
    });

    it('should return 403 if there is an error', async () => {
      let req = {
        cookies: {},
      };

      csrf.generateToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authController.getCSRF(req, res);

      expect(csrf.generateToken).toHaveBeenCalledWith(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith(CSRF_TOKEN_NAME);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.CSRF_INVALID_TOKEN,
      });
    });
  });
});
