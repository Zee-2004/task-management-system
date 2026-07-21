import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { pool } from './config/db';

const PORT = process.env.PORT || 5000;

pool
  .query('SELECT 1')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  });