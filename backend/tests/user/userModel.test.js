// @ts-nocheck
const pool = require('../../config/db');
const User = require('../../models/userModel');

jest.mock('../../config/db');

describe('User model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and return their role', async () => {
      const mockUser = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'hashedpassword',
      };

      const mockRoleId = 2;
      const mockRoleName = 'user';

      pool.query
        .mockResolvedValueOnce({ rows: [{ roleId: mockRoleId }] }) // insert
        .mockResolvedValueOnce({ rows: [{ name: mockRoleName }] }); // select role

      const result = await User.register(
        mockUser.firstName,
        mockUser.lastName,
        mockUser.email,
        mockUser.password,
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        `INSERT INTO users ("firstName", "lastName",email,password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING users."roleId"`,
        [
          mockUser.firstName,
          mockUser.lastName,
          mockUser.email,
          mockUser.password,
        ],
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        `SELECT roles.name
      FROM roles
      WHERE id = $1
      `,
        [mockRoleId],
      );

      expect(result).toEqual({ role: mockRoleName });
    });

    it('should throw if insert fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('Insert failed'));

      await expect(User.register('A', 'B', 'a@b.com', 'pass')).rejects.toThrow(
        'Insert failed',
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        password: 'hashed',
        role: 'admin',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.getUserByEmail(mockUser.email);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT users.id, users."firstName", users."lastName", users.email, users.password, roles.name as role  
      FROM users
      LEFT JOIN roles ON users."roleId" = roles.id
      WHERE email=$1`,
        [mockUser.email],
      );

      expect(result).toEqual(mockUser);
    });

    it('should return undefined if no user found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await User.getUserByEmail('notfound@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const mockUser = {
        id: 2,
        firstName: 'Bob',
        lastName: 'Stone',
        email: 'bob@example.com',
        role: 'user',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.getUserById(2);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT users.id, users."firstName", users."lastName", users.email, roles.name as role  
      FROM users
      LEFT JOIN roles ON users."roleId" = roles.id
      WHERE users.id=$1`,
        [2],
      );

      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUserById', () => {
    it('should delete user and return deleted row', async () => {
      const mockUser = {
        id: 3,
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@example.com',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.deleteUserById(3);

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM users
      WHERE id=$1`,
        [3],
      );

      expect(result).toEqual(mockUser);
    });

    it('should return undefined if user not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await User.deleteUserById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getUsers', () => {
    it('should return paginated users and total count', async () => {
      const mockUsers = [
        {
          id: 1,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          role: 'admin',
        },
      ];

      const mockCount = [{ total: '1' }];

      pool.query
        .mockResolvedValueOnce({ rows: mockUsers })
        .mockResolvedValueOnce({ rows: mockCount });

      const result = await User.getUsers(1, 10);

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT users.id, users."firstName", users."lastName", users.email, roles.name as role 
      FROM users 
      LEFT JOIN roles on users."roleId" = roles.id
      LIMIT $1 OFFSET $2`,
        [10, 0],
      );

      expect(pool.query).toHaveBeenCalledWith(
        `SELECT COUNT(*) AS total FROM users`,
      );

      expect(result).toEqual({
        users: mockUsers,
        total: 1,
      });
    });

    it('should handle no users found', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ total: '0' }] });

      const result = await User.getUsers(1, 10);

      expect(result).toEqual({ users: [], total: 0 });
    });
  });
});
