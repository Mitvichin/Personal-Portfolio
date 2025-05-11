// @ts-nocheck
const request = require('supertest');
const app = require('../../app');
const { API_BASE_URL } = require('../../utils/constants');
const backendErrorsMap = require('../../utils/errorNames');
const { getCSRFToken } = require('../testUtils');

jest.mock('../../middlewares/rateLimit', () =>
  jest.fn((req, res, next) => next()),
);

const agent = request.agent(app);

describe('GitHub Routes', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /github', () => {
    it('should return 400 if query parameters are missing', async () => {
      const res = await agent.get(`${API_BASE_URL}/github/get-file-content`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(backendErrorsMap.INVALID_QUERY_PARAMETERS);
    });

    it('should return 404 if file is not found', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      });

      const res = await agent
        .get(`${API_BASE_URL}/github/get-file-content`)
        .query({ searchWord: 'test', filePath: '/testFile.js' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(backendErrorsMap.NOT_FOUND);
    });

    it('should return file content and URL if file is found', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            items: [
              {
                path: 'frontend/testFile.js',
                url: 'https://api.github.com/files/1',
                html_url: 'https://github.com/file/1',
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => 'File Content',
        });

      const res = await agent
        .get(`${API_BASE_URL}/github/get-file-content`)
        .query({ searchWord: 'test', filePath: '/testFile.js' });

      expect(res.status).toBe(200);
      expect(res.body.content).toBe('File Content');
      expect(res.body.url).toBe('https://github.com/file/1');
    });

    it('should return 500 if an error occurs during file fetch', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const res = await agent
        .get(`${API_BASE_URL}/github/get-file-content`)
        .query({ searchWord: 'test', filePath: '/testFile.js' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe(backendErrorsMap.INTERNAL_SERVER_ERROR);
    });
  });
});
