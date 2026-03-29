import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());

// HTTP Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Placeholder for Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running normally' });
});

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import hrRoutes from './routes/hr.routes.js';
import managerRoutes from './routes/manager.routes.js';
import expertRoutes from './routes/expert.routes.js';
import studentRoutes from './routes/student.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/expert', expertRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/ai', aiRoutes);

import { sendEmailVerificationOTP } from './services/emailService.js';

app.get('/api/test-email', async (req, res) => {
  try {
    await sendEmailVerificationOTP(
      'gousk2004@gmail.com',
      'Test User',
      '123456'
    );
    res.json({ success: true, message: 'Email sent to gousk2004@gmail.com! Check inbox.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: process.env.NODE_ENV === 'development' ? err.errors || [err] : []
  });
});

export default app;
