// @ts-nocheck
const githubController = require('../../controllers/githubController');
const backendErrorsMap = require('../../utils/errorNames');

global.fetch = jest.fn();

describe('GitHub Controller', () => {
  describe('getFileContent', () => {
    it('should return 400 if query parameters are missing', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await githubController.getFileContent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INVALID_QUERY_PARAMETERS,
      });
    });

    it('should return 404 if file is not found', async () => {
      const req = { query: { searchWord: 'test', filePath: '/testFile.js' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      global.fetch.mockResolvedValueOnce({
        json: () => ({ items: [] }),
      });

      await githubController.getFileContent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.NOT_FOUND,
      });
    });

    it('should return file content and URL when file is found', async () => {
      const req = { query: { searchWord: 'test', filePath: '/testFile.js' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      global.fetch.mockResolvedValueOnce({
        json: () => ({
          items: [
            {
              path: 'frontend/testFile.js',
              url: 'https://api.github.com/files/1',
              html_url: 'https://github.com/file/1',
            },
          ],
        }),
      });

      global.fetch.mockResolvedValueOnce({
        text: () => 'File Content',
      });

      await githubController.getFileContent(req, res);

      expect(res.json).toHaveBeenCalledWith({
        content: 'File Content',
        url: 'https://github.com/file/1',
      });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { query: { searchWord: 'test', filePath: '/testFile.js' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await githubController.getFileContent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: backendErrorsMap.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
