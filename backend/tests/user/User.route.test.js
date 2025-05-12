// @ts-nocheck
const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const createTables = require('../../migrations/init_db');
const redis = require('../../config/redis');
const {
  populateUsers,
  deleteFromAllTables: deleteUsersAndRoles,
  adminUser,
  user,
  login,
  getCSRFToken,
} = require('../testUtils');
const { API_BASE_URL, JWT_TOKEN_NAME } = require('../../utils/constants');
const backendErrorsMap = require('../../utils/errorNames');

jest.mock('../../middlewares/rateLimit', () =>
  jest.fn((req, res, next) => next()),
);

const agent = request.agent(app);

describe('User route', () => {
  beforeAll(async () => {
    await createTables(pool);
    await populateUsers(pool);

    await login(agent, adminUser);
  });

  afterAll(async () => {
    await deleteUsersAndRoles(pool);
    await pool.end();
  });

  describe('GET /user', () => {
    it('should return paginated users with status 200', async () => {
      const res = await agent.get(`${API_BASE_URL}/user?page=1&limit=10`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
      });
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get(`${API_BASE_URL}/user`);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe(backendErrorsMap.UNAUTHENTICATED);
    });

    it('should cache the result', async () => {
      const res = await agent.get(`${API_BASE_URL}/message?page=1&limit=10`);

      expect(res.status).toBe(200);
      expect(redis.setex).toHaveBeenCalled();
    });

    it('should return result from cache', async () => {
      const data = 'test value';
      redis.get.mockReturnValue(data);
      const res = await agent.get(`${API_BASE_URL}/message?page=1&limit=10`);

      expect(res.status).toBe(200);
      expect(res.body).toBe(data);
    });
  });

  describe('DELETE /user', () => {
    let tempUserId;

    it('should delete a non-admin user and return 200', async () => {
      const newUserRes = await pool.query(
        `INSERT INTO users ("firstName", "lastName", email, password, "roleId")
             VALUES ('Temp', 'User', 'temp1234@example.com', 'hashedpassword', 2)
             RETURNING id`,
      );
      tempUserId = newUserRes.rows[0].id;

      const res = await agent
        .delete(`${API_BASE_URL}/user`)
        .send({ id: tempUserId });

      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(tempUserId);
    });

    it('should return 403 when attempting to delete an admin', async () => {
      const res = await agent.delete(`${API_BASE_URL}/user`).send({ id: 1 });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(backendErrorsMap.ACTION_FORBIDDEN);
    });

    it('should return 404 if user is not found', async () => {
      const res = await agent
        .post(`${API_BASE_URL}/auth/delete`)
        .send({ id: 999999 });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(backendErrorsMap.NOT_FOUND);
    });

    it('should return 403 if non-admin tries to delete a user', async () => {
      let userAgent = request.agent(app);
      await login(userAgent, user);

      const deleteRes = await userAgent
        .delete(`${API_BASE_URL}/user`)
        .send({ id: 2 });

      expect(deleteRes.status).toBe(403);
      expect(deleteRes.body.message).toBe(backendErrorsMap.INSUFFICIENT_ROLE);
    });

    it('should return 401 if no token is provided', async () => {
      const noAuthAgent = request.agent(app);

      await getCSRFToken(noAuthAgent);

      const deleteRes = await noAuthAgent
        .delete(`${API_BASE_URL}/user`)
        .send({ id: 2 });

      expect(deleteRes.status).toBe(401);
      expect(deleteRes.body.message).toBe(backendErrorsMap.UNAUTHENTICATED);
    });

    it('should return 403 if csrf is incorrect', async () => {
      const deleteRes = await request(app)
        .delete(`${API_BASE_URL}/user`)
        .send({ id: 2 });

      expect(deleteRes.status).toBe(403);
      expect(deleteRes.body.message).toBe(backendErrorsMap.CSRF_INVALID_TOKEN);
    });
  });
});
