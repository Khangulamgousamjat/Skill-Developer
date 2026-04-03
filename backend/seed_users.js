import pool from './src/config/db.js';
import bcrypt from 'bcryptjs';

async function run() {
  try {
    const hrHash = await bcrypt.hash('HrAdmin@12', 10);
    const manHash = await bcrypt.hash('Manager@12', 10);
    const teacherHashed = await bcrypt.hash('Teacher@12', 10);

    await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role, is_email_verified, account_status) VALUES ('HR Manager', 'hr@nrcinnovatex.com', $1, 'hr_admin', true, 'active') ON CONFLICT (email) DO NOTHING",
      [hrHash]
    );

    await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role, is_email_verified, account_status) VALUES ('Tech Manager', 'manager@nrcinnovatex.com', $1, 'manager', true, 'active') ON CONFLICT (email) DO NOTHING",
      [manHash]
    );

    await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role, is_email_verified, account_status) VALUES ('Professor Oak', 'teacher@nrcinnovatex.com', $1, 'teacher', true, 'active') ON CONFLICT (email) DO NOTHING",
      [teacherHashed]
    );

    console.log('Dummy HR, Manager, and Teacher users created successfully.');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    process.exit(0);
  }
}

run();
