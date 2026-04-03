import express from 'express';
import {
  getPendingRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  getAllUsers,
  toggleUserStatus,
  getAdminAnalytics,
  getDepartments,
  createDepartment,
  deleteDepartment,
  getPlatformSettings,
  updatePlatformSettings,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getSystemLogs,
} from '../controllers/admin.controller.js';
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skills.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// All admin routes require authentication
router.use(verifyToken);

// Shared role request management (Super Admin & Manager)
router.get('/role-requests',               checkRole(['super_admin', 'manager']), getPendingRoleRequests);
router.patch('/role-requests/:id/approve', checkRole(['super_admin', 'manager']), approveRoleRequest);
router.patch('/role-requests/:id/reject',  checkRole(['super_admin', 'manager']), rejectRoleRequest);

// Rest require super_admin role
router.use(checkRole(['super_admin']));

// Role Request Management (Handled Above)

// User Management
router.get('/users',                       getAllUsers);
router.patch('/users/:id/toggle-status',   toggleUserStatus);

// Analytics
router.get('/analytics',                   getAdminAnalytics);

// Departments
router.get('/departments',                 getDepartments);
router.post('/departments',                createDepartment);
router.delete('/departments/:id',           deleteDepartment);

// Settings
router.get('/settings',                    getPlatformSettings);
router.patch('/settings',                  updatePlatformSettings);

// Announcements
router.get('/announcements',               getAnnouncements);
router.post('/announcements',              createAnnouncement);
router.delete('/announcements/:id',         deleteAnnouncement);

// System Logs
router.get('/logs',                        getSystemLogs);

// Skills
router.get('/skills',                      getAllSkills);
router.post('/skills',                     createSkill);
router.put('/skills/:id',                  updateSkill);
router.delete('/skills/:id',               deleteSkill);

export default router;
