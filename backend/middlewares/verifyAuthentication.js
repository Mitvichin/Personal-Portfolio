const jwt = require('jsonwebtoken');
const backendErrorsMap = require('../utils/errorNames');
const { JWT_TOKEN_NAME } = require('../utils/constants');

const verifyAuthentication = (req, res, next) => {
  const token = req.cookies[JWT_TOKEN_NAME];

  if (!token)
    return res.status(401).json({ message: backendErrorsMap.UNAUTHENTICATED });

  jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      return res
        .status(401)
        .json({ message: backendErrorsMap.UNAUTHENTICATED });
    }

    req.user = token.user;
    next();
  });
};

module.exports = verifyAuthentication;
