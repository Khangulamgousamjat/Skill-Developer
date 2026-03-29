import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { 
  sendEmailVerificationOTP, 
  sendPasswordResetOTP, 
  sendRequestReceivedEmail 
} from '../services/emailService.js';
import { generateOTP } from '../utils/generateOTP.js';
import { hashToken } from '../utils/hashToken.js';
import crypto from 'crypto';

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const registerStudent = async (req, res, next) => {
  try {
    const { full_name, email, password, department_id, phone } = req.body;
    
    // Check if user exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const userResult = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role, department_id, phone, account_status, is_email_verified)
       VALUES ($1, $2, $3, 'student', $4, $5, 'pending_email', false) RETURNING id, email`,
      [full_name, email, password_hash, department_id, phone]
    );

    const user = userResult.rows[0];

    // Create OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes
    await db.query(
      `INSERT INTO otp_verifications (user_id, otp_code, purpose, expires_at) VALUES ($1, $2, 'email_verify', $3)`,
      [user.id, otp, expiresAt]
    );

    // Send email
    try {
      await sendEmailVerificationOTP(user.email, full_name, otp);
    } catch (emailErr) {
      console.error('Email verification OTP failed:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.', data: { userId: user.id } });
  } catch (err) {
    next(err);
  }
};

export const registerStaff = async (req, res, next) => {
  try {
    const { full_name, email, password, requested_role, department_id, employee_id, reason } = req.body;
    
    // Validate role
    if (!['manager', 'hr_admin', 'expert'].includes(requested_role)) {
      return res.status(400).json({ success: false, message: 'Invalid role requested' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user with pending_approval 
    // Wait, staff needs email verification first according to rules? 
    // Let's assume they get approved directly or we set them to pending_approval. Prompt says: staff fills form -> wait for approval.
    const userResult = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role, department_id, employee_id, account_status, access_reason)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending_approval', $7) RETURNING id, email`,
      [full_name, email, password_hash, 'student', department_id, employee_id, reason] // base role is student until approved
    );

    const user = userResult.rows[0];

    await db.query(
      `INSERT INTO role_requests (user_id, requested_role, department_id, employee_id, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, requested_role, department_id, employee_id, reason]
    );

    try {
      await sendRequestReceivedEmail(user.email, full_name, requested_role);
    } catch (emailErr) {
      console.error('Staff request received email failed:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Request submitted for approval.', data: { userId: user.id } });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const userResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const user = userResult.rows[0];

    // Find the latest unused OTP
    const otpResult = await db.query(
      `SELECT * FROM otp_verifications WHERE user_id = $1 AND purpose = 'email_verify' AND used = false ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );

    if (otpResult.rows.length === 0) return res.status(400).json({ success: false, message: 'No active OTP found' });
    
    const otpData = otpResult.rows[0];
    if (otpData.otp_code !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (new Date() > new Date(otpData.expires_at)) return res.status(400).json({ success: false, message: 'OTP expired' });

    await db.query('UPDATE otp_verifications SET used = true WHERE id = $1', [otpData.id]);
    await db.query("UPDATE users SET account_status = 'active', is_email_verified = true WHERE id = $1", [user.id]);

    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Save refresh token
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ success: true, message: 'Email verified!', data: { accessToken, role: 'student', account_status: 'active' } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (user.account_status === 'pending_email') {
      return res.status(403).json({ success: false, message: 'Email not verified', account_status: 'pending_email' });
    }
    
    if (user.account_status === 'pending_approval') {
      return res.status(403).json({ success: false, message: 'Your account is pending Super Admin approval', account_status: 'pending_approval' });
    }

    if (user.account_status === 'rejected') {
      return res.status(403).json({ success: false, message: 'Your account request was rejected', account_status: 'rejected', rejection_reason: user.rejection_reason });
    }

    if (user.account_status === 'deactivated') {
      return res.status(403).json({ success: false, message: 'Account deactivated' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    await db.query('UPDATE users SET last_active = NOW() WHERE id = $1', [user.id]);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await db.query('UPDATE refresh_tokens SET is_revoked = true WHERE token_hash = $1', [tokenHash]);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
