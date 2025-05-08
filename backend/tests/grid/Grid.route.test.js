const request = require('supertest');
const app = require('../../app');
const pool = require('../../config/db');
const createTables = require('../../migrations/init_db');
const {
  API_BASE_URL,
  CSRF_TOKEN_NAME,
  VISITOR_ID_NAME,
} = require('../../utils/constants');
const backendErrorsMap = require('../../utils/errorNames');
const {
  populateUsers,
  deleteFromAllTables,
  getCSRFToken,
} = require('../testUtils');

const agent = request.agent(app);

describe('Grid route', () => {
  beforeAll(async () => {
    await createTables(pool);
    await populateUsers(pool);

    await getCSRFToken(agent);
  });

  afterAll(async () => {
    await pool.end();
    await deleteFromAllTables(pool);
  });

  describe('POST /grid', () => {
    it('should save gird into db', async () => {
      const grid = [
        ['t', 'e', 's', 't'],
        ['', 'e', '', ''],
      ];

      const res = await agent.post(`${API_BASE_URL}/grid`).send({ grid });

      expect(res.status).toBe(201);

      const dbRes = await pool.query(`SELECT * FROM grids`);

      expect(dbRes.rowCount).toBe(1);

      const dbGrid = dbRes.rows[0].grid;

      for (let i = 0; i < grid.length; i++) {
        let row = grid[i];
        expect(row.join('')).toEqual(dbGrid[i].join(''));
      }
    });

    it('should return 400 for invalid grid', async () => {
      const invalidGrid = [];

      const res = await agent
        .post(`${API_BASE_URL}/grid`)
        .send({ grid: invalidGrid });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(backendErrorsMap.INVALID_INPUT);
    });
  });
});
