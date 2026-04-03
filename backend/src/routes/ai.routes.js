import express from 'express';
import {
  generateSkillGapAnalysis,
  generateLecturePrep,
  generateProjectFeedback,
  generateGenericResponse,
  searchUniversally,
  generateAnalyticsInsight,
  generatePersonalizedTutorInsight,
  generateTeacherLectureAdvice,
  generateManagerTeamSentiment,
  generatePlatformHealthInsight,
  auditInternPerformance
} from '../controllers/ai.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/analytics-insight', checkRole(['super_admin', 'hr_admin']), generateAnalyticsInsight);
router.get('/personalized-tutor', checkRole(['student']), generatePersonalizedTutorInsight);
router.get('/teacher-lecture-advice', checkRole(['teacher']), generateTeacherLectureAdvice);
router.get('/manager-team-sentiment', checkRole(['manager']), generateManagerTeamSentiment);
router.get('/platform-health', checkRole(['super_admin']), generatePlatformHealthInsight);
router.post('/audit-intern', checkRole(['manager']), auditInternPerformance);
router.get('/skill-gap/:internId', generateSkillGapAnalysis);
router.post('/lecture-prep', generateLecturePrep);
router.post('/review-project', generateProjectFeedback);
router.post('/ask', generateGenericResponse);
router.post('/search', searchUniversally);

export default router;
