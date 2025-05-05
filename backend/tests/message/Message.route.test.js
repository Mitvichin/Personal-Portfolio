const request = require('supertest');
const server = require('../../');
const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const createTables = require('../../migrations/init_db');
const { API_BASE_URL, JWT_TOKEN_NAME } = require('../../utils/constants');
const backendErrorsMap = require('../../utils/errorNames');
const { populateUsers, deleteUsersAndRoles } = require('../utils');

describe('Message route', () => {
  let adminToken = {};
  beforeAll(async () => {
    await createTables(pool);
    await populateUsers(pool);
    adminToken = jwt.sign(
      { user: { id: 1, role: 'admin' } },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
  });

  afterAll(async () => {
    await deleteUsersAndRoles(pool);
    await pool.end();
    server.close();
  });

  it('should create a new message and return 201', async () => {
    const newMessage = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      message: 'Hello, world!',
    };

    const res = await request(server)
      .post(`${API_BASE_URL}/message`)
      .set('Cookie', `${JWT_TOKEN_NAME}=${adminToken}`)
      .send(newMessage);

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

    const res = await request(server)
      .post(`${API_BASE_URL}/message`)
      .set('Cookie', `${JWT_TOKEN_NAME}=${adminToken}`)
      .send(invalidMessage);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(backendErrorsMap.INVALID_INPUT);
  });

  it('should return 404 if message is not found for deletion', async () => {
    const res = await request(server)
      .delete(`${API_BASE_URL}/message`)
      .set('Cookie', `${JWT_TOKEN_NAME}=${adminToken}`)
      .send({ id: 999 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(backendErrorsMap.NOT_FOUND);
  });

  it('should delete a message and return 200', async () => {
    // First, create a message to delete
    const messageToDelete = {
      firstName: 'ToDelete',
      lastName: 'Message',
      email: 'delete@example.com',
      message: 'Delete me',
    };

    const createRes = await request(server)
      .post(`${API_BASE_URL}/message`)
      .set('Cookie', `${JWT_TOKEN_NAME}=${adminToken}`)
      .send(messageToDelete);

    const messageId = createRes.body.id;

    const res = await request(server)
      .delete(`${API_BASE_URL}/message`)
      .set('Cookie', `${JWT_TOKEN_NAME}=${adminToken}`)
      .send({ id: messageId });

    expect(res.status).toBe(200);
    expect(res.body.message.id).toBe(messageId);
  });

  it('should return 403 when non-admin user tries to delete', async () => {
    const messageToDelete = {
      firstName: 'ToDelete',
      lastName: 'Message',
      email: 'delete@example.com',
      message: 'Delete me',
    };

    const userToken = jwt.sign(
      { user: { id: 1, role: 'user' } },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    const createRes = await request(server)
      .post(`${API_BASE_URL}/message`)
      .set('Cookie', `${JWT_TOKEN_NAME}=${userToken}`)
      .send(messageToDelete);

    const messageId = createRes.body.id;

    const res = await request(server)
      .delete(`${API_BASE_URL}/message`)
      .set('Cookie', `${JWT_TOKEN_NAME}=${userToken}`)
      .send({ id: messageId });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(backendErrorsMap.INSUFFICIENT_ROLE);
  });
});
