import express from 'express';
import {
  generateSkillGapAnalysis,
  generateLecturePrep,
  generateProjectFeedback,
  generateGenericResponse,
  searchUniversally,
  generateAnalyticsInsight,
  generatePersonalizedTutorInsight,
  generateExpertLectureAdvice,
  generateManagerTeamSentiment,
  generatePlatformHealthInsight
} from '../controllers/ai.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/analytics-insight', checkRole(['super_admin', 'hr_admin']), generateAnalyticsInsight);
router.get('/personalized-tutor', checkRole(['student']), generatePersonalizedTutorInsight);
router.get('/expert-lecture-advice', checkRole(['expert']), generateExpertLectureAdvice);
router.get('/manager-team-sentiment', checkRole(['manager']), generateManagerTeamSentiment);
router.get('/platform-health', checkRole(['super_admin']), generatePlatformHealthInsight);
router.get('/skill-gap/:internId', generateSkillGapAnalysis);
router.post('/lecture-prep', generateLecturePrep);
router.post('/review-project', generateProjectFeedback);
router.post('/ask', generateGenericResponse);
router.post('/search', searchUniversally);

export default router;
