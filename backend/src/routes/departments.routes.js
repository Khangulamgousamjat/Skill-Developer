import express from 'express';
import { db } from '../config/db.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// ✅ PUBLIC — no auth — used by registration form
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, description
       FROM departments
       WHERE is_active = true
       ORDER BY name ASC`
    );
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Departments error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch departments'
    });
  }
});

// ✅ PROTECTED — needs auth — for admin management
router.get('/all', verifyToken,
  checkRole(['super_admin', 'hr_admin']),
  async (req, res) => {
    try {
      const result = await db.query(
        `SELECT d.*, u.full_name as manager_name,
                COUNT(u2.id) as intern_count
         FROM departments d
         LEFT JOIN users u ON d.manager_id = u.id
         LEFT JOIN users u2 ON u2.department_id = d.id
           AND u2.role = 'student'
         GROUP BY d.id, u.full_name
         ORDER BY d.name ASC`
      );
      return res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch departments'
      });
    }
  }
);

// Create department (super admin only)
router.post('/', verifyToken,
  checkRole(['super_admin']),
  async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Department name is required'
        });
      }
      const result = await db.query(
        `INSERT INTO departments (name, description)
         VALUES ($1, $2) RETURNING *`,
        [name.trim(), description || null]
      );
      return res.status(201).json({
        success: true,
        message: 'Department created',
        data: result.rows[0]
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Department already exists'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create department'
      });
    }
  }
);

// Update department
router.patch('/:id', verifyToken,
  checkRole(['super_admin']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, manager_id } = req.body;
      const result = await db.query(
        `UPDATE departments
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             manager_id = COALESCE($3, manager_id),
             updated_at = NOW()
         WHERE id = $4 RETURNING *`,
        [name, description, manager_id, id]
      );
      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }
      return res.json({
        success: true,
        message: 'Department updated',
        data: result.rows[0]
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update department'
      });
    }
  }
);

// Delete department
router.delete('/:id', verifyToken,
  checkRole(['super_admin']),
  async (req, res) => {
    try {
      const { id } = req.params;
      await db.query(
        `UPDATE departments
         SET is_active = false, updated_at = NOW()
         WHERE id = $1`,
        [id]
      );
      return res.json({
        success: true,
        message: 'Department deactivated'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete department'
      });
    }
  }
);

export default router;
