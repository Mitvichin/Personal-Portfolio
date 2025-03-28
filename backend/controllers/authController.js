const User = require("../models/authModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateUser } = require("../utils/validationUtils");
const dbErrorsMap = require("../utils/dbErrorsMap");
const backendErrorsMap = require("../utils/errorNames");

const messageController = {
  async register(req, res) {
    let [errors, isInvalid] = validateUser(req.body);

    if (isInvalid) {
      res.status(400).json(errors);
      return;
    }

    try {
      const { firstName, lastName, email, password } = req.body;

      const hashedPass = await bcryptjs.hash(
        password,
        Number(process.env.SALT_ROUNDS)
      );

      await User.register(firstName, lastName, email, hashedPass);

      res.status(201).json({ firstName, lastName, email });
    } catch (error) {
      if (
        error.code &&
        dbErrorsMap[error.code] &&
        error.constraint.includes("email")
      ) {
        res
          .status(400)
          .json({ message: dbErrorsMap[error.code], key: "email" });
        return;
      }
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async login(req, res) {
    try {
      const body = req.body;
      const { id, firstName, lastName, email, password } =
        await User.getUserByEmail(body.email);

      if (await bcryptjs.compare(body.password, password)) {
        const token = jwt.sign(
          { id: id, username: email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1m",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });

        res.status(200).json({ id, firstName, lastName, email });
        return;
      } else {
        res.status(400).json({ message: backendErrorsMap.INVALID_CREDENTIALS });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
    }
  },

  async logout(_, res) {
    res.clearCookie("token");
    res.status(204).send();
  },
};

module.exports = messageController;
