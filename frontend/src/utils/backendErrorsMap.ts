const capitalise = (val: string) => val[0].toUpperCase() + val.slice(1);

export const backendErrorsMap = {
  DUBLICATE_KEY: (prop: string) => `${capitalise(prop)} already used!`,
  INVALID_CREDENTIALS: (prop: string) => `Invalid ${prop}!`,
};
