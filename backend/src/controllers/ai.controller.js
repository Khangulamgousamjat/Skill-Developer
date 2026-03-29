import { GoogleGenAI } from '@google/genai';
import pool from '../config/db.js';

// Initialize Gemini Client
// The SDK will automatically pick up GEMINI_API_KEY from the environment
const ai = new GoogleGenAI();
const MODEL_NAME = 'gemini-2.5-flash';

// ─── GET /api/ai/skill-gap/:internId ────────────────────────────
export const generateSkillGapAnalysis = async (req, res) => {
  const { internId } = req.params;

  try {
    // 1. Fetch Intern's current skills
    const internSkillsResult = await pool.query(`
      SELECT s.name as skill_name, iss.current_level
      FROM intern_skills iss
      JOIN skills s ON iss.skill_id = s.id
      WHERE iss.intern_id = $1
    `, [internId]);

    const internSkills = internSkillsResult.rows;

    // 2. Fetch Department required skills
    const deptSkillsResult = await pool.query(`
      SELECT s.name as skill_name, ds.required_level, ds.priority
      FROM department_skills ds
      JOIN skills s ON ds.skill_id = s.id
      JOIN users u ON u.department_id = ds.department_id
      WHERE u.id = $1
    `, [internId]);

    const deptSkills = deptSkillsResult.rows;

    if (deptSkills.length === 0) {
      return res.status(400).json({ success: false, message: 'Intern is not assigned to a department with skills.' });
    }

    // 3. Construct Prompt for Gemini
    const prompt = `
      You are an expert HR and Engineering Manager. Analyze the following skill gap for an intern.
      Current Skills: ${JSON.stringify(internSkills)}
      Required Skills for Department: ${JSON.stringify(deptSkills)}
      
      Provide a concise, encouraging 3-sentence summary of where the intern excels, what they are missing, and a brief action plan.
      Do not use formatting like markdown bolding, just return plain text.
    `;

    // 4. Call Gemini
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
    });

    const analysis = response.text;

    res.json({ success: true, data: { analysis } });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI analysis.' });
  }
};

// ─── POST /api/ai/lecture-prep ──────────────────────────────────
export const generateLecturePrep = async (req, res) => {
  const { lectureTitle, description } = req.body;

  try {
    const prompt = `
      You are an expert instructor preparing students for an upcoming lecture.
      Lecture Title: "${lectureTitle}"
      Description: "${description || 'No description provided'}"
      
      Generate exactly 3 smart, thought-provoking questions that the student should think about before attending this lecture.
      Format the output as a clean JSON array of strings. Example: ["Question 1?", "Question 2?", "Question 3?"]
    `;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    const questions = JSON.parse(response.text);

    res.json({ success: true, data: { questions } });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate preparation questions.' });
  }
};

// ─── POST /api/ai/review-project ────────────────────────────────
export const generateProjectFeedback = async (req, res) => {
    const { projectTitle, submissionNotes } = req.body;

    try {
        const prompt = `
          You are a Senior Engineer reviewing a junior developer's project submission.
          Project Title: "${projectTitle}"
          Submission Notes by Intern: "${submissionNotes}"
          
          Provide a highly constructive, professional, and encouraging 2-paragraph feedback summary. 
          Focus on what sounds good based on their notes, and what they should verify or improve next.
        `;
    
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
    
        res.json({ success: true, data: { feedback: response.text } });
      } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate feedback.' });
      }
};

// ─── POST /api/ai/ask ────────────────────────────────
export const generateGenericResponse = async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        res.json({ success: true, data: { text: response.text } });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate response.' });
    }
};

