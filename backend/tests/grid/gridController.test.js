// @ts-nocheck
const gridController = require('../../controllers/gridController'); // adjust if needed
const Grid = require('../../models/gridModel');
const backendErrorsMap = require('../../utils/errorNames');
const validationUtils = require('../../utils/validationUtils');

jest.mock('../../models/gridModel');
jest.mock('../../utils/validationUtils');

describe('gridController', () => {
  let req, res;
  let validGrid = [
    ['t', 't'],
    ['e', 's'],
  ];

  beforeEach(() => {
    req = {
      body: {
        grid: validGrid,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 if grid is invalid', async () => {
    validationUtils.isGridValid.mockReturnValue(false);

    await gridController.createGrid(req, res);

    expect(validationUtils.isGridValid).toHaveBeenCalledWith(validGrid);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.INVALID_INPUT,
    });
  });

  it('should create a grid and return 201 with the new grid', async () => {
    const newGrid = { id: 1, grid: validGrid };

    validationUtils.isGridValid.mockReturnValue(true);
    Grid.createGrid.mockResolvedValue(newGrid);

    await gridController.createGrid(req, res);

    expect(Grid.createGrid).toHaveBeenCalledWith(validGrid);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newGrid);
  });

  it('should return 500 if an error occurs during creation', async () => {
    validationUtils.isGridValid.mockReturnValue(true);
    Grid.createGrid.mockRejectedValue(new Error('DB error'));

    await gridController.createGrid(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.INTERNAL_SERVER_ERROR,
    });
  });
});
