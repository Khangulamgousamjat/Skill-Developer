import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateProfile, 
  getPublicProfile, 
  getLeaderboard 
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publicly available within app
router.get('/leaderboard', verifyToken, getLeaderboard);
router.get('/public/:id',  verifyToken, getPublicProfile);

// Profile management
router.put('/profile',     verifyToken, updateProfile);

// Admin / General User views
router.get('/',            getUsers);
router.get('/:id',         getUserById);

export default router;
