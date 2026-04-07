/**
 * Tactical Career AI Controller
 * This simulates high-level LLM responses for the student platform.
 * It uses a rule-based logic to provide personalized career and skill advice.
 */

const RESPONSES = {
  RESUME: [
    "Your **Technical Resume** is your first tactical entry point. Focus on **Metric-Based Achievements** (e.g., 'Reduced load time by 40%').",
    "Include a 'Core Competencies' section with 5-8 relevant tools for the role you're targeting.",
    "Ensure your **GitHub portfolio** shows consistent commit history and clear README files."
  ],
  SKILLS: [
    "I've synchronized your **Skill Gap Analysis**. You should prioritize **Node.js backends** to complete your full-stack synthesis.",
    "The market currently rewards **TypeScript** expertise. Consider migrating your JS projects to TS for higher marketability.",
    "Focus on **System Design** if you're aiming for Senior Intern or Junior Dev positions."
  ],
  INTERVIEW: [
    "Practice the **STAR method** (Situation, Task, Action, Result) for behavioral questions.",
    "Prepare to explain your **Project Architecture** in depth. Draw it out if you can.",
    "Always ask 2-3 strategic questions to the interviewer about their **CI/CD pipelines** or team culture."
  ],
  GREETING: [
    "Tactical Objective: Career Optimization. How can I assist your professional synthesis today?",
    "Greetings, Intern. Ready to accelerate your learning path?",
    "Identity verified. I am your specialized Career Coach. State your objective."
  ],
  DEFAULT: [
    "That's a strategic query. To provide the best advice, could you specify your target role or current technical blocker?",
    "Interesting objective. Have you synchronized this with your **Learning Path** yet?",
    "Scanning database... I recommend reviewing the **Curriculum Vault** for deep-dives on that specific topic."
  ]
};

export const getCareerAdvice = (input) => {
  const query = input.toLowerCase();
  
  if (query.includes('resume') || query.includes('cv')) {
    return RESPONSES.RESUME[Math.floor(Math.random() * RESPONSES.RESUME.length)];
  }
  if (query.includes('skill') || query.includes('learn') || query.includes('study')) {
    return RESPONSES.SKILLS[Math.floor(Math.random() * RESPONSES.SKILLS.length)];
  }
  if (query.includes('interview') || query.includes('job') || query.includes('hiring')) {
    return RESPONSES.INTERVIEW[Math.floor(Math.random() * RESPONSES.INTERVIEW.length)];
  }
  if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
    return RESPONSES.GREETING[Math.floor(Math.random() * RESPONSES.GREETING.length)];
  }
  
  return RESPONSES.DEFAULT[Math.floor(Math.random() * RESPONSES.DEFAULT.length)];
};
