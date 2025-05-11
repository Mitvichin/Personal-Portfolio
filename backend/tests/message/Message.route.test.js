const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const createTables = require('../../migrations/init_db');
const { API_BASE_URL } = require('../../utils/constants');
const backendErrorsMap = require('../../utils/errorNames');
const {
  populateUsers,
  deleteFromAllTables,
  adminUser,
  user,
  login,
} = require('../testUtils');

jest.mock('../../middlewares/rateLimit', () =>
  jest.fn((req, res, next) => next()),
);

const agent = request.agent(app);

describe('Message route', () => {
  beforeAll(async () => {
    await createTables(pool);
    await populateUsers(pool);

    await login(agent, adminUser);
  });

  afterAll(async () => {
    await deleteFromAllTables(pool);
    await pool.end();
  });

  describe('GET /message', () => {
    it('should return paginated messages with status 200', async () => {
      const res = await agent.get(`${API_BASE_URL}/message?page=1&limit=10`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
      });
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get(`${API_BASE_URL}/message`);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe(backendErrorsMap.UNAUTHENTICATED);
    });
  });

  describe('POST /message', () => {
    it('should create a new message and return 201', async () => {
      const newMessage = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        message: 'Hello, world!',
      };

      const res = await agent.post(`${API_BASE_URL}/message`).send(newMessage);

      expect(res.status).toBe(201);

      const dbRes = await pool.query('SELECT * FROM messages');
      expect(dbRes.rowCount).toBe(1);

      const dbMessage = dbRes.rows[0];
      expect(dbMessage.firstName).toBe(newMessage.firstName);
      expect(dbMessage.lastName).toBe(newMessage.lastName);
      expect(dbMessage.email).toBe(newMessage.email);
      expect(dbMessage.message).toBe(newMessage.message);
    });

    it('should return 400 for invalid message input', async () => {
      const invalidMessage = {};

      const res = await agent
        .post(`${API_BASE_URL}/message`)
        .send(invalidMessage);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(backendErrorsMap.INVALID_INPUT);
    });

    it('should return 403 when csrf token is incorrect', async () => {
      const userAgent = request.agent(app);

      const res = await userAgent.post(`${API_BASE_URL}/message`).send({});

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(backendErrorsMap.CSRF_INVALID_TOKEN);
    });
  });

  describe('DELETE /message', () => {
    it('should return 404 if message is not found for deletion', async () => {
      const res = await agent
        .delete(`${API_BASE_URL}/message`)
        .send({ id: 999 });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(backendErrorsMap.NOT_FOUND);
    });

    it('should delete a message and return 200', async () => {
      const messageToDelete = {
        firstName: 'ToDelete',
        lastName: 'Message',
        email: 'delete@example.com',
        message: 'Delete me',
      };

      const createRes = await agent
        .post(`${API_BASE_URL}/message`)
        .send(messageToDelete);

      const messageId = createRes.body.id;

      const res = await agent
        .delete(`${API_BASE_URL}/message`)
        .send({ id: messageId });

      expect(res.status).toBe(200);
      expect(res.body.message.id).toBe(messageId);
    });

    it('should return 403 when non-admin user tries to delete', async () => {
      const userAgent = request.agent(app);

      await login(userAgent, user);

      const res = await userAgent
        .delete(`${API_BASE_URL}/message`)
        .send({ id: '1' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(backendErrorsMap.INSUFFICIENT_ROLE);
    });

    it('should return 403 when csrf token is incorrect', async () => {
      const userAgent = request.agent(app);

      const res = await userAgent
        .delete(`${API_BASE_URL}/message`)
        .send({ id: '1' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(backendErrorsMap.CSRF_INVALID_TOKEN);
    });
  });
});
