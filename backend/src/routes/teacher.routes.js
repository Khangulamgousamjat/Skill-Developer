import express from 'express';
import {
  getMyLectures,
  scheduleLecture,
  getMyResources,
  uploadResource,
  getPendingQuestions,
  answerQuestion,
  getMyVideos,
  uploadVideo,
  updateVideo,
  deleteVideo,
  getDashboardStats
} from '../controllers/teacher.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// All teacher routes require authentication and the 'teacher' role
router.use(verifyToken);
router.use(checkRole(['teacher', 'super_admin'])); // Super admins can also view this logic if needed

router.get('/dashboard/stats', getDashboardStats);

router.route('/lectures')
  .get(getMyLectures)
  .post(scheduleLecture);

router.route('/resources')
  .get(getMyResources)
  .post(uploadResource);

router.post('/qna/:qaId/answer', answerQuestion);

// Video Management
router.route('/videos')
  .get(getMyVideos)
  .post(uploadVideo);

router.route('/videos/:id')
  .put(updateVideo)
  .delete(deleteVideo);

export default router;
