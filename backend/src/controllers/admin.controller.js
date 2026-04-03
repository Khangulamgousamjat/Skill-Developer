import pool from '../config/db.js';
import { 
  sendAccountApprovedEmail, 
  sendAccountRejectedEmail 
} from '../services/emailService.js';

// ─── GET /api/admin/role-requests ─────────────────────────────────
export const getPendingRoleRequests = async (req, res) => {
    const { role: userRole } = req.user;
    try {
        const result = await pool.query(`
      SELECT
        rr.id,
        rr.requested_role,
        rr.employee_id,
        rr.reason,
        rr.status,
        rr.requested_at,
        rr.approver_role,
        u.full_name,
        u.email,
        u.profile_photo_url,
        d.name AS department_name
      FROM role_requests rr
      JOIN users u ON rr.user_id = u.id
      LEFT JOIN departments d ON rr.department_id = d.id
      WHERE rr.status = 'pending'
      AND rr.approver_role = $1
      ORDER BY rr.requested_at DESC
    `, [userRole]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch role requests' });
  }
};

// ─── PATCH /api/admin/role-requests/:id/approve ───────────────────
export const approveRoleRequest = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const reqResult = await client.query(
      'SELECT * FROM role_requests WHERE id = $1 AND status = $2',
      [id, 'pending']
    );
    if (reqResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Request not found or already processed' });
    }

    const request = reqResult.rows[0];

    // Update the role request
    await client.query(
      `UPDATE role_requests
       SET status = 'approved', reviewed_by = $1, reviewed_at = NOW()
       WHERE id = $2`,
      [adminId, id]
    );

    // Update the user's role and account status
    await client.query(
      `UPDATE users
       SET role = $1, account_status = 'active', updated_at = NOW()
       WHERE id = $2`,
      [request.requested_role, request.user_id]
    );

    // Insert notification for user
    await client.query(
      `INSERT INTO notifications (user_id, title, message, notification_type)
       VALUES ($1, $2, $3, 'approval_update')`,
      [
        request.user_id,
        'Access Request Approved ✅',
        `Your request for ${request.requested_role.replace('_', ' ')} access has been approved. You can now log in with full access.`,
      ]
    );

    await client.query('COMMIT');

    // Send Approval Email (background)
    try {
      await sendAccountApprovedEmail(
        request.email, 
        request.full_name, 
        request.requested_role,
        `${process.env.CLIENT_URL}/login`
      );
    } catch (emailErr) {
      console.error('Approval email failed:', emailErr.message);
    }

    res.json({ success: true, message: 'Role request approved successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to approve request' });
  } finally {
    client.release();
  }
};

