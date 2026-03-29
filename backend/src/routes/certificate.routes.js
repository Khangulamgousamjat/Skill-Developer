import express from 'express';
import { 
  getMyCertificates, 
  issueCertificate, 
  verifyCertificate, 
  downloadCertificate 
} from '../controllers/certificate.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// ─── PUBLIC ───────────────────────────────────────────────
// Verification is public for anyone scanning the QR code
router.get('/verify/:code', verifyCertificate);

// ─── AUTHENTICATED (STUDENT) ─────────────────────────────
router.get('/me', verifyToken, checkRole(['student']), getMyCertificates);
router.get('/download/:id', verifyToken, checkRole(['student']), downloadCertificate);

// ─── ADMIN/HR (AUTHORITY) ───────────────────────────────
router.post('/issue', verifyToken, checkRole(['super_admin', 'hr_admin']), issueCertificate);

export default router;
