require('dotenv').config({ path: './.env' });

jest.mock('@upstash/ratelimit', () => {
  return {
    Ratelimit: class {
      static fixedWindow() {
        return {};
      }
      constructor() {}
      limit() {
        return Promise.resolve({ success: true });
      }
    },
  };
});
