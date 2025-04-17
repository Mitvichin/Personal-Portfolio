const backendErrorsMap = require("../utils/errorNames");

async function csrfErrorHandler(err, req, res, next) {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ message: backendErrorsMap.ACTION_FORBIDDEN });
  } else {
    next(err);
  }
}

module.exports = csrfErrorHandler;
