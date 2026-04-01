import pool from '../config/db.js';

// ─── GET /api/student/overview ─────────────────────────────────────
export const getDashboardOverview = async (req, res) => {
  const studentId = req.user.id;
  try {
    // 1. Ensure gamification entry exists (UPSERT)
    await pool.query(`
      INSERT INTO gamification (user_id, total_xp, current_level, current_streak_days)
      VALUES ($1, 0, 1, 0)
      ON CONFLICT (user_id) DO NOTHING
    `, [studentId]);

    const [stats, nextLecture, activeProjects, topBadges] = await Promise.all([
      // XP and Streak stats
      pool.query(`
        SELECT 
          total_xp as xp, 
          current_level as level, 
          current_streak_days as streak,
          last_activity_at
        FROM gamification WHERE user_id = $1
      `, [studentId]),
      
      // Next upcoming lecture in their department
      pool.query(`
        SELECT l.id, l.title, l.scheduled_at as time, u.full_name as expert
        FROM lectures l
        JOIN users u ON l.expert_id = u.id
        WHERE (l.department_id = (SELECT department_id FROM users WHERE id = $1) OR l.department_id IS NULL)
        AND l.scheduled_at >= NOW()
        ORDER BY l.scheduled_at ASC
        LIMIT 1
      `, [studentId]),
      
      // Total active project count
      pool.query(`
        SELECT COUNT(*) FROM project_assignments 
        WHERE intern_id = $1 AND status IN ('todo', 'in_progress', 'under_review')
      `, [studentId]),

      // Recent 3 Badges
      pool.query(`
        SELECT badge_name, badge_icon, earned_at 
        FROM user_badges 
        WHERE user_id = $1 
        ORDER BY earned_at DESC LIMIT 3
      `, [studentId])
    ]);

    const userStats = stats.rows[0];
    
    // Level progress calculation (e.g., Level * 1000 XP per level)
    const xpForCurrentLevel = (userStats?.level || 1) * 1000;
    const progress = Math.min(((userStats?.xp || 0) % 1000) / 10, 100);

    res.json({
      success: true,
      data: {
        xp: userStats?.xp || 0,
        level: userStats?.level || 1,
        streak: userStats?.streak || 0,
        levelProgress: progress,
        nextLecture: nextLecture.rows[0] || null,
        activeProjectsCount: parseInt(activeProjects.rows[0]?.count || 0),
        recentBadges: topBadges.rows
      }
    });
  } catch (err) {
    console.error('Student overview error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving overview.' });
  }
};

// ─── GET /api/student/skills ───────────────────────────────────────
export const getMySkills = async (req, res) => {
  const studentId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        s.id, s.name, 
        iss.current_level as current, 
        ds.required_level as required
      FROM intern_skills iss
      JOIN skills s ON iss.skill_id = s.id
      JOIN users u ON u.id = iss.intern_id
      JOIN department_skills ds ON ds.department_id = u.department_id AND ds.skill_id = s.id
      WHERE u.id = $1
    `, [studentId]);

    // Format for Radar Chart (0-100 scale mapping if needed, or just levels)
    // Assuming Beginner=30, Intermediate=60, Advanced=90 for the chart
    const levelMap = { 'beginner': 30, 'intermediate': 65, 'advanced': 95 };
    
    const formatted = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      current: levelMap[r.current] || 0,
      required: levelMap[r.required] || 0,
      levelRaw: r.current
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Student skills error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving skills.' });
  }
};

// ─── GET /api/student/projects ─────────────────────────────────────
export const getMyProjects = async (req, res) => {
  const studentId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        pa.id as assignment_id, pa.status, pa.submission_url, pa.submission_notes,
        p.id as project_id, p.title, p.description, p.deadline, p.difficulty_level
      FROM project_assignments pa
      JOIN projects p ON pa.project_id = p.id
      WHERE pa.intern_id = $1
      ORDER BY p.deadline ASC
    `, [studentId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Student projects error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving projects.' });
  }
};

// ─── GET /api/student/lectures ─────────────────────────────────────
export const getMyLectures = async (req, res) => {
  const studentId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        l.id, l.title, l.description, l.scheduled_at, l.meeting_link, l.status,
        u.full_name as expert_name,
        EXISTS(SELECT 1 FROM lecture_attendance WHERE lecture_id = l.id AND intern_id = $1) as attended
      FROM lectures l
      JOIN users u ON l.expert_id = u.id
      WHERE l.department_id = (SELECT department_id FROM users WHERE id = $1)
      OR l.department_id IS NULL
      ORDER BY l.scheduled_at DESC
    `, [studentId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Student lectures error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving lectures.' });
  }
};

// ─── PATCH /api/student/projects/:assignmentId/submit ──────────────
export const submitProject = async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId } = req.params;
  const { url, notes } = req.body;

  try {
    const result = await pool.query(`
      UPDATE project_assignments
      SET 
        status = 'under_review', 
        submission_url = $1, 
        submission_notes = $2,
        submitted_at = NOW(),
        updated_at = NOW()
      WHERE id = $3 AND intern_id = $4
      RETURNING id, status
    `, [url, notes, assignmentId, studentId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Project assignment not found.' });
    }

    // GAMIFICATION: Award XP for submission
    // We increment XP and update last_activity_at
    await pool.query(`
      UPDATE gamification 
      SET total_xp = total_xp + 100, 
          last_activity_at = NOW()
      WHERE user_id = $1
    `, [studentId]);

    res.json({ success: true, message: 'Project submitted. +100 XP Earned!', data: result.rows[0] });
  } catch (err) {
    console.error('Project submission error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit project.' });
  }
};

// ─── PERSONAL PROJECTS CRUD ────────────────────────────────────────

export const getPersonalProjects = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM personal_projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching personal projects' });
  }
};

export const createPersonalProject = async (req, res) => {
  const userId = req.user.id;
  const { title, description, link } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO personal_projects (user_id, title, description, link) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, description, link]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating project' });
  }
};

export const updatePersonalProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, link, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE personal_projects 
       SET title = $1, description = $2, link = $3, status = $4, updated_at = NOW() 
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [title, description, link, status, id, req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating project' });
  }
};

export const deletePersonalProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM personal_projects WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting project' });
  }
};

// ─── ROADMAP GENERATION ───────────────────────────────────────────

export const generateRoadmap = async (req, res) => {
  const userId = req.user.id;
  const { topic } = req.body;
  
  // Mock roadmap generation logic for 20+ topics
  const mockRoadmap = [
    { step: 1, title: `Introduction to ${topic}`, status: 'Not Started' },
    { step: 2, title: `Core Concepts of ${topic}`, status: 'Locked' },
    { step: 3, title: `Advanced Techniques`, status: 'Locked' },
    { step: 4, title: `Final Project`, status: 'Locked' }
  ];

  try {
    const result = await pool.query(
      'INSERT INTO learning_roadmaps (user_id, topic_name, roadmap_json) VALUES ($1, $2, $3) RETURNING *',
      [userId, topic, JSON.stringify(mockRoadmap)]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating roadmap' });
  }
};

export const getMyRoadmaps = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM learning_roadmaps WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching roadmaps' });
  }
};

export const getMyCertificates = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM certificates WHERE intern_id = $1 ORDER BY issued_at DESC',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching certificates' });
  }
};
