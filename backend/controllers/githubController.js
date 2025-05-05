const { logger, getLogMetaData } = require('../logger/winston');
const backendErrorsMap = require('../utils/errorNames');
const ROOT_FOLDER_NAME = 'frontend';

const githubController = {
  async getFileContent(req, res) {
    const { searchWord, filePath } = req.query;

    if (!searchWord || !filePath) {
      res
        .status(400)
        .json({ message: backendErrorsMap.INVALID_QUERY_PARAMETERS });
      return;
    }

    const query = `${encodeURIComponent(
      `"${searchWord}" repo:Mitvichin/Personal-Portfolio`,
    )} `;

    try {
      const response = await fetch(
        `https://api.github.com/search/code?q=${query}&type=text`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
            Accept: 'application/vnd.github.text-match+json',
          },
        },
      );

      const data = await response.json();

      const targetFile = data.items.find(
        (it) => it.path === ROOT_FOLDER_NAME + filePath,
      );

      if (!targetFile) {
        res.status(404).json({ message: backendErrorsMap.NOT_FOUND });
        return;
      }

      const fileUrl = targetFile?.url;
      const fileResponse = await fetch(fileUrl, {
        headers: { Accept: 'application/vnd.github.v3.raw' },
      });

      const content = await fileResponse.text();

      res.json({ content, url: targetFile.html_url });
    } catch {
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async findWord(req, res) {
    if (isInvalid) {
      res.status(400).json({ message: backendErrorsMap.INVALID_INPUT });
      return;
    }

    try {
      const { grid } = req.body;
      const newGrid = await Grid.createGrid(grid);

      res.status(201).json(newGrid);
    } catch (error) {
      logger.error(error, getLogMetaData(req, error));
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },
};

module.exports = githubController;