// ─── PATCH /api/admin/role-requests/:id/reject ────────────────────
export const rejectRoleRequest = async (req, res) => {
  const { id } = req.params;
  const { rejection_reason } = req.body;
  const adminId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const reqResult = await client.query(
      'SELECT * FROM role_requests WHERE id = $1 AND status = $2',
      [id, 'pending']
    );
    if (reqResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Request not found or already processed' });
    }

    const request = reqResult.rows[0];

    await client.query(
      `UPDATE role_requests
       SET status = 'rejected', reviewed_by = $1, reviewed_at = NOW(), rejection_reason = $2
       WHERE id = $3`,
      [adminId, rejection_reason || 'No reason provided', id]
    );

    await client.query(
      `UPDATE users
       SET account_status = 'rejected', rejection_reason = $1, updated_at = NOW()
       WHERE id = $2`,
      [rejection_reason || 'No reason provided', request.user_id]
    );

    // Insert notification for user
    await client.query(
      `INSERT INTO notifications (user_id, title, message, notification_type)
       VALUES ($1, $2, $3, 'approval_update')`,
      [
        request.user_id,
        'Access Request Rejected ❌',
        `Your request for ${request.requested_role.replace('_', ' ')} access was not approved. Reason: ${rejection_reason || 'Not specified'}`,
      ]
    );

    await client.query('COMMIT');

    // Send Rejection Email (background)
    try {
      await sendAccountRejectedEmail(
        request.email, 
        request.full_name, 
        request.requested_role,
        rejection_reason
      );
    } catch (emailErr) {
      console.error('Rejection email failed:', emailErr.message);
    }

    res.json({ success: true, message: 'Role request rejected' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to reject request' });
  } finally {
    client.release();
  }
};

// ─── GET /api/admin/users ─────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  const { role, status, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const conditions = [];
  const values = [];
  let idx = 1;

  if (role) { conditions.push(`u.role = $${idx++}`); values.push(role); }
  if (status) { conditions.push(`u.account_status = $${idx++}`); values.push(status); }
  if (search) {
    conditions.push(`(u.full_name ILIKE $${idx} OR u.email ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const [usersResult, countResult] = await Promise.all([
      pool.query(
        `SELECT u.id, u.full_name, u.email, u.role, u.account_status,
                u.profile_photo_url, u.employee_id, u.created_at, u.last_active,
                d.name AS department_name
         FROM users u
         LEFT JOIN departments d ON u.department_id = d.id
         ${where}
         ORDER BY u.created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...values, limit, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM users u ${where}`, values),
    ]);

    res.json({
      success: true,
      data: usersResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// ─── PATCH /api/admin/users/:id/toggle-status ─────────────────────
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await pool.query('SELECT account_status FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const current = userResult.rows[0].account_status;
    const newStatus = current === 'active' ? 'deactivated' : 'active';

    await pool.query(
      'UPDATE users SET account_status = $1, updated_at = NOW() WHERE id = $2',
      [newStatus, id]
    );

    res.json({ success: true, message: `User ${newStatus}`, newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

// ─── GET /api/admin/analytics ─────────────────────────────────────
export const getAdminAnalytics = async (req, res) => {
  try {
    const [roleCounts, statusCounts, recentUsers, pendingCount] = await Promise.all([
      pool.query(`SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY count DESC`),
      pool.query(`SELECT account_status, COUNT(*) as count FROM users GROUP BY account_status`),
      pool.query(`SELECT full_name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5`),
      pool.query(`SELECT COUNT(*) FROM role_requests WHERE status = 'pending'`),
    ]);

    res.json({
      success: true,
      data: {
        roleDistribution: roleCounts.rows,
        statusDistribution: statusCounts.rows,
        recentUsers: recentUsers.rows,
        pendingApprovals: parseInt(pendingCount.rows[0].count),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// ─── DEPARTMENT MANAGEMENT ────────────────────────────────────────
export const getDepartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch departments' });
  }
};

export const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

  try {
    const result = await pool.query(
      'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create department' });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if users are assigned to this department
    const usersCount = await pool.query('SELECT COUNT(*) FROM users WHERE department_id = $1', [id]);
    if (parseInt(usersCount.rows[0].count) > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete department: Users are assigned to it.' });
    }

    await pool.query('DELETE FROM departments WHERE id = $1', [id]);
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete department' });
  }
};

// ─── PLATFORM SETTINGS ───────────────────────────────────────────
export const getPlatformSettings = async (req, res) => {
  try {
    const tableCheck = await pool.query("SELECT to_regclass('public.platform_settings')");
    if (!tableCheck.rows[0].to_regclass) {
      return res.json({
        success: true,
        data: {
          maintenance_mode: false,
          allow_registration: true,
          require_approval: true,
          company_name: 'Gous org',
          contact_email: 'support@gousorg.com'
        }
      });
    }

    const result = await pool.query('SELECT key, value FROM platform_settings');
    const settings = result.rows.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
    res.json({ success: true, data: settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

export const updatePlatformSettings = async (req, res) => {
  const settings = req.body; 
  try {
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        `INSERT INTO platform_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
        [key, value]
      );
    }
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────
export const getAnnouncements = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, u.full_name as author_name
      FROM announcements a
      JOIN users u ON a.posted_by = u.id
      ORDER BY a.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

export const createAnnouncement = async (req, res) => {
  const { title, body, targetRole, targetDepartmentId } = req.body;
  const adminId = req.user.id;
  try {
    const result = await pool.query(`
      INSERT INTO announcements (title, body, posted_by, target_role, target_department_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, body, adminId, targetRole || null, targetDepartmentId || null]);
    
    // Log the action
    await pool.query(`
      INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)
    `, [adminId, 'create_announcement', 'announcement', result.rows[0].id, `Created announcement: ${title}`]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
};

export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;
  try {
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    
    // Log the action
    await pool.query(`
      INSERT INTO activity_logs (user_id, action, description)
      VALUES ($1, $2, $3)
    `, [adminId, 'delete_announcement', `Deleted announcement ID: ${id}`]);

    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete announcement' });
  }
};

// ─── SYSTEM LOGS ──────────────────────────────────────────────────
export const getSystemLogs = async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  try {
    const result = await pool.query(`
      SELECT al.*, u.full_name as user_name, u.role as user_role
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch system logs' });
  }
};
