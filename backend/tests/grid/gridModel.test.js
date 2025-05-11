// @ts-nocheck
const pool = require('../../config/db');
const Grid = require('../../models/gridModel');

jest.mock('../../config/db');

describe('Grid model', () => {
  describe('createGrid', () => {
    it('should insert a new grid and return the inserted row', async () => {
      const mockGrid = [['t'], ['d']];
      const mockRow = { id: 1, grid: mockGrid };

      pool.query.mockResolvedValue({ rows: [mockRow] });

      const result = await Grid.createGrid(mockGrid);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO grids (grid) VALUES ($1) RETURNING *',
        [mockGrid],
      );
      expect(result).toEqual(mockRow);
    });

    it('should throw an error if query fails', async () => {
      const mockGrid = [];
      const mockError = new Error('Database error');

      pool.query.mockRejectedValue(mockError);

      await expect(Grid.createGrid(mockGrid)).rejects.toThrow('Database error');
    });
  });
});
