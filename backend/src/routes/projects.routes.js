import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.use(verifyToken);

// View projects
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Manage projects (Admin/Manager)
router.post('/', checkRole(['super_admin', 'manager']), createProject);
router.patch('/:id', checkRole(['super_admin', 'manager']), updateProject);
router.delete('/:id', checkRole(['super_admin', 'manager']), deleteProject);

export default router;
