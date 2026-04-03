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

// ─── GET /api/manager/team ──────────────────────────────────────────
export const getMyTeam = async (req, res) => {
  const managerId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.full_name, u.email, u.profile_photo_url, u.last_active,
        g.total_xp, g.current_level,
        (SELECT count(*) FROM project_assignments WHERE intern_id = u.id AND status = 'completed') as projects_completed
      FROM users u
      LEFT JOIN gamification g ON u.id = g.user_id
      WHERE u.role = 'student'
      AND u.department_id = (SELECT department_id FROM users WHERE id = $1)
      ORDER BY g.total_xp DESC
    `, [managerId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch team data' });
  }
};

// ─── POST /api/manager/evaluations ──────────────────────────────────
export const createEvaluation = async (req, res) => {
  const managerId = req.user.id;
  const { internId, skillId, performanceScore, comments } = req.body;
  
  try {
    // 1. Log evaluation
    const evalResult = await pool.query(`
      INSERT INTO evaluations (intern_id, manager_id, performance_score, comments, evaluated_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `, [internId, managerId, performanceScore, comments]);

    // 2. Award XP based on performance (e.g. Score * 10)
    await pool.query(`
      UPDATE gamification 
      SET total_xp = total_xp + $1, last_activity_at = NOW()
      WHERE user_id = $2
    `, [performanceScore * 10, internId]);

    res.status(201).json({ success: true, message: 'Evaluation recorded and XP awarded', data: evalResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create evaluation' });
  }
};

// ─── POST /api/manager/projects/assign ─────────────────────────────
export const assignProject = async (req, res) => {
  const { internId, projectId, deadline } = req.body;
  const managerId = req.user.id;

  try {
    // Check if already assigned
    const check = await pool.query(
      'SELECT id FROM project_assignments WHERE intern_id = $1 AND project_id = $2',
      [internId, projectId]
    );

    if (check.rowCount > 0) {
      return res.status(400).json({ success: false, message: 'Project already assigned to this intern' });
    }

    const result = await pool.query(`
      INSERT INTO project_assignments (intern_id, project_id, assigned_by, status, created_at)
      VALUES ($1, $2, $3, 'todo', NOW())
      RETURNING *
    `, [internId, projectId, managerId]);

    res.status(201).json({ success: true, message: 'Project assigned successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to assign project' });
  }
};

// ─── GET /api/manager/lectures ─────────────────────────────────────
export const getDepartmentLectures = async (req, res) => {
  const managerId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        l.id, l.title, l.description, l.scheduled_at, l.meeting_link, l.status,
        u.full_name as teacher_name
      FROM lectures l
      JOIN users u ON l.teacher_id = u.id
      WHERE l.department_id = (SELECT department_id FROM users WHERE id = $1)
      OR l.department_id IS NULL
      ORDER BY l.scheduled_at DESC
    `, [managerId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch department lectures' });
  }
};

// ─── POST /api/manager/lectures ────────────────────────────────────
export const scheduleLecture = async (req, res) => {
  const managerId = req.user.id;
  const { title, description, scheduledAt, meetingLink, teacherId } = req.body;
  
  try {
    // Get manager's department
    const deptRes = await pool.query('SELECT department_id FROM users WHERE id = $1', [managerId]);
    const deptId = deptRes.rows[0]?.department_id;

    const result = await pool.query(`
      INSERT INTO lectures (title, description, scheduled_at, meeting_link, teacher_id, department_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'upcoming')
      RETURNING *
    `, [title, description, scheduledAt, meetingLink, teacherId || managerId, deptId]);

    res.status(201).json({ success: true, message: 'Lecture scheduled successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to schedule lecture' });
  }
};

// ─── GET /api/manager/skill-stats ──────────────────────────────────
export const getSkillStats = async (req, res) => {
  const managerId = req.user.id;
  try {
    // Aggregates average skill levels for the department
    const result = await pool.query(`
      SELECT 
        s.name as skill_name,
        AVG(CASE 
          WHEN iss.current_level = 'beginner' THEN 30
          WHEN iss.current_level = 'intermediate' THEN 65
          WHEN iss.current_level = 'advanced' THEN 95
          ELSE 0 
        END) as avg_level
      FROM intern_skills iss
      JOIN skills s ON iss.skill_id = s.id
      JOIN users u ON iss.intern_id = u.id
      WHERE u.department_id = (SELECT department_id FROM users WHERE id = $1)
      GROUP BY s.name
    `, [managerId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch skill statistics' });
  }
};
