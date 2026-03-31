import express from 'express';
import {
  registerStudent,
  registerStaff,
  verifyEmail,
  resendOTP,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register/student', registerStudent);
router.post('/register/staff',   registerStaff);
router.post('/verify-email',     verifyEmail);
router.post('/resend-otp',       resendOTP);
router.post('/login',            login);
router.post('/logout',           logout);
router.post('/refresh-token',    refreshToken);
router.post('/forgot-password',  forgotPassword);
router.post('/reset-password',   resetPassword);

export default router;
