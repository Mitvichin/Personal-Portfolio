const backendErrorsMap = require('../utils/errorNames');

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: backendErrorsMap.INSUFFICIENT_ROLE });
    }

    next();
  };
};

module.exports = requireRole;
