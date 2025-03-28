const isEmail = (email) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
};

const validateMessage = ({ firstName, lastName, email, message }) => {
  const errorObject = {
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  };
  let isInvalid = false;

  if (firstName.length > 100) {
    isInvalid = true;
    errorObject.firstName = "execeeds 100 chars";
  }

  if (firstName.length < 2) {
    isInvalid = true;
    errorObject.firstName = "is below 2 chars";
  }

  if (lastName.length > 100) {
    isInvalid = true;
    errorObject.lastName = "execeeds 100 chars";
  }

  if (lastName.length < 2) {
    isInvalid = true;
    errorObject.lastName = "is below 2 chars";
  }

  if (!isEmail(email)) {
    isInvalid = true;
    errorObject.email = "Invalid email format";
  }

  if (message.length > 1024) {
    isInvalid = true;
    errorObject.message = "execeeds 1024 chars";
  }

  if (message.length < 2) {
    isInvalid = true;
    errorObject.message = "is below 2 chars";
  }

  return [errorObject, isInvalid];
};

const validateGrid = (grid) => {
  const isArray = Array.isArray(grid);
  const rows = grid.length;
  const cols = grid[0]?.length;
  const errorObject = {
    message: "",
  };

  if (isArray && !Array.isArray(grid[0])) {
    errorObject.message = "Grid is in wrong format";
    return [errorObject, true];
  }

  if (rows * cols > 2056) {
    errorObject.message = "Grid execeeds 2056 length";
    return [errorObject, true];
  }

  if (rows * cols === 0) {
    errorObject.message = "Grid is empty";
    return [errorObject, true];
  }

  return [errorObject, false];
};

const validateUser = ({ firstName, lastName, email, password }) => {
  const errorObject = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  let isInvalid = false;

  if (firstName.length > 100) {
    isInvalid = true;
    errorObject.firstName = "execeeds 100 chars";
  }

  if (firstName.length < 2) {
    isInvalid = true;
    errorObject.firstName = "is below 2 chars";
  }

  if (lastName.length > 100) {
    isInvalid = true;
    errorObject.lastName = "execeeds 100 chars";
  }

  if (lastName.length < 2) {
    isInvalid = true;
    errorObject.lastName = "is below 2 chars";
  }

  if (!isEmail(email)) {
    isInvalid = true;
    errorObject.email = "Invalid email format";
  }

  if (password.length > 100) {
    isInvalid = true;
    errorObject.lastName = "execeeds 100 chars";
  }

  if (password.length < 4) {
    isInvalid = true;
    errorObject.lastName = "is below 4 chars";
  }

  return [errorObject, isInvalid];
};

const validateLogin = ({ email, password }) => {
  const errorObject = {
    email: "",
    password: "",
  };
  let isInvalid = false;

  if (!isEmail(email)) {
    isInvalid = true;
    errorObject.email = "Invalid email format";
  }

  if (password.length > 100) {
    isInvalid = true;
    errorObject.lastName = "execeeds 100 chars";
  }

  if (password.length < 4) {
    isInvalid = true;
    errorObject.lastName = "is below 4 chars";
  }

  return [errorObject, isInvalid];
};

module.exports = {
  validateMessage,
  validateGrid,
  validateUser,
  validateLogin,
};
