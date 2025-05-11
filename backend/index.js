// @ts-nocheck
require('dotenv').config({ path: './.env' });
const app = require('./app.js');
require('./cleanup.js');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

module.exports = server;
