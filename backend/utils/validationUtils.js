const isEmail = (email) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
};

const validateInput = ({ firstName, lastName, email, message }) => {
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
    errorObject.email = "invalid email format";
  }

  if (message.length > 1024) {
    isInvalid = true;
    errorObject.message = "execeeds 1024 chars";
  }

  return [errorObject, isInvalid];
};

module.exports = validateInput;
