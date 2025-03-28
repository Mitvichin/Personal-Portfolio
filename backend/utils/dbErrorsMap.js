const backendErrorsMap = require("./errorNames");

const dbErrorsMap = {
  23505: backendErrorsMap.DUBLICATE_KEY,
};

module.exports = dbErrorsMap;