// ─── POST /api/ai/search ──────────────────────────────────────────
export const searchUniversally = async (req, res) => {
    const { query } = req.body;
    const { role } = req.user;

    try {
        // 1. Search Database for Users
        const userResults = await pool.query(`
            SELECT id, full_name, role, email 
            FROM users 
            WHERE full_name ILIKE $1 
            LIMIT 5
        `, [`%${query}%`]);

        // 2. Search Database for Projects
        const projectResults = await pool.query(`
            SELECT id, title, description 
            FROM projects 
            WHERE title ILIKE $1 
            LIMIT 5
        `, [`%${query}%`]);

        // 3. Ask Gemini for Navigation Assistance
        const navPrompt = `
           A user with the role of "${role}" is searching for: "${query}" 
           Identify if they are trying to find a specific page.
           Pages available for ${role}:
           - Dashboard/Overview
           - Skills Radar
           - Projects / Kanban
           - Lectures / Sessions
           - Certificates / Achievements
           - Messages / Chat
           
           If they are asking a question like "how do I view my certs?", point them to the page. 
           Otherwise, provide a 1-sentence helpful tip about using the platform.
           Format: {"navigationRecommendation": "Page Name", "tip": "tip text"}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: navPrompt,
            config: { responseMimeType: "application/json" }
        });

        const aiRef = JSON.parse(response.text);

        res.json({
            success: true,
            data: {
                users: userResults.rows,
                projects: projectResults.rows,
                ai: aiRef
            }
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Search failed.' });
    }
};

// ─── GET /api/ai/analytics-insight ────────────────────────────────
export const generateAnalyticsInsight = async (req, res) => {
    try {
        // Fetch raw statistics first
        const [roleCounts, pendingCount] = await Promise.all([
            pool.query(`SELECT role, COUNT(*) as count FROM users GROUP BY role`),
            pool.query(`SELECT COUNT(*) FROM role_requests WHERE status = 'pending'`),
        ]);

        const roleDist = roleCounts.rows;
        const pending = pendingCount.rows[0].count;

        const prompt = `
            You are a Strategic Data Analyst for Gous org. 
            Analyze the following platform distribution:
            - User Distribution by Role: ${JSON.stringify(roleDist)}
            - Pending Access Approvals: ${pending}
            
            Provide a 3-paragraph "Strategic Overview":
            1. An assessment of the current user composition (balancing interns vs staff).
            2. A risk assessment regarding the pending approvals.
            3. A prioritized suggestion for the Super Admin to optimize the platform today.
            
            Keep the tone professional, objective, and urgent if needed.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });

        res.json({ success: true, data: { insight: response.text } });
    } catch (error) {
        console.error('AI Insight Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate strategic insight.' });
    }
};

// ─── GET /api/ai/personalized-tutor ───────────────────────────────
export const generatePersonalizedTutorInsight = async (req, res) => {
    const studentId = req.user.id;

    try {
        // 1. Fetch Skill Stats
        const skillsResult = await pool.query(`
            SELECT s.name, iss.current_level, ds.required_level
            FROM intern_skills iss
            JOIN skills s ON iss.skill_id = s.id
            JOIN users u ON u.id = iss.intern_id
            JOIN department_skills ds ON ds.department_id = u.department_id AND ds.skill_id = s.id
            WHERE u.id = $1
        `, [studentId]);

        // 2. Fetch Recent Project Performance
        const projectResult = await pool.query(`
            SELECT p.title, pa.status, pa.submission_notes
            FROM project_assignments pa
            JOIN projects p ON pa.project_id = p.id
            WHERE pa.intern_id = $1
            ORDER BY pa.assigned_at DESC
            LIMIT 3
        `, [studentId]);

        const skills = skillsResult.rows;
        const projects = projectResult.rows;

        // 3. Construct Prompt with real Context
        const prompt = `
            You are a Personal AI Learning Tutor for Gous org. 
            Student Data:
            - Skill Levels (Current vs Target): ${JSON.stringify(skills)}
            - Recent Projects: ${JSON.stringify(projects)}
            
            Identify the student's "Growth Edge" (the skill with the largest gap that is critical).
            Provide a 3-step "Smart Action Plan" for this week:
            - Step 1: A specific concept to master.
            - Step 2: A practical task to try in their current projects.
            - Step 3: A question they should ask their manager to show growth.
            
            Format the response as a JSON object: {"growthEdge": "Skill Name", "plan": ["Step 1", "Step 2", "Step 3"], "tutorMessage": "Encouraging voice message text"}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        res.json({ success: true, data: JSON.parse(response.text) });
    } catch (error) {
        console.error('AI Tutor Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate personalized tutoring.' });
    }
};

// ─── GET /api/ai/expert-lecture-advice ────────────────────────────
export const generateExpertLectureAdvice = async (req, res) => {
    const expertId = req.user.id;

    try {
        // Find Expert's Department
        const userResult = await pool.query('SELECT department_id FROM users WHERE id = $1', [expertId]);
        const deptId = userResult.rows[0].department_id;

        // Fetch Avg Skill Gaps for the department
        const skillGaps = await pool.query(`
            SELECT s.name, AVG(iss.current_level) as avg_level
            FROM intern_skills iss
            JOIN skills s ON iss.skill_id = s.id
            JOIN users u ON u.id = iss.intern_id
            WHERE u.department_id = $1
            GROUP BY s.name
            ORDER BY avg_level ASC
            LIMIT 5
        `, [deptId]);

        const gaps = skillGaps.rows;

        const prompt = `
            You are a Lecture Strategist for Gous org. 
            Department Statistics (Avg Skill Levels): ${JSON.stringify(gaps)}
            
            Based on these weaknesses, suggest 3 highly specialized lecture topics.
            Also, provide a 1-sentence "Focus Recommendation" for the Expert to help the students.
            Format: {"suggestions": ["Topic 1", "Topic 2", "Topic 3"], "tutorTip": "focus recommendation text"}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        res.json({ success: true, data: JSON.parse(response.text) });
    } catch (error) {
        console.error('Expert Advice Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate lecture advice.' });
    }
};

