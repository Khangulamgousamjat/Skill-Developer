import express from 'express';
import {
  getDashboardOverview,
  getMySkills,
  getMyProjects,
  getMyLectures,
  submitProject,
  getPersonalProjects,
  createPersonalProject,
  updatePersonalProject,
  deletePersonalProject,
  generateRoadmap,
  getMyRoadmaps,
  getMyCertificates,
  getVideos
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
router.get('/certificates',  getMyCertificates);
router.get('/videos',        getVideos);

router.patch('/projects/:assignmentId/submit', submitProject);

// Personal Projects
router.get('/personal-projects',     getPersonalProjects);
router.post('/personal-projects',    createPersonalProject);
router.put('/personal-projects/:id', updatePersonalProject);
router.delete('/personal-projects/:id', deletePersonalProject);

// Roadmaps
router.get('/roadmaps',    getMyRoadmaps);
router.post('/roadmaps',   generateRoadmap);

export default router;
