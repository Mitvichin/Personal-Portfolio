// @ts-nocheck
const {
  isMessageFormValid,
  isGridValid,
  isUserValid,
  isLoginValid,
} = require('../../utils/validationUtils');

describe('Validation Utils', () => {
  describe('isMessageFormValid', () => {
    it('returns true for valid input', () => {
      const form = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Hello there!',
      };
      expect(isMessageFormValid(form)).toBe(true);
    });

    it('returns false for invalid email', () => {
      const form = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        message: 'Hi',
      };
      expect(isMessageFormValid(form)).toBe(false);
    });

    it('returns false for too short name', () => {
      const form = {
        firstName: 'J',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Hi',
      };
      expect(isMessageFormValid(form)).toBe(false);
    });

    it('returns false for too long message', () => {
      const form = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'a'.repeat(1025),
      };
      expect(isMessageFormValid(form)).toBe(false);
    });
  });

  describe('isGridValid', () => {
    it('returns true for valid 2D grid under 2056 cells', () => {
      const grid = Array(10).fill(Array(10).fill(0));
      expect(isGridValid(grid)).toBe(true);
    });

    it('returns false for non-array input', () => {
      expect(isGridValid(null)).toBe(false);
    });

    it('returns false for empty grid', () => {
      expect(isGridValid([])).toBe(false);
    });

    it('returns false for grid over size limit', () => {
      const grid = Array(100).fill(Array(21).fill(0));
      expect(isGridValid(grid)).toBe(false);
    });

    it('returns false if rows are not arrays', () => {
      const grid = [123, 456];
      expect(isGridValid(grid)).toBe(false);
    });
  });

  describe('isUserValid', () => {
    it('returns true for valid user data', () => {
      const user = {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        password: 'securePass123',
      };
      expect(isUserValid(user)).toBe(true);
    });

    it('returns false for missing fields', () => {
      const user = {
        firstName: '',
        lastName: 'Smith',
        email: 'bad-email',
        password: '',
      };
      expect(isUserValid(user)).toBe(false);
    });

    it('returns false for short password', () => {
      const user = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        password: '123',
      };
      expect(isUserValid(user)).toBe(false);
    });
  });

  describe('isLoginValid', () => {
    it('returns true for valid email and password', () => {
      expect(
        isLoginValid({ email: 'user@example.com', password: 'strongpass' }),
      ).toBe(true);
    });

    it('returns false for invalid email', () => {
      expect(isLoginValid({ email: 'bad', password: 'strongpass' })).toBe(
        false,
      );
    });

    it('returns false for invalid password', () => {
      expect(isLoginValid({ email: 'user@example.com', password: '123' })).toBe(
        false,
      );
    });
  });
});
