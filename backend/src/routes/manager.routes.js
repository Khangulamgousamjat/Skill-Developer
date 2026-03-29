import express from 'express';
import {
  getMyTeam,
  createEvaluation,
  assignProject,
  getPendingReviews,
  reviewAssignment
} from '../controllers/manager.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(checkRole(['manager', 'super_admin']));

router.get('/team',               getMyTeam);
router.post('/evaluations',       createEvaluation);
router.post('/projects/assign',   assignProject);
router.get('/reviews',            getPendingReviews);
router.patch('/reviews/:id',      reviewAssignment);

export default router;
