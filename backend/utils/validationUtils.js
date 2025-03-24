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

  if (lastName.length > 100) {
    isInvalid = true;
    errorObject.lastName = "execeeds 100 chars";
  }

  if (!isEmail(email)) {
    isInvalid = true;
    errorObject.email = "Invalid email format";
  }

  if (message.length > 1024) {
    isInvalid = true;
    errorObject.message = "execeeds 1024 chars";
  }

  return [errorObject, isInvalid];
};

const validateGrid = (grid) => {
  const isArray = Array.isArray(grid);
  const rows = grid.length;
  const cols = grid[0]?.length;
  const errorObject = {
    grid: "",
  };

  if (isArray && !Array.isArray(grid[0])) {
    errorObject.grid = "Grid is in wrong format";
    return [errorObject, true];
  }

  if (rows * cols > 2056) {
    errorObject.grid = "Grid execeeds 2056 length";
    return [errorObject, true];
  }

  if (rows * cols === 0) {
    errorObject.grid = "Grid is empty";
    return [errorObject, true];
  }

  return [errorObject, false];
};

module.exports = {
  validateMessage,
  validateGrid,
};
