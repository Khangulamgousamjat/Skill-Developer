import express from 'express';
import { getMyCertificates, downloadCertificate } from '../controllers/certificate.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Only authenticated students can view their certs
router.get('/', verifyToken, checkRole(['student']), getMyCertificates);

// The actual download utilizes Puppeteer. Also requiring student token auth
router.get('/download/:code', verifyToken, checkRole(['student']), downloadCertificate);

export default router;