// ─── GET /api/ai/manager-team-sentiment ────────────────────────────
export const generateManagerTeamSentiment = async (req, res) => {
    const managerId = req.user.id;

    try {
        // Find Manager's Department
        const userResult = await pool.query('SELECT department_id FROM users WHERE id = $1', [managerId]);
        const deptId = userResult.rows[0].department_id;

        // Fetch recent project submission notes from all interns in this department
        const submissionNotes = await pool.query(`
            SELECT pa.submission_notes 
            FROM project_assignments pa
            JOIN users u ON pa.intern_id = u.id
            WHERE u.department_id = $1 AND pa.submission_notes IS NOT NULL
            ORDER BY pa.assigned_at DESC
            LIMIT 20
        `, [deptId]);

        const notes = submissionNotes.rows.map(r => r.submission_notes).join(' | ');

        const prompt = `
            You are a Team Performance Analyst for Gous org. 
            Analyze the following student submission notes (sentiments): "${notes}"
            
            Identify:
            1. Collective Confidence Level (0-100).
            2. Top 1 struggle or burnout factor.
            3. A short "Manager Action" for next week.
            
            Format: {"confidence": 85, "mainStruggle": "text", "actionItem": "text"}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        res.json({ success: true, data: JSON.parse(response.text) });
    } catch (error) {
        console.error('Manager Sentiment Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate team sentiment.' });
    }
};

// ─── GET /api/ai/platform-health ──────────────────────────────────
export const generatePlatformHealthInsight = async (req, res) => {
    try {
        const [totalUsers, pendingRequests, activeProjects] = await Promise.all([
            pool.query(`SELECT COUNT(*) FROM users`),
            pool.query(`SELECT COUNT(*) FROM role_requests WHERE status = 'pending'`),
            pool.query(`SELECT COUNT(*) FROM project_assignments WHERE status = 'approved'`),
        ]);

        const stats = {
            total: totalUsers.rows[0].count,
            pending: pendingRequests.rows[0].count,
            projects: activeProjects.rows[0].count
        };

        const prompt = `
            Analyze the following platform health metrics: ${JSON.stringify(stats)}
            Identify:
            1. System Load Level (e.g., "Optimal", "Strained").
            2. The biggest Administrative debt (e.g., pending requests).
            3. A short "Super Admin Strategy" to increase platform efficiency.
            
            Format: {"load": "status", "bottleneck": "description", "strategy": "short text"}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        res.json({ success: true, data: JSON.parse(response.text) });
    } catch (error) {
        console.error('Platform Health Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate platform health insight.' });
    }
};

// ─── POST /api/ai/audit-intern ────────────────────────────────────
export const auditInternPerformance = async (req, res) => {
    const { internId } = req.body;

    try {
        // Fetch recent project submissions and mentor feedback
        const submissionHistory = await pool.query(`
            SELECT pa.status, pa.submission_notes, p.title
            FROM project_assignments pa
            JOIN projects p ON pa.project_id = p.id
            WHERE pa.intern_id = $1
            ORDER BY pa.submitted_at DESC
            LIMIT 5
        `, [internId]);

        const history = submissionHistory.rows;

        const prompt = `
            You are a Senior Engineering Manager at Gous org. 
            Evaluate the following intern's recent project performance: ${JSON.stringify(history)}
            
            Provide suggested scores (1-10) for:
            - technical
            - communication
            - collaboration
            - discipline
            - problem_solving
            
            Also draft a 2-sentence professional comment for their performance review.
            Format: {"scores": {"technical": 8, "communication": 7, ...}, "comments": "draft text"}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        res.json({ success: true, data: JSON.parse(response.text) });
    } catch (error) {
        console.error('Audit Error:', error);
        res.status(500).json({ success: false, message: 'Failed to perform AI audit.' });
    }
};
