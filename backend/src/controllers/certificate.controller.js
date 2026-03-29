import pool from '../config/db.js';
import { generateCertificatePDF } from '../services/pdfService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import { apiResponse } from '../utils/apiResponse.js';

/**
 * GET /api/certificates
 * Retrieve current student's certificates.
 */
export const getMyCertificates = async (req, res) => {
  const internId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT c.*, s.name as skill_name, p.title as project_title, u.full_name as issuer_name
       FROM certificates c
       LEFT JOIN skills s ON c.skill_id = s.id
       LEFT JOIN projects p ON c.project_id = p.id
       LEFT JOIN users u ON c.issued_by = u.id
       WHERE c.intern_id = $1 AND c.is_valid = true
       ORDER BY c.issued_at DESC`,
      [internId]
    );

    res.json(apiResponse(true, 'Certificates retrieved.', result.rows));
  } catch (err) {
    console.error('Fetch certs error:', err);
    res.status(500).json(apiResponse(false, 'Failed to fetch certificates.'));
  }
};

/**
 * POST /api/certificates/issue
 * Manually issue a certificate (HR/Admin).
 */
export const issueCertificate = async (req, res) => {
  const { internId, certificateType, skillId, projectId, skillsCovered } = req.body;
  const issuerId = req.user.id;

  try {
    // 1. Fetch Intern Details
    const internResult = await pool.query('SELECT full_name FROM users WHERE id = $1', [internId]);
    if (internResult.rowCount === 0) return res.status(404).json(apiResponse(false, 'Intern not found.'));
    const internName = internResult.rows[0].full_name;

    // 2. Fetch Skill/Project Details
    let skillName = 'Core Professionalism';
    if (skillId) {
      const sResult = await pool.query('SELECT name FROM skills WHERE id = $1', [skillId]);
      if (sResult.rowCount > 0) skillName = sResult.rows[0].name;
    } else if (projectId) {
      const pResult = await pool.query('SELECT title FROM projects WHERE id = $1', [projectId]);
      if (pResult.rowCount > 0) skillName = pResult.rows[0].title;
    }

    // 3. Generate Verification Code
    const verificationCode = generateVerificationCode();

    // 4. Generate PDF Buffer
    const pdfBuffer = await generateCertificatePDF({
      internName,
      certificateType: certificateType || 'Expert Recognition',
      skillName,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      verificationCode
    });

    // 5. Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(pdfBuffer, 'ssllm/certificates');
    const pdfUrl = cloudinaryResult.secure_url;

    // 6. Save to DB
    const insertResult = await pool.query(
      `INSERT INTO certificates 
       (intern_id, certificate_type, skill_id, project_id, issued_by, pdf_url, verification_code, skills_covered)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [internId, certificateType, skillId, projectId, issuerId, pdfUrl, verificationCode, skillsCovered || []]
    );

    res.status(201).json(apiResponse(true, 'Certificate issued successfully.', insertResult.rows[0]));
  } catch (err) {
    console.error('Issue certificate error:', err);
    res.status(500).json(apiResponse(false, 'Failed to issue certificate.'));
  }
};

/**
 * GET /api/certificates/verify/:code
 * Public verification endpoint.
 */
export const verifyCertificate = async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.issued_at, c.certificate_type, c.pdf_url, u.full_name as holder_name, d.name as department_name
       FROM certificates c
       JOIN users u ON c.intern_id = u.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE c.verification_code = $1 AND c.is_valid = true`,
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json(apiResponse(false, 'Invalid or expired certificate code.'));
    }

    res.json(apiResponse(true, 'Certificate verified successfully.', result.rows[0]));
  } catch (err) {
    console.error('Verify cert error:', err);
    res.status(500).json(apiResponse(false, 'Failed to verify certificate.'));
  }
};

/**
 * GET /api/certificates/download/:id
 * Generate and stream the PDF for direct download (Student).
 */
export const downloadCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT pdf_url FROM certificates WHERE id = $1 AND intern_id = $2', [id, req.user.id]);
    if (result.rowCount === 0) return res.status(404).json(apiResponse(false, 'Certificate not found.'));
    
    // Cloudinary URL can be redirected to
    res.redirect(result.rows[0].pdf_url);
  } catch (err) {
    console.error('Download cert error:', err);
    res.status(500).json(apiResponse(false, 'Failed to retrieve download link.'));
  }
};
