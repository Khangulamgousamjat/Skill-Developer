import express from 'express';
import {
  getDashboardOverview,
  getMySkills,
  getMyProjects,
  getMyLectures,
  submitProject
} from '../controllers/student.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// All student routes require authentication + student role
router.use(verifyToken);
router.use(checkRole(['student', 'super_admin']));

router.get('/overview',      getDashboardOverview);
router.get('/skills',        getMySkills);
router.get('/projects',      getMyProjects);
router.get('/lectures',      getMyLectures);

router.patch('/projects/:assignmentId/submit', submitProject);

export default router;
