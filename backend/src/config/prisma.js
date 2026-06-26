const { Pool } = require('pg');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

console.log("DATABASE_URL EXISTS:", !!dbUrl);

if (dbUrl) {
  console.log(
    dbUrl.replace(/:\/\/(.*?):(.*?)@/, "://$1:****@")
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected database error', err);
});

// Simple query helper
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

module.exports = { pool, query };
