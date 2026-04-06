import express from 'express';
import OpenAI from 'openai';
import { db } from '../config/db.js';
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

router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured. Please contact admin.'
      });
    }

    // Get student context
    let studentContext = 'a student';
    let deptName = 'General';
    try {
      const userRes = await db.query(
        `SELECT u.full_name, d.name as dept_name
         FROM users u
         LEFT JOIN departments d ON u.department_id = d.id
         WHERE u.id = $1`,
        [req.user.id]
      );
      if (userRes.rows[0]) {
        studentContext = userRes.rows[0].full_name || 'a student';
        deptName = userRes.rows[0].dept_name || 'General';
      }
    } catch (dbErr) {
      console.warn('Could not get user context:', dbErr.message);
    }

    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 25000, // 25 second timeout
    });

    const systemPrompt = `You are an AI learning assistant for ${studentContext}, a student in the ${deptName} department on the Smart Skill & Live Learning Module platform by Gous org. Help with programming doubts, concept explanations, learning guidance, and career advice. Be friendly, concise, and educational. Use code examples when helpful.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-15),
      { role: 'user', content: message.trim() }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // faster and cheaper than gpt-4-turbo
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content
      || 'Sorry, I could not generate a response.';

    return res.json({ success: true, data: { reply } });

  } catch (error) {
    console.error('Chat error:', error.message);

    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'AI quota exceeded. Please try again later.'
      });
    }

    if (error.code === 'ETIMEDOUT' || error.type === 'request-timeout') {
      return res.status(504).json({
        success: false,
        message: 'AI response timed out. Please try again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Chat failed. Please try again.'
    });
  }
});

export default router;
