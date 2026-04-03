import pool from '../config/db.js';

// ─── GET /api/teacher/lectures ───────────────────────────────────
export const getMyLectures = async (req, res) => {
  const teacherId = req.user.id;
  try {
    const query = `
      SELECT id, title, description, scheduled_at, video_url, status 
      FROM lectures 
      WHERE teacher_id = $1 
      ORDER BY scheduled_at ASC
    `;
    const result = await pool.query(query, [teacherId]);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    console.error('get teacher lectures error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving lectures.' });
  }
};

// ─── POST /api/teacher/lectures ──────────────────────────────────
export const scheduleLecture = async (req, res) => {
  const teacherId = req.user.id;
  const { title, description, scheduledAt, videoUrl, departmentId } = req.body;

  try {
    const query = `
      INSERT INTO lectures (teacher_id, department_id, title, description, scheduled_at, video_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'upcoming')
      RETURNING *
    `;
    const result = await pool.query(query, [
      teacherId, 
      departmentId || null, 
      title, 
      description || '', 
      scheduledAt, 
      videoUrl || ''
    ]);
    res.status(201).json({ success: true, message: 'Lecture scheduled.', data: result.rows[0] });
  } catch (error) {
    console.error('schedule lecture error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule lecture.' });
  }
};

// ─── GET /api/teacher/resources ──────────────────────────────────
export const getMyResources = async (req, res) => {
  const teacherId = req.user.id;
  try {
    const query = `
      SELECT id, title, type, url, created_at 
      FROM resources 
      WHERE uploader_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [teacherId]);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    console.error('get resources error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resources.' });
  }
};

// ─── POST /api/teacher/resources ─────────────────────────────────
export const uploadResource = async (req, res) => {
  const teacherId = req.user.id;
  const { title, type, url, departmentId } = req.body;
  try {
    const query = `
      INSERT INTO resources (uploader_id, department_id, title, type, url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, type, url, created_at
    `;
    const result = await pool.query(query, [teacherId, departmentId || null, title, type, url]);
    res.status(201).json({ success: true, message: 'Resource shared.', data: result.rows[0] });
  } catch (error) {
    console.error('upload resource error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload resource.' });
  }
};

// ─── GET /api/teacher/qna ────────────────────────────────────────
export const getPendingQuestions = async (req, res) => {
  const teacherId = req.user.id;
  try {
    const query = `
      SELECT qa.id, qa.question, qa.is_answered, u.full_name as student_name, l.title as lecture_title
      FROM qa_questions qa
      JOIN lectures l ON qa.lecture_id = l.id
      JOIN users u ON qa.student_id = u.id
      WHERE l.teacher_id = $1 AND qa.is_answered = false
      ORDER BY qa.created_at ASC
    `;
    const result = await pool.query(query, [teacherId]);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    console.error('get Q&A error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve questions.' });
  }
};

// ─── POST /api/teacher/qna/:qaId/answer ──────────────────────────
export const answerQuestion = async (req, res) => {
  const teacherId = req.user.id;
  const { qaId } = req.params;
  const { answer } = req.body;

  try {
    const query = `
      UPDATE qa_questions 
      SET answer = $1, is_answered = true, answered_at = NOW()
      WHERE id = $2 AND lecture_id IN (SELECT id FROM lectures WHERE teacher_id = $3)
      RETURNING id, is_answered
    `;
    const result = await pool.query(query, [answer, qaId, teacherId]);
    
    if (result.rowCount === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized or invalid question.' });
    }
    
    res.json({ success: true, message: 'Question answered successfully.' });
  } catch (error) {
    console.error('answer Q&A error:', error);
    res.status(500).json({ success: false, message: 'Failed to save answer.' });
  }
};

// ─── GET /api/teacher/videos ────────────────────────────────────
export const getMyVideos = async (req, res) => {
  const teacherId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT * FROM teacher_videos WHERE teacher_id = $1 ORDER BY created_at DESC`,
      [teacherId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get teacher videos error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};

// ─── POST /api/teacher/videos ───────────────────────────────────
export const uploadVideo = async (req, res) => {
  const teacherId = req.user.id;
  const { title, description, video_url, thumbnail_url, duration, category, tags, is_public } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO teacher_videos 
       (teacher_id, title, description, video_url, thumbnail_url, duration, category, tags, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [teacherId, title, description, video_url, thumbnail_url, duration, category, JSON.stringify(tags || []), is_public ?? true]
    );
    res.status(201).json({ success: true, message: 'Video uploaded successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload video' });
  }
};

// ─── PUT /api/teacher/videos/:id ───────────────────────────────
export const updateVideo = async (req, res) => {
  const teacherId = req.user.id;
  const { id } = req.params;
  const { title, description, video_url, thumbnail_url, duration, category, tags, is_public } = req.body;

  try {
    const result = await pool.query(
      `UPDATE teacher_videos
       SET title = $1, description = $2, video_url = $3, thumbnail_url = $4, 
           duration = $5, category = $6, tags = $7, is_public = $8, updated_at = NOW()
       WHERE id = $9 AND teacher_id = $10
       RETURNING *`,
      [title, description, video_url, thumbnail_url, duration, category, JSON.stringify(tags || []), is_public, id, teacherId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }
    res.json({ success: true, message: 'Video updated', data: result.rows[0] });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ success: false, message: 'Failed to update video' });
  }
};

// ─── DELETE /api/teacher/videos/:id ────────────────────────────
export const deleteVideo = async (req, res) => {
  const teacherId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM teacher_videos WHERE id = $1 AND teacher_id = $2 RETURNING id',
      [id, teacherId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};

// ─── GET /api/teacher/dashboard/stats ─────────────────────────────
export const getDashboardStats = async (req, res) => {
  const teacherId = req.user.id;
  try {
    const [students, lectures, videos, pendingQna] = await Promise.all([
      // Total students in the teacher's department (or global for now)
      pool.query(`
        SELECT COUNT(*) FROM users 
        WHERE role = 'student' 
        AND department_id = (SELECT department_id FROM users WHERE id = $1)
      `, [teacherId]),
      
      // Total lectures scheduled by this teacher
      pool.query(`SELECT COUNT(*) FROM lectures WHERE teacher_id = $1`, [teacherId]),
      
      // Total videos published by this teacher
      pool.query(`SELECT COUNT(*) FROM teacher_videos WHERE teacher_id = $1`, [teacherId]),
      
      // Total pending Q&A questions for this teacher's lectures
      pool.query(`
        SELECT COUNT(*) FROM qa_questions 
        WHERE lecture_id IN (SELECT id FROM lectures WHERE teacher_id = $1)
        AND is_answered = false
      `, [teacherId])
    ]);

    res.json({
      success: true,
      data: {
        totalStudents: parseInt(students.rows[0]?.count || 0),
        totalLectures: parseInt(lectures.rows[0]?.count || 0),
        totalVideos: parseInt(videos.rows[0]?.count || 0),
        pendingQna: parseInt(pendingQna.rows[0]?.count || 0),
        avgRating: 4.8 // Placeholder for now
      }
    });
  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics.' });
  }
};
