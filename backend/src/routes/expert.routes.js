import express from 'express';
import {
  getMyLectures,
  scheduleLecture,
  getMyResources,
  uploadResource,
  getPendingQuestions,
  answerQuestion
} from '../controllers/expert.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// All expert routes require authentication and the 'expert' role
router.use(verifyToken);
router.use(checkRole(['expert', 'super_admin'])); // Super admins can also view this logic if needed

router.route('/lectures')
  .get(getMyLectures)
  .post(scheduleLecture);

router.route('/resources')
  .get(getMyResources)
  .post(uploadResource);

router.route('/qna')
  .get(getPendingQuestions);

router.post('/qna/:qaId/answer', answerQuestion);

export default router;
