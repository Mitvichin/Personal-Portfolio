const backendErrorsMap = require('../utils/errorNames');

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ message: backendErrorsMap.UNAUTHENTICATED });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: backendErrorsMap.ACTION_FORBIDDEN });
    }

    next();
  };
};

module.exports = requireRole;
