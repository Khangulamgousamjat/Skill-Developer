import express from 'express';
import {
  generateSkillGapAnalysis,
  generateLecturePrep,
  generateProjectFeedback,
  generateGenericResponse,
  searchUniversally,
  generateAnalyticsInsight
} from '../controllers/ai.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/analytics-insight', checkRole(['super_admin', 'hr_admin']), generateAnalyticsInsight);
router.get('/skill-gap/:internId', generateSkillGapAnalysis);
router.post('/lecture-prep', generateLecturePrep);
router.post('/review-project', generateProjectFeedback);
router.post('/ask', generateGenericResponse);
router.post('/search', searchUniversally);

export default router;
