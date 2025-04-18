const jwt = require("jsonwebtoken");
const backendErrorsMap = require("../utils/errorNames");

const verifyAuthentication = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: backendErrorsMap.UNAUTHENTICATED });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: backendErrorsMap.UNAUTHENTICATED });
    req.user = user;
    next();
  });
};

module.exports = verifyAuthentication;
