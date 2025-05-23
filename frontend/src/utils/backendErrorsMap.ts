const capitalise = (val: string = '') =>
  val && val[0].toUpperCase() + val.slice(1);

export const backendErrorsMap = {
  DUBLICATE_KEY: (prop?: string) => `${capitalise(prop)} already used!`,
  INVALID_CREDENTIALS: () => `Invalid credentials!`,
  RATE_LIMITED: () => 'You have send too many requests. Try again later!',
  INTERNAL_SERVER_ERROR: () => 'Something went wrong, please try again later!',
  UNAUTHENTICATED: () => 'Please, login!',
  INVALID_INPUT: () => 'Invalid input, please try again!',
  ACTION_FORBIDDEN: () => 'This action is currently forbidden!',
  INVALID_QUERY_PARAMETERS: () =>
    'Something went wrong, please try again later!',
  NOT_FOUND: () => 'Resource not found!',
  CSRF_INVALID_TOKEN: () =>
    'Your session may have expired! Please, refresh the page!',
  INSUFFICIENT_ROLE: () => "You don't have the required access level!",
};

export const backendErrorsNames = {
  DUBLICATE_KEY: 'DUBLICATE_KEY',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  INVALID_INPUT: 'INVALID_INPUT',
  ACTION_FORBIDDEN: 'ACTION_FORBIDDEN',
  INVALID_QUERY_PARAMETERS: 'INVALID_QUERY_PARAMETERS',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  CSRF_INVALID_TOKEN: 'CSRF_INVALID_TOKEN',
  INSUFFICIENT_ROLE: 'INSUFFICIENT_ROLE',
};
