const bcrypt       = require('bcryptjs');
const { query }    = require('../config/prisma');

const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    const err = new Error('Name, email and password are required');
    err.statusCode = 400; throw err;
  }

  const exists = await query(`SELECT id FROM "User" WHERE email = $1`, [email]);
  if (exists.rows.length) {
    const err = new Error('Email already in use'); err.statusCode = 409; throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const res = await query(
    `INSERT INTO "User" (name, email, "passwordHash") VALUES ($1,$2,$3)
     RETURNING id, name, email, "createdAt"`,
    [name, email, passwordHash]
  );
  return res.rows[0];
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    const err = new Error('Email and password are required'); err.statusCode = 400; throw err;
  }
  const res = await query(`SELECT * FROM "User" WHERE email = $1`, [email]);
  const user = res.rows[0];
  if (!user) { const err = new Error('Invalid credentials'); err.statusCode = 401; throw err; }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) { const err = new Error('Invalid credentials'); err.statusCode = 401; throw err; }

  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
};

module.exports = { registerUser, loginUser };
