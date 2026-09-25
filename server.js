require('dotenv').config();

const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = Number(process.env.PORT || 3000);
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dairy_management',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

async function prepareUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(150),
      email VARCHAR(255),
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  for (const column of [
    'ALTER TABLE users ADD COLUMN full_name VARCHAR(150)',
    'ALTER TABLE users ADD COLUMN email VARCHAR(255)'
  ]) {
    try {
      await pool.query(column);
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password === 'change-this-before-starting') {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE username = username`,
    [username, passwordHash]
  );
}

app.post('/api/login', async (request, response) => {
  const { username, password } = request.body || {};

  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return response.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT username, password_hash FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    const user = rows[0];
    const validPassword = user && await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return response.status(401).json({ message: 'Invalid username or password.' });
    }

    return response.json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Login error:', error.message);
    return response.status(500).json({ message: 'Unable to process login.' });
  }
});

app.post('/api/signup', async (request, response) => {
  const { fullName, email, username, password } = request.body || {};

  if (
    typeof fullName !== 'string' ||
    typeof email !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !fullName.trim() ||
    !email.trim() ||
    !username.trim() ||
    password.length < 8
  ) {
    return response.status(400).json({
      message: 'Enter your name, email, username, and a password of at least 8 characters.'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO users (full_name, email, username, password_hash)
       VALUES (?, ?, ?, ?)`,
      [fullName.trim(), email.trim().toLowerCase(), username.trim(), passwordHash]
    );

    return response.status(201).json({
      message: 'Account created. You can now log in.'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({
        message: 'That username is already in use. Please choose another.'
      });
    }

    console.error('Signup error:', error.message);
    return response.status(500).json({ message: 'Unable to create account.' });
  }
});

prepareUsersTable()
  .then(() => {
    app.listen(port, () => {
      console.log(`Dairy login server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Could not start server:', error.message);
    process.exitCode = 1;
  });
