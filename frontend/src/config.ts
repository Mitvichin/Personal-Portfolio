export const config = {
  githubToken: import.meta.env.VITE_GITHUB_ACCESSTOKEN,
};

export const csrfProtectedMethods: Record<string, boolean> = {
  PUT: true,
  POST: true,
  DELETE: true,
  PATCH: true,
};
