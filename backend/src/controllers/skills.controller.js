import { db } from '../config/db.js';

// ─── MASTER SKILLS ────────────────────────────────────────────────
export const getAllSkills = async (req, res, next) => {
  const { category, search } = req.query;
  const conditions = [];
  const values = [];

  if (category) {
    conditions.push(`category = $${values.length + 1}`);
    values.push(category);
  }
  if (search) {
    conditions.push(`name ILIKE $${values.length + 1}`);
    values.push(`%${search}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await db.query(
      `SELECT * FROM skills ${where} ORDER BY name ASC`,
      values
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createSkill = async (req, res, next) => {
  const { name, category, description } = req.body;
  try {
    const existing = await db.query('SELECT id FROM skills WHERE name = $1', [name]);
    if (existing.rows.length > 0) return res.status(400).json({ success: false, message: 'Skill already exists' });

    const result = await db.query(
      'INSERT INTO skills (name, category, description, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, description, req.user.id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const updateSkill = async (req, res, next) => {
  const { id } = req.params;
  const { name, category, description, is_active } = req.body;
  try {
    const result = await db.query(
      `UPDATE skills SET name = $1, category = $2, description = $3, is_active = $4, updated_at = NOW() 
       WHERE id = $5 RETURNING *`,
      [name, category, description, is_active, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteSkill = async (req, res, next) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── DEPARTMENT SKILLS ─────────────────────────────────────────────
export const getDepartmentSkills = async (req, res, next) => {
  const { deptId } = req.params;
  try {
    const result = await db.query(
      `SELECT ds.*, s.name, s.category, s.description 
       FROM department_skills ds
       JOIN skills s ON ds.skill_id = s.id
       WHERE ds.department_id = $1`,
      [deptId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const addSkillToDepartment = async (req, res, next) => {
  const { deptId } = req.params;
  const { skillId, required_level, priority } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO department_skills (department_id, skill_id, required_level, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [deptId, skillId, required_level, priority]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── INTERN SKILLS ─────────────────────────────────────────────
export const getInternSkills = async (req, res, next) => {
  const { internId } = req.params;
  try {
    const result = await db.query(
      `SELECT is.*, s.name, s.category, ds.required_level, ds.priority
       FROM intern_skills is
       JOIN skills s ON is.skill_id = s.id
       LEFT JOIN users u ON is.intern_id = u.id
       LEFT JOIN department_skills ds ON (is.skill_id = ds.skill_id AND u.department_id = ds.department_id)
       WHERE is.intern_id = $1`,
      [internId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const addSkillToIntern = async (req, res, next) => {
  const { internId } = req.params;
  const { skillId, current_level } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO intern_skills (intern_id, skill_id, current_level) VALUES ($1, $2, $3) ON CONFLICT (intern_id, skill_id) DO UPDATE SET current_level = $3, updated_at = NOW() RETURNING *',
      [internId, skillId, current_level]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const verifyInternSkill = async (req, res, next) => {
  const { internId, skillId } = req.params;
  try {
    const result = await db.query(
      'UPDATE intern_skills SET is_verified = true, verified_by = $1, verified_at = NOW() WHERE intern_id = $2 AND skill_id = $3 RETURNING *',
      [req.user.id, internId, skillId]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Skill record not found' });
    res.json({ success: true, message: 'Skill verified successfully', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ... remaining stubs to be added in next iteration as needed
export const getSkillById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM skills WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

export const updateDepartmentSkill = async (req, res, next) => { res.json({ success: true, message: 'Updated' }); };
export const removeSkillFromDepartment = async (req, res, next) => { res.json({ success: true, message: 'Removed' }); };
export const updateInternSkill = async (req, res, next) => { res.json({ success: true, message: 'Updated' }); };
