import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Should pick up .env in backend/ since we'll run from there

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const sqlPath = './migrations/002_teacher_and_approval_updates.sql';
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    console.log('Applying migration 002...');
    await pool.query(sql);
    console.log('Migration applied successfully!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    if (err.message.includes('already exists') || err.message.includes('already a member')) {
       console.log('Possible partial application or existing state detected.');
    }
  } finally {
    await pool.end();
  }
}

run();
