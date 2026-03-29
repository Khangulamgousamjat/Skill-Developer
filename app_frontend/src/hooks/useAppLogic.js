import { useState, useRef, useEffect } from 'react';
import { callGemini } from '../services/geminiApi';
import { skillGaps, activeProjects, internData } from '../data/mockData';

export const useAppLogic = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [projectPlans, setProjectPlans] = useState({});
  const [careerCoach, setCareerCoach] = useState({ isOpen: false, loading: false, text: '' });
  const [profileBio, setProfileBio] = useState({ isOpen: false, loading: false, text: '', copied: false });
  const [standupPrep, setStandupPrep] = useState({ isOpen: false, loading: false, text: '', copied: false });
  const [oneOnOnePrep, setOneOnOnePrep] = useState({ isOpen: false, loading: false, text: '', copied: false });
  const [certificateModal, setCertificateModal] = useState(false);
  
  // Chatbot & Lecture Prep State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: 'Hi Alex! I am your AI Mentor Bot. How can I help you with your internship today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [lectureQuestions, setLectureQuestions] = useState({});
  const [progressSummary, setProgressSummary] = useState({ loading: false, text: '' });
  
  // Approach Reviews State
  const [approachInputs, setApproachInputs] = useState({});
  const [approachReviews, setApproachReviews] = useState({});
  
  // Pre-lecture Briefings & Project Boilerplates State
  const [lecturePrereqs, setLecturePrereqs] = useState({});
  const [projectBoilerplate, setProjectBoilerplate] = useState({});
  
  // Manager Email State
  const [progressEmail, setProgressEmail] = useState({ isOpen: false, loading: false, text: '', copied: false });

  // Mini Skill Chats State
  const [skillChats, setSkillChats] = useState({});
  const [skillChatInputs, setSkillChatInputs] = useState({});
  
  // Daily Briefing State
  const [dailyBriefing, setDailyBriefing] = useState({ loading: false, text: '' });

  // Settings & Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    compactView: false,
    dataSaver: false
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const t = {
    bg: isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-gray-50 text-gray-900',
    sidebar: isDarkMode ? 'bg-slate-900/40 backdrop-blur-2xl border-white/10' : 'bg-white border-gray-200',
    card: isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden relative' : 'bg-white border border-gray-100 shadow-sm overflow-hidden relative',
    textMain: isDarkMode ? 'text-white' : 'text-gray-800',
    textMuted: isDarkMode ? 'text-slate-400' : 'text-gray-500',
    border: isDarkMode ? 'border-white/10' : 'border-gray-200',
    borderSoft: isDarkMode ? 'border-white/5' : 'border-gray-100',
    hover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-50',
    input: isDarkMode ? 'bg-slate-800/50 border-white/10 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-200 text-gray-900',
    modalBg: isDarkMode ? 'bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50' : 'bg-white border border-gray-100 shadow-xl',
    profileSection: isDarkMode ? 'bg-black/20' : 'bg-gray-50'
  };

  // AI Toolkit Handlers
  const handleCareerCoach = async () => {
    setCareerCoach({ isOpen: true, loading: true, text: '' });
    const skillsList = skillGaps.map(s => s.name).join(', ');
    const prompt = `Act as an encouraging tech career coach. I am ${internData.name}, a ${internData.role} in the ${internData.department}. My current learning areas are ${skillsList}. Give me a short, inspiring 2-sentence motivational tip and one concrete action item I can do today to advance my career. Keep it friendly and punchy.`;
    const result = await callGemini(prompt);
    setCareerCoach({ isOpen: true, loading: false, text: result });
  };

  const handleGenerateBio = async () => {
    setProfileBio({ isOpen: true, loading: true, text: '', copied: false });
    const strongSkills = skillGaps.filter(s => s.current >= 40).map(s => s.name).join(', ');
    const projectNames = activeProjects.map(p => p.title).join(', ');
    const prompt = `Act as an expert career strategist and resume writer. I am ${internData.name}, a ${internData.role} in the ${internData.department}. I have practical experience in ${strongSkills} and have been actively working on real-world projects like: ${projectNames}. Write a highly professional, engaging 3-sentence LinkedIn "About" section for my profile that highlights my growth and ambition. Keep it punchy and do not use cheesy buzzwords.`;
    const result = await callGemini(prompt);
    setProfileBio({ isOpen: true, loading: false, text: result, copied: false });
  };

  const handleCopyBio = () => {
    const textArea = document.createElement("textarea");
    textArea.value = profileBio.text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setProfileBio(prev => ({ ...prev, copied: true }));
    setTimeout(() => setProfileBio(prev => ({ ...prev, copied: false })), 2000);
  };

  const handleStandupPrep = async () => {
    setStandupPrep({ isOpen: true, loading: true, text: '', copied: false });
    const projectNames = activeProjects.map(p => p.title).join(', ');
    const skillsList = skillGaps.filter(s => s.current < s.required).map(s => s.name).join(', ');
    const prompt = `Act as an agile coach for a junior developer. I am ${internData.name}, a ${internData.role}. My active projects are: ${projectNames}. I am also currently trying to level up my skills in ${skillsList}. Draft a very brief, professional daily standup update (Format: "Yesterday:", "Today:", "Blockers:") that I can copy-paste into my team's Slack channel. Make it sound realistic, proactive, and positive.`;
    const result = await callGemini(prompt);
    setStandupPrep({ isOpen: true, loading: false, text: result, copied: false });
  };

  const handleCopyStandup = () => {
    const textArea = document.createElement("textarea");
    textArea.value = standupPrep.text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setStandupPrep(prev => ({ ...prev, copied: true }));
    setTimeout(() => setStandupPrep(prev => ({ ...prev, copied: false })), 2000);
  };

  const handleOneOnOnePrep = async () => {
    setOneOnOnePrep({ isOpen: true, loading: true, text: '', copied: false });
    const projectNames = activeProjects.map(p => p.title).join(', ');
    const skillsList = skillGaps.filter(s => s.current < s.required).map(s => s.name).join(', ');
    const prompt = `Act as an experienced engineering manager mentoring an intern. I am ${internData.name}, a ${internData.role}. My active projects are: ${projectNames}. I'm trying to improve in: ${skillsList}. Give me 3 smart, strategic questions or discussion topics I should bring up in my upcoming 1-on-1 with my manager to show initiative, get unblocked, or seek valuable feedback. Keep them concise, professional, and directly related to my current tasks.`;
    const result = await callGemini(prompt);
    setOneOnOnePrep({ isOpen: true, loading: false, text: result, copied: false });
  };

  const handleCopyOneOnOne = () => {
    const textArea = document.createElement("textarea");
    textArea.value = oneOnOnePrep.text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setOneOnOnePrep(prev => ({ ...prev, copied: true }));
    setTimeout(() => setOneOnOnePrep(prev => ({ ...prev, copied: false })), 2000);
  };

  const handleDraftProgressEmail = async () => {
    setProgressEmail({ isOpen: true, loading: true, text: '', copied: false });
    const stats = "85% lecture attendance, 92% project performance, 65% overall skill completion.";
    const skillsList = skillGaps.map(s => s.name).join(', ');
    const prompt = `Act as a highly articulate software engineering intern (${internData.name}). Draft a short, professional end-of-week update email to my manager summarizing my recent progress on the Smart Skill & Live Learning Module. My current stats: ${stats}. Mention I've been focusing on ${skillsList}. Keep it concise, positive, and ready to send. Include a subject line.`;
    const result = await callGemini(prompt);
    setProgressEmail({ isOpen: true, loading: false, text: result, copied: false });
  };

  const handleCopyEmail = () => {
    const textArea = document.createElement("textarea");
    textArea.value = progressEmail.text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setProgressEmail(prev => ({ ...prev, copied: true }));
    setTimeout(() => setProgressEmail(prev => ({ ...prev, copied: false })), 2000);
  };

  const handleGenerateDailyBriefing = async () => {
    setDailyBriefing({ loading: true, text: '' });
    const lowestSkill = [...skillGaps].sort((a, b) => a.current - b.current)[0];
    const prompt = `Act as an inspiring tech lead. I am ${internData.name}, a ${internData.role}. My biggest skill gap right now is ${lowestSkill.name} (${lowestSkill.current}%). Give me a punchy, 2-sentence "Daily Focus" to motivate me and give me a specific micro-goal for today related to improving this skill.`;
    const result = await callGemini(prompt);
    setDailyBriefing({ loading: false, text: result });
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    const conversationHistory = chatMessages.map(m => `${m.role === 'user' ? 'Intern' : 'AI'}: ${m.text}`).join('\n');
    const prompt = `You are an internal AI Mentor for Smart Skill & Live Learning Module at Gous org. You are helping ${internData.name}, a ${internData.role} in the ${internData.department}. Keep your responses concise, actionable, and encouraging. \n\nConversation History:\n${conversationHistory}\nIntern: ${userMsg}\nAI:`;

    const result = await callGemini(prompt);
    setChatMessages(prev => [...prev, { role: 'model', text: result }]);
    setIsChatLoading(false);
  };

  const handleSkillChatSubmit = async (e, skill) => {
    e.preventDefault();
    const userMsg = skillChatInputs[skill.id];
    if (!userMsg || !userMsg.trim()) return;

    setSkillChatInputs(prev => ({ ...prev, [skill.id]: '' }));
    
    setSkillChats(prev => {
      const history = prev[skill.id]?.messages || [];
      return { ...prev, [skill.id]: { loading: true, messages: [...history, { role: 'user', text: userMsg }] } };
    });

    const prompt = `Act as a helpful technical mentor explaining ${skill.name} to a software engineering intern (${internData.name}). Answer their doubt concisely and clearly in a friendly tone. Keep it short. Intern asks: "${userMsg}"`;
    const result = await callGemini(prompt);

    setSkillChats(prev => {
      const history = prev[skill.id].messages;
      return { ...prev, [skill.id]: { loading: false, messages: [...history, { role: 'ai', text: result }] } };
    });
  };

  const handleLecturePrep = async (lecture) => {
    setLectureQuestions(prev => ({ ...prev, [lecture.id]: { loading: true, text: '' } }));
    const prompt = `I am a ${internData.role} attending an internal company lecture titled "${lecture.title}" hosted by ${lecture.expert}. Generate 3 smart, insightful questions I can ask during the Q&A to show engagement and eagerness to learn. Keep them brief.`;
    const result = await callGemini(prompt);
    setLectureQuestions(prev => ({ ...prev, [lecture.id]: { loading: false, text: result } }));
  };

  const handleLecturePrereqs = async (lecture) => {
    setLecturePrereqs(prev => ({ ...prev, [lecture.id]: { loading: true, text: '' } }));
    const prompt = `I am a ${internData.role} attending an internal company lecture titled "${lecture.title}" hosted by ${lecture.expert}. What are 3 brief prerequisite concepts, terms, or technologies I should quickly Google and brush up on before the session to make the most of it? Keep it very concise.`;
    const result = await callGemini(prompt);
    setLecturePrereqs(prev => ({ ...prev, [lecture.id]: { loading: false, text: result } }));
  };

  const handleProjectBreakdown = async (project) => {
    setProjectPlans(prev => ({ ...prev, [project.id]: { loading: true, text: '' } }));
    const prompt = `Act as a senior engineering manager. I am an intern assigned to this project: "${project.title}". Provide a brief, 4-step beginner-friendly plan on how I should approach and execute this project. Keep it concise.`;
    const result = await callGemini(prompt);
    setProjectPlans(prev => ({ ...prev, [project.id]: { loading: false, text: result } }));
  };

  const handleApproachReview = async (project) => {
    const approachText = approachInputs[project.id];
    if (!approachText || !approachText.trim()) return;
    
    setApproachReviews(prev => ({ ...prev, [project.id]: { loading: true, text: '' } }));
    const prompt = `Act as a Senior Staff Engineer mentoring an intern. I am assigned to the project: "${project.title}". Here is how I plan to approach solving it: "${approachText}". Give me brief, constructive feedback on my approach. Highlight 1 thing I'm doing right, 1 potential pitfall or edge case I missed, and 1 best practice I should follow. Keep it concise.`;
    const result = await callGemini(prompt);
    setApproachReviews(prev => ({ ...prev, [project.id]: { loading: false, text: result } }));
  };

  const handleGenerateBoilerplate = async (project) => {
    setProjectBoilerplate(prev => ({ ...prev, [project.id]: { loading: true, text: '' } }));
    const prompt = `Act as a helpful Senior Developer. I am an intern assigned to the project: "${project.title}". Provide a very short, clean starting boilerplate code snippet to help me get started. Keep it simple and foundational. Format it cleanly with standard spacing. Do NOT use markdown code block backticks (\`\`\`), just plain text.`;
    const result = await callGemini(prompt);
    setProjectBoilerplate(prev => ({ ...prev, [project.id]: { loading: false, text: result } }));
  };

  const handleProgressSummary = async () => {
    setProgressSummary({ loading: true, text: '' });
    const skillsList = skillGaps.map(s => `${s.name}: ${s.current}% (Target: ${s.required}%)`).join(', ');
    const projectNames = activeProjects.map(p => `${p.title} (${p.status})`).join(', ');
    const prompt = `Act as a supportive engineering manager writing an end-of-month review. I am ${internData.name}, a ${internData.role}. My stats: 85% lecture attendance, 92% project performance, 65% overall skill completion. My current skills: ${skillsList}. Active projects: ${projectNames}. Write a glowing but constructive 1-paragraph progress summary highlighting my strengths and suggesting 1 focus area for next month.`;
    const result = await callGemini(prompt);
    setProgressSummary({ loading: false, text: result });
  };

  // Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    activeTab, setActiveTab,
    projectPlans, setProjectPlans,
    careerCoach, setCareerCoach, handleCareerCoach,
    profileBio, setProfileBio, handleGenerateBio, handleCopyBio,
    standupPrep, setStandupPrep, handleStandupPrep, handleCopyStandup,
    oneOnOnePrep, setOneOnOnePrep, handleOneOnOnePrep, handleCopyOneOnOne,
    certificateModal, setCertificateModal,
    isChatOpen, setIsChatOpen,
    chatMessages,
    chatInput, setChatInput,
    isChatLoading,
    lectureQuestions, handleLecturePrep,
    progressSummary, handleProgressSummary,
    approachInputs, setApproachInputs,
    approachReviews, handleApproachReview,
    lecturePrereqs, handleLecturePrereqs,
    projectBoilerplate, handleGenerateBoilerplate,
    progressEmail, setProgressEmail, handleDraftProgressEmail, handleCopyEmail,
    skillChats, setSkillChats,
    skillChatInputs, setSkillChatInputs, handleSkillChatSubmit,
    dailyBriefing, handleGenerateDailyBriefing,
    isDarkMode, setIsDarkMode,
    isSettingsOpen, setIsSettingsOpen,
    appSettings, setAppSettings,
    isCommandPaletteOpen, setIsCommandPaletteOpen,
    t,
    handleSendMessage,
    chatEndRef
  };
};
