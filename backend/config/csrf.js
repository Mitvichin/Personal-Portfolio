const { doubleCsrf } = require("csrf-csrf");

const doubleCsrfOptions = {
  getSecret: () => process.env.CSRF_SECRET || "default_secret",
  cookieName: "csrf_token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
};

module.exports = doubleCsrf(doubleCsrfOptions);
