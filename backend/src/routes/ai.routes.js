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

router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    // Get student profile for context
    const userRes = await db.query(
      `SELECT u.full_name, u.department_id,
              d.name as dept_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1`,
      [req.user.id]
    );
    const userData = userRes.rows[0] || {};

    // Get student's skill gaps for context
    let skillContext = '';
    if (userData.department_id) {
      const skillsRes = await db.query(
        `SELECT s.name,
          COALESCE(ist.current_level, 'none') as current_level,
          ds.required_level
         FROM department_skills ds
         JOIN skills s ON ds.skill_id = s.id
         LEFT JOIN intern_skills ist
           ON ist.skill_id = s.id AND ist.intern_id = $1
         WHERE ds.department_id = $2
         LIMIT 10`,
        [req.user.id, userData.department_id]
      );
      if (skillsRes.rows.length > 0) {
        const gaps = skillsRes.rows
          .filter(s => s.current_level === 'none')
          .map(s => s.name);
        if (gaps.length > 0) {
          skillContext = `Missing skills: ${gaps.join(', ')}.`;
        }
      }
    }

    // Build system prompt with student context
    const systemPrompt = `You are an intelligent AI learning assistant for ${userData.full_name || 'a student'} on the Smart Skill & Live Learning Module platform by Gous org.

Student Context:
- Name: ${userData.full_name || 'Student'}
- Department: ${userData.dept_name || 'General'}
${skillContext ? `- ${skillContext}` : ''}

Your role:
- Help with programming doubts and technical questions
- Explain concepts clearly with examples and code snippets
- Guide learning paths and what to study next
- Answer questions about any technology, framework, or topic
- Provide career advice for tech students
- Be encouraging, patient, and supportive
- Keep responses clear and well-structured
- Use code blocks for code examples
- Break down complex topics into simple steps

You have unlimited knowledge of programming, technology, mathematics, and learning strategies. The student can ask you ANYTHING related to their studies.

IMPORTANT: Never say you cannot help. Always provide a useful answer. If unsure, give your best guidance.`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Build messages array with history (max last 20 messages)
    const recentHistory = history.slice(-20);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message.trim() }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false
    });

    const reply = completion.choices[0]?.message?.content
      || 'Sorry, I could not generate a response. Please try again.';

    return res.json({
      success: true,
      data: { reply }
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Handle OpenAI specific errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Chat failed. Please try again.'
    });
  }
});

export default router;
