import express from 'express';
import { db } from '../config/db.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// GET all role requests — super admin only
router.get('/', verifyToken,
  checkRole(['super_admin']),
  async (req, res) => {
    try {
      const { status = 'pending' } = req.query;

      const result = await db.query(
        `SELECT rr.*,
                u.full_name, u.email, u.employee_id,
                d.name as department_name,
                rev.full_name as reviewed_by_name
         FROM role_requests rr
         JOIN users u ON rr.user_id = u.id
         LEFT JOIN departments d
           ON rr.department_id = d.id
         LEFT JOIN users rev
           ON rr.reviewed_by = rev.id
         WHERE rr.status = $1
         ORDER BY rr.requested_at DESC`,
        [status]
      );

      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      console.error('Role requests error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch role requests'
      });
    }
  }
);

// GET my own request status
router.get('/my', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT rr.*, d.name as department_name
       FROM role_requests rr
       LEFT JOIN departments d ON rr.department_id = d.id
       WHERE rr.user_id = $1
       ORDER BY rr.requested_at DESC
       LIMIT 1`,
      [req.user.id]
    );
    return res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch request status'
    });
  }
});

// APPROVE request
router.patch('/:id/approve', verifyToken,
  checkRole(['super_admin']),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get the request
      const reqResult = await db.query(
        'SELECT * FROM role_requests WHERE id = $1',
        [id]
      );
      if (!reqResult.rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      const roleReq = reqResult.rows[0];

      // Update request status
      await db.query(
        `UPDATE role_requests
         SET status = 'approved',
             reviewed_by = $1,
             reviewed_at = NOW()
         WHERE id = $2`,
        [req.user.id, id]
      );

      // Activate user account
      await db.query(
        `UPDATE users
         SET account_status = 'active',
             updated_at = NOW()
         WHERE id = $1`,
        [roleReq.user_id]
      );

      // Get user for email
      const userResult = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [roleReq.user_id]
      );
      const user = userResult.rows[0];

      // Send approval email (don't crash if fails)
      try {
        const { sendAccountApprovedEmail } =
          await import('../services/emailService.js');
        await sendAccountApprovedEmail(
          user.email,
          user.full_name,
          user.role,
          `${process.env.CLIENT_URL}/login`
        );
      } catch (emailErr) {
        console.warn('Approval email failed:', emailErr.message);
      }

      return res.json({
        success: true,
        message: `Account approved for ${user.full_name}`
      });
    } catch (error) {
      console.error('Approve error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to approve request'
      });
    }
  }
);

// REJECT request
router.patch('/:id/reject', verifyToken,
  checkRole(['super_admin']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { rejection_reason } = req.body;

      const reqResult = await db.query(
        'SELECT * FROM role_requests WHERE id = $1',
        [id]
      );
      if (!reqResult.rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      const roleReq = reqResult.rows[0];

      await db.query(
        `UPDATE role_requests
         SET status = 'rejected',
             reviewed_by = $1,
             rejection_reason = $2,
             reviewed_at = NOW()
         WHERE id = $3`,
        [req.user.id, rejection_reason || 'No reason provided', id]
      );

      await db.query(
        `UPDATE users
         SET account_status = 'rejected',
             rejection_reason = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [rejection_reason || 'No reason provided', roleReq.user_id]
      );

      const userResult = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [roleReq.user_id]
      );
      const user = userResult.rows[0];

      try {
        const { sendAccountRejectedEmail } =
          await import('../services/emailService.js');
        await sendAccountRejectedEmail(
          user.email,
          user.full_name,
          user.role,
          rejection_reason
        );
      } catch (emailErr) {
        console.warn('Rejection email failed:', emailErr.message);
      }

      return res.json({
        success: true,
        message: `Request rejected for ${user.full_name}`
      });
    } catch (error) {
      console.error('Reject error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to reject request'
      });
    }
  }
);

export default router;
