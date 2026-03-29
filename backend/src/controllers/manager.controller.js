import pool from '../config/db.js';

// ─── GET /api/manager/reviews ─────────────────────────────────────
export const getPendingReviews = async (req, res) => {
  const managerId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        pa.id as assignment_id, pa.status, pa.submitted_at, pa.submission_url, pa.submission_notes,
        p.title as project_title,
        u.full_name as intern_name, u.email as intern_email
      FROM project_assignments pa
      JOIN projects p ON pa.project_id = p.id
      JOIN users u ON pa.intern_id = u.id
      WHERE pa.status = 'under_review'
      AND (p.department_id = (SELECT department_id FROM users WHERE id = $1) OR p.department_id IS NULL)
      ORDER BY pa.submitted_at ASC
    `, [managerId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch pending reviews' });
  }
};

// ─── PATCH /api/manager/reviews/:id ───────────────────────────────
export const reviewAssignment = async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body; // status: 'completed' or 'todo'
  const managerId = req.user.id;

  try {
    const updateResult = await pool.query(`
      UPDATE project_assignments
      SET status = $1, reviewer_feedback = $2, reviewed_at = NOW(), reviewed_by = $3
      WHERE id = $4
      RETURNING *
    `, [status, feedback, managerId, id]);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const assignment = updateResult.rows[0];

    // Award XP if completed
    if (status === 'completed') {
      await pool.query(`
        UPDATE gamification 
        SET total_xp = total_xp + (SELECT max_marks FROM projects WHERE id = $1)
        WHERE user_id = $2
      `, [assignment.project_id, assignment.intern_id]);
    }

    res.json({ success: true, message: `Project ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
};
