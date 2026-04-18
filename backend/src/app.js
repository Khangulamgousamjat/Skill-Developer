import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import departmentRoutes from './routes/departments.routes.js';
import roleRequestRoutes from './routes/roleRequests.routes.js';
import { db } from './config/db.js';
import studentRoutes from './routes/student.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import aiRoutes from './routes/ai.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import forumRoutes from './routes/forum.routes.js';
import helpRoutes from './routes/help.routes.js';
import hrRoutes from './routes/hr.routes.js';
import managerRoutes from './routes/manager.routes.js';
import adminRoutes from './routes/admin.routes.js';
import teacherRoutes from './routes/teacher.routes.js';

// Add any other existing routes here as they are developed
// import lectureRoutes from './routes/lecture.routes.js'; (Placeholder)

const app = express();

// CORS — Robust production & dev handling
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'https://skill-developer.vercel.app',
  'https://smart-skill-live-learning-module.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── PUBLIC ROUTES (no auth needed) ────────────────
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);

// ── PROTECTED ROUTES (need auth token) ────────────
// Note: verifyToken is typically applied INSIDE these route files or here.
// For now, following the user requested structure.
app.use('/api/role-requests', roleRequestRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/help-board', helpRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);

// Health check and DB keep-alive
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1'); // Keeps Supabase awake!
    res.json({ success: true, message: 'Server & DB are running' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'DB connection failed' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;
