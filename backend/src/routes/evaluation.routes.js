import express from 'express';
import { 
  submitEvaluation, 
  getInternEvaluations, 
  getTeamEvaluations 
} from '../controllers/evaluation.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// ─── SUBMIT (MANAGER) ────────────────────────────────────
router.post('/', verifyToken, checkRole(['manager', 'super_admin']), submitEvaluation);

// ─── FETCH (HR/MANAGER) ──────────────────────────────────
router.get('/intern/:id', verifyToken, checkRole(['hr_admin', 'manager', 'super_admin', 'student']), getInternEvaluations);
router.get('/team/:deptId', verifyToken, checkRole(['hr_admin', 'manager', 'super_admin']), getTeamEvaluations);

export default router;
