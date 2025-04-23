const isEmail = (email) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) {
    return true;
  }

  return false;
};

const validateMessage = ({ firstName, lastName, email, message }) => {
  if (firstName.length > 100) {
    return true;
  }

  if (firstName.length < 2) {
    return true;
  }

  if (lastName.length > 100) {
    return true;
  }

  if (lastName.length < 2) {
    return true;
  }

  if (!isEmail(email)) {
    return true;
  }

  if (message.length > 1024) {
    return true;
  }

  if (message.length < 2) {
    return true;
  }

  return false;
};

const validateGrid = (grid) => {
  const isArray = Array.isArray(grid);
  const rows = grid.length;
  const cols = grid[0]?.length;

  if (isArray && !Array.isArray(grid[0])) {
    return true;
  }

  if (rows * cols > 2056) {
    return true;
  }

  if (rows * cols === 0) {
    return true;
  }

  return false;
};

const validateUser = ({ firstName, lastName, email, password }) => {
  if (firstName.length > 100) {
    return true;
  }

  if (firstName.length < 2) {
    return true;
  }

  if (lastName.length > 100) {
    return true;
  }

  if (lastName.length < 2) {
    return true;
  }

  if (!isEmail(email)) {
    return true;
  }

  if (password.length > 100) {
    return true;
  }

  if (password.length < 4) {
    return true;
  }

  return false;
};

const validateLogin = ({ email, password }) => {
  if (!isEmail(email)) {
    return true;
  }

  if (password.length > 100) {
    return true;
  }

  if (password.length < 4) {
    return true;
  }

  return false;
};

module.exports = {
  validateMessage,
  validateGrid,
  validateUser,
  validateLogin,
};
