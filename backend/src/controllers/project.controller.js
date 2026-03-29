import pool from '../config/db.js';

// ─── GET /api/projects ──────────────────────────────────────────
export const getAllProjects = async (req, res) => {
  const { difficulty, department_id, search } = req.query;
  const conditions = [];
  const values = [];

  if (difficulty) {
    conditions.push(`difficulty_level = $${values.length + 1}`);
    values.push(difficulty);
  }
  if (department_id) {
    conditions.push(`department_id = $${values.length + 1}`);
    values.push(department_id);
  }
  if (search) {
    conditions.push(`(title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`);
    values.push(`%${search}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await pool.query(
      `SELECT p.*, d.name as department_name 
       FROM projects p
       LEFT JOIN departments d ON p.department_id = d.id
       ${where} 
       ORDER BY p.created_at DESC`,
      values
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
};

// ─── POST /api/projects ─────────────────────────────────────────
export const createProject = async (req, res) => {
  const { title, description, difficulty_level, department_id, deadline, max_marks } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (title, description, difficulty_level, department_id, deadline, max_marks, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, difficulty_level, department_id, deadline, max_marks || 100, req.user.id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

// ─── PATCH /api/projects/:id ──────────────────────────────────────
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, difficulty_level, department_id, deadline, max_marks } = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects 
       SET title = $1, description = $2, difficulty_level = $3, department_id = $4, deadline = $5, max_marks = $6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [title, description, difficulty_level, department_id, deadline, max_marks, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

// ─── DELETE /api/projects/:id ─────────────────────────────────────
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

// ─── GET /api/projects/:id ───────────────────────────────────────
export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, d.name as department_name 
       FROM projects p
       LEFT JOIN departments d ON p.department_id = d.id
       WHERE p.id = $1`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
};
