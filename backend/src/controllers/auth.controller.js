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

export const registerStudent = async (req, res) => {
  try {
    const { full_name, email, password, department_id, phone } = req.body;

    // Validation
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if email exists
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const result = await db.query(
      `INSERT INTO users
       (full_name, email, password_hash, role,
        department_id, phone, account_status,
        is_email_verified)
       VALUES ($1, $2, $3, 'student', $4, $5,
               'pending_email', false)
       RETURNING id, full_name, email, role`,
      [
        full_name.trim(),
        email.toLowerCase().trim(),
        password_hash,
        department_id || null,
        phone || null,
      ]
    );

    const newUser = result.rows[0];

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `INSERT INTO otp_verifications
       (user_id, otp_code, purpose, expires_at)
       VALUES ($1, $2, 'email_verify', $3)`,
      [newUser.id, otp, expiresAt]
    );

    // Send OTP email
    try {
      await sendEmailVerificationOTP(newUser.email, newUser.full_name, otp);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Check your email for OTP.',
      data: {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.full_name,
      }
    });

  } catch (error) {
    console.error('Register student error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      debug: process.env.NODE_ENV === 'development'
        ? error.message : undefined
    });
  }
};

export const registerStaff = async (req, res) => {
  try {
    const { full_name, email, password, requested_role: role, department_id, employee_id, reason } = req.body;

    // Validation
    if (!full_name || !email || !password || !role || !employee_id || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const validRoles = ['manager', 'hr_admin', 'expert'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role requested'
      });
    }

    if (reason.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Reason must be at least 20 characters'
      });
    }

    // Check email
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    // Create user with pending_approval status
    const result = await db.query(
      `INSERT INTO users
       (full_name, email, password_hash, role,
        department_id, employee_id, access_reason,
        account_status, is_email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7,
               'pending_approval', true)
       RETURNING id, full_name, email, role`,
      [
        full_name.trim(),
        email.toLowerCase().trim(),
        password_hash,
        role,
        department_id || null,
        employee_id.trim(),
        reason.trim(),
      ]
    );

    const newUser = result.rows[0];

    // Create role request record
    await db.query(
      `INSERT INTO role_requests
       (user_id, requested_role, department_id,
        employee_id, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        newUser.id,
        role,
        department_id || null,
        employee_id.trim(),
        reason.trim(),
      ]
    );

    // Send notification email
    try {
      await sendRequestReceivedEmail(newUser.email, newUser.full_name, role);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Request submitted. Pending admin approval.',
      data: {
        userId: newUser.id,
        email: newUser.email,
        status: 'pending_approval'
      }
    });

  } catch (error) {
    console.error('Register staff error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      debug: process.env.NODE_ENV === 'development'
        ? error.message : undefined
    });
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password, user.password_hash
    );
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check account status
    if (user.account_status === 'pending_approval') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval',
        status: 'pending_approval'
      });
    }

    if (user.account_status === 'pending_email') {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
        status: 'pending_email'
      });
    }

    if (user.account_status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account request was rejected',
        status: 'rejected'
      });
    }

    if (user.account_status === 'deactivated') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Update last active
    await db.query(
      'UPDATE users SET last_active = NOW() WHERE id = $1',
      [user.id]
    );

    // Return user data (no password)
    const { password_hash, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: safeUser,
        accessToken,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
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

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = userResult.rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      data: { accessToken }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};
export const resendOTP = async (req, res) => {
  res.status(200).json({ success: true, message: 'OTP Resent' });
};

export const forgotPassword = async (req, res) => {
  res.status(200).json({ success: true, message: 'Forgot processed' });
};

export const resetPassword = async (req, res) => {
  res.status(200).json({ success: true, message: 'Reset processed' });
};
