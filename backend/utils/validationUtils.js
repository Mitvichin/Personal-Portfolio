const isEmailValid = (email) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) {
    return true;
  }

  return false;
};

const isNameValid = (name) => {
  if (typeof name !== 'string') {
    return false;
  }

  if (name.length > 100 || name.length < 2) {
    return false;
  }

  return true;
};

const isPasswordValid = (pass) => {
  if (typeof pass !== 'string') {
    return false;
  }

  if (pass.length > 100 || pass.length < 4) {
    return false;
  }

  return true;
};

const isMessageValid = (message) => {
  if (typeof message !== 'string') {
    return false;
  }

  if (message.length > 1024 || message.length < 2) {
    return false;
  }

  return true;
};

const isMessageFormValid = ({ firstName, lastName, email, message }) =>
  isNameValid(firstName) &&
  isNameValid(lastName) &&
  isEmailValid(email) &&
  isMessageValid(message);

const isGridValid = (grid) => {
  const isArray = Array.isArray(grid);

  if (!isArray || !Array.isArray(grid[0])) {
    return false;
  }
  const rows = grid.length;
  const cols = grid[0]?.length;

  if (rows * cols > 2056) {
    return false;
  }

  if (rows * cols === 0) {
    return false;
  }

  return true;
};

const isUserValid = ({ firstName, lastName, email, password }) =>
  isNameValid(firstName) &&
  isNameValid(lastName) &&
  isEmailValid(email) &&
  isPasswordValid(password);

const isLoginValid = ({ email, password }) => {
  return isEmailValid(email) && isPasswordValid(password);
};

module.exports = {
  isMessageFormValid,
  isGridValid,
  isUserValid,
  isLoginValid,
};
