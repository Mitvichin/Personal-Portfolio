const Grid = require("../models/gridModel");
const backendErrorsMap = require("../utils/errorNames");
const { validateGrid } = require("../utils/validationUtils");

const gridController = {
  async createGrid(req, res) {
    let { grid } = req.body;
    let [errors, isInvalid] = validateGrid(grid);

    if (isInvalid) {
      res.status(400).json(errors);
      return;
    }

    try {
      const { grid } = req.body;
      const newGrid = await Grid.createGrid(grid);
      res.status(201).json(newGrid);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },
};

module.exports = gridController;
