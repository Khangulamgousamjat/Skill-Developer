import { db } from '../config/db.js';

/**
 * Get all users with pagination and filtering
 * GET /api/users
 */
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'newest';
    const offset = (page - 1) * limit;

    // Build order by clause
    let orderBy = 'created_at DESC';
    if (sort === 'oldest') orderBy = 'created_at ASC';
    if (sort === 'name') orderBy = 'full_name ASC';

    // Fetch users with department name
    const result = await db.query(
      `SELECT u.id, u.full_name, u.email, u.role, u.account_status, 
              u.created_at, u.last_active, d.name as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY ${orderBy}
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Get total count for pagination
    const countResult = await db.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

/**
 * Get single user profile
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT u.*, d.name as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password_hash, ...user } = result.rows[0];
    return res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
};

/**
 * Update user profile (bio, phone, photo)
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { bio, phone, profile_photo_url } = req.body;

  try {
    const result = await db.query(
      `UPDATE users 
       SET bio = COALESCE($1, bio), 
           phone = COALESCE($2, phone), 
           profile_photo_url = COALESCE($3, profile_photo_url),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, full_name, email, role, bio, phone, profile_photo_url`,
      [bio, phone, profile_photo_url, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

/**
 * Get public profile logic
 * GET /api/users/public/:id
 */
export const getPublicProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await db.query(
      `SELECT u.id, u.full_name, u.role, u.bio, u.profile_photo_url, d.name as department_name,
              g.total_xp, g.current_level, g.badges
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN gamification g ON u.id = g.user_id
       WHERE u.id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: userResult.rows[0]
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch public profile' });
  }
};

/**
 * Get Global Leaderboard
 * GET /api/users/leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.full_name, u.profile_photo_url, d.name as department_name,
              g.total_xp, g.current_level
       FROM gamification g
       JOIN users u ON g.user_id = u.id
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY g.total_xp DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};
