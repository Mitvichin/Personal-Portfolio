const bcryptjs = require('bcryptjs');

const adminTestUser = {
  password: 'adminpassword',
  email: 'admin@example.com',
};

const testUser = {
  password: 'userpassword',
  email: 'user@example.com',
};

const deleteUsersAndRoles = async (pool) => {
  try {
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM grids');
    await pool.query('DELETE FROM messages');

    console.log('✅ Success deleting from all tables');
  } catch (error) {
    console.error('❌ Error deleting users and roles:', error);
  }
};

const populateUsers = async (pool) => {
  try {
    await pool.query(
      `INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;`,
    );
    await pool.query(
      `INSERT INTO roles (name) VALUES ('user') ON CONFLICT (name) DO NOTHING;`,
    );

    const hashedAdminPassword = await bcryptjs.hash(
      adminTestUser.password,
      Number(process.env.SALT_ROUNDS),
    );
    const hashedUserPassword = await bcryptjs.hash(
      testUser.password,
      Number(process.env.SALT_ROUNDS),
    );

    const roles = await pool.query(
      `SELECT * FROM roles WHERE name IN ('admin', 'user')`,
    );

    const adminRoleId = roles.rows.find((role) => role.name === 'admin').id;
    const userRoleId = roles.rows.find((role) => role.name === 'user').id;

    await pool.query(
      `INSERT INTO users ("firstName", "lastName", email, password, "roleId") 
       VALUES ('Admin', 'User', $1, $2, $3) RETURNING *;`,
      [adminTestUser.email, hashedAdminPassword, adminRoleId],
    );

    await pool.query(
      `INSERT INTO users ("firstName", "lastName", email, password, "roleId") 
       VALUES ('John', 'Doe', $1, $2, $3) RETURNING *;`,
      [testUser.email, hashedUserPassword, userRoleId],
    );

    console.log('✅ Users created successfully!');
  } catch (error) {
    console.error('❌ Error creating users:', error);
  }
};

module.exports = {
  populateUsers,
  deleteUsersAndRoles,
  adminUser: adminTestUser,
  user: testUser,
};
