// @ts-nocheck
const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/db');
const createTables = require('../../migrations/init_db');
const {
  populateUsers,
  deleteFromAllTables,
  adminUser,
  user,
  getCSRFToken,
  login,
  getCookieDetails,
} = require('../testUtils');
const {
  API_BASE_URL,
  VISITOR_ID_NAME,
  CSRF_TOKEN_NAME,
} = require('../../utils/constants');
const backendErrorsMap = require('../../utils/errorNames');

jest.mock('../../middlewares/rateLimit', () =>
  jest.fn((req, res, next) => next()),
);

const agent = request.agent(app);

describe('Auth route', () => {
  beforeAll(async () => {
    await createTables(pool);
    await populateUsers(pool);
    await getCSRFToken(agent);
  });

  afterAll(async () => {
    await deleteFromAllTables(pool);
    await pool.end();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await agent.post(`${API_BASE_URL}/auth/register`).send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        role: expect.any(String),
      });
    });

    it('should fail if email is duplicate', async () => {
      const initialReg = await agent
        .post(`${API_BASE_URL}/auth/register`)
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'duplicata@mail.com',
          password: 'Password123!',
        });

      const res = await agent.post(`${API_BASE_URL}/auth/register`).send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'duplicata@mail.com',
        password: 'Password123!',
      });

      expect(initialReg.status).toBe(201);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        key: 'email',
        message: backendErrorsMap.DUBLICATE_KEY,
      });
    });

    it('should return 400 for invalid input', async () => {
      const res = await agent.post(`${API_BASE_URL}/auth/register`).send({
        firstName: '',
        lastName: '',
        email: 'notanemail',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(backendErrorsMap.INVALID_INPUT);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully and return user info', async () => {
      const res = await agent.post(`${API_BASE_URL}/auth/login`).send({
        email: adminUser.email,
        password: adminUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        email: adminUser.email,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
      });
    });

    it('should fail with wrong credentials', async () => {
      await getCSRFToken(agent);

      const res = await agent.post(`${API_BASE_URL}/auth/login`).send({
        email: adminUser.email,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(backendErrorsMap.INVALID_CREDENTIALS);
    });

    it('should fail with invalid inpu', async () => {
      await getCSRFToken(agent);

      const res = await agent.post(`${API_BASE_URL}/auth/login`).send({
        email: adminUser.email,
        password: 'w',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(backendErrorsMap.INVALID_INPUT);
    });
  });

  describe('GET /auth/logout', () => {
    it('should logout user with status 204', async () => {
      const res = await agent.get(`${API_BASE_URL}/auth/logout`);
      expect(res.status).toBe(204);
    });
  });

  describe('GET /auth/verify-authentication', () => {
    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get(
        `${API_BASE_URL}/auth/verify-authentication`,
      );
      expect(res.status).toBe(401);
      expect(res.body.message).toBe(backendErrorsMap.UNAUTHENTICATED);
    });

    it('should return 200 and user info if authenticated', async () => {
      await login(agent, adminUser);
      const res = await agent.get(`${API_BASE_URL}/auth/verify-authentication`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(adminUser.email);
    });
  });

  describe('GET /auth/refresh', () => {
    it('should return 200 and new token if refresh token is valid', async () => {
      await login(agent, adminUser);
      const res = await agent.get(`${API_BASE_URL}/auth/refresh`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 1,
        email: adminUser.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      });
    });

    it('should return 401 if no refresh token is provided', async () => {
      const res = await request(app).get(`${API_BASE_URL}/auth/refresh`);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe(backendErrorsMap.INVALID_REFRESH_TOKEN);
    });
  });

  describe('GET /auth/csrf-token', () => {
    it('should return 200 and a csrf token for unauthenticated user', async () => {
      const res = await request(app).get(`${API_BASE_URL}/auth/csrf-token`);

      expect(res.status).toBe(200);
      expect(res.body.csrfToken).toBeTruthy();
      expect(
        getCookieDetails(res.headers['set-cookie'], VISITOR_ID_NAME).value,
      ).toBeTruthy();
      expect(
        getCookieDetails(res.headers['set-cookie'], CSRF_TOKEN_NAME).value,
      ).toBeTruthy();
    });

    it('should reuse existing visitorId if already set', async () => {
      const agent = request.agent(app);
      const initRes = await agent.get(`${API_BASE_URL}/auth/csrf-token`);

      const res = await agent.get(`${API_BASE_URL}/auth/csrf-token`);

      expect(res.status).toBe(200);
      expect(res.body.csrfToken).toBeTruthy();
      expect(initRes.headers['set-cookie'].join('')).toContain(VISITOR_ID_NAME);
      expect(res.headers['set-cookie'].join('')).not.toContain(VISITOR_ID_NAME);
    });

    it('should return 403 if token generation fails', async () => {
      const agent = request.agent(app);

      await agent
        .set('Cookie', `${VISITOR_ID_NAME}=1`)
        .get(`${API_BASE_URL}/auth/csrf-token`);
      const res = await agent
        .set('Cookie', `${VISITOR_ID_NAME}=2`)
        .get(`${API_BASE_URL}/auth/csrf-token`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(backendErrorsMap.CSRF_INVALID_TOKEN);
    });
  });
});
