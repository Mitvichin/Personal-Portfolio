const capitalise = (val: string = "") =>
  val && val[0].toUpperCase() + val.slice(1);

export const backendErrorsMap = {
  DUBLICATE_KEY: (prop?: string) => `${capitalise(prop)} already used!`,
  INVALID_CREDENTIALS: () => `Invalid credentials!`,
  ACCESS_DENIED: () => "In order to perform this action, you need to log in!",
  RATE_LIMITED: () => "You have send too many requests. Try again later!",
  INTERNAL_SERVER_ERROR: () => "Something went wrong, please try again later!",
};
