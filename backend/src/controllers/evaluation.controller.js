import pool from '../config/db.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * POST /api/evaluations
 * Manager submits a performance evaluation for an intern.
 */
export const submitEvaluation = async (req, res) => {
  const { internId, periodStart, periodEnd, scores, comments } = req.body;
  const managerId = req.user.id;

  try {
    // 1. Calculate overall score from the JSONB scores object
    // Scores structure: { technical: 8, communication: 9, teamwork: 7, ... }
    const scoreValues = Object.values(scores);
    const overallScore = scoreValues.length > 0 
      ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(2)
      : 0;

    // 2. Insert into evaluations table
    const result = await pool.query(
      `INSERT INTO evaluations 
       (intern_id, manager_id, period_start, period_end, scores, comments, overall_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [internId, managerId, periodStart, periodEnd, JSON.stringify(scores), comments, overallScore]
    );

    res.status(201).json(apiResponse(true, 'Evaluation submitted successfully.', result.rows[0]));
  } catch (err) {
    console.error('Submit evaluation error:', err);
    res.status(500).json(apiResponse(false, 'Failed to submit evaluation.'));
  }
};

/**
 * GET /api/evaluations/intern/:id
 * Retrieve all evaluations for a specific intern.
 */
export const getInternEvaluations = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT e.*, u.full_name as manager_name
       FROM evaluations e
       JOIN users u ON e.manager_id = u.id
       WHERE e.intern_id = $1
       ORDER BY e.submitted_at DESC`,
      [id]
    );

    res.json(apiResponse(true, 'Evaluations retrieved.', result.rows));
  } catch (err) {
    console.error('Fetch evaluations error:', err);
    res.status(500).json(apiResponse(false, 'Failed to fetch evaluations.'));
  }
};

/**
 * GET /api/evaluations/team/:deptId
 * Manager/HR views all evaluations for their department.
 */
export const getTeamEvaluations = async (req, res) => {
  const { deptId } = req.params;
  try {
    const result = await pool.query(
      `SELECT e.*, i.full_name as intern_name, m.full_name as manager_name
       FROM evaluations e
       JOIN users i ON e.intern_id = i.id
       JOIN users m ON e.manager_id = m.id
       WHERE i.department_id = $1
       ORDER BY e.submitted_at DESC`,
      [deptId]
    );

    res.json(apiResponse(true, 'Team evaluations retrieved.', result.rows));
  } catch (err) {
    console.error('Fetch team evaluations error:', err);
    res.status(500).json(apiResponse(false, 'Failed to fetch team evaluations.'));
  }
};
