import { useState, useRef, useEffect } from 'react';
import { callGemini } from '../services/geminiApi';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const useAppLogic = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [projectPlans, setProjectPlans] = useState({});
  const [careerCoach, setCareerCoach] = useState({ isOpen: false, loading: false, text: '' });
  const [profileBio, setProfileBio] = useState({ isOpen: false, loading: false, text: '', copied: false });
  const [standupPrep, setStandupPrep] = useState({ isOpen: false, loading: false, text: '', copied: false });
  const [oneOnOnePrep, setOneOnOnePrep] = useState({ isOpen: false, loading: false, text: '', copied: false });
  const [certificateModal, setCertificateModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Real Student Data State
  const [studentSkills, setStudentSkills] = useState([]);
  const [studentProjects, setStudentProjects] = useState([]);
  const [studentLectures, setStudentLectures] = useState([]);
  const [studentOverview, setStudentOverview] = useState({ 
    xp: 0, 
    level: 1,
    streak: 0, 
    levelProgress: 0,
    activeProjectsCount: 0, 
    nextLecture: null,
    recentBadges: []
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  
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
  const { theme } = useSelector((state) => state.ui);
  const isDarkMode = theme === 'dark';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    compactView: false,
    dataSaver: false
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // ─── Socket Integration ──────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const socket = io(serverUrl, { withCredentials: true });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to socket server');
        socket.emit('register', user.id);
      });

      socket.on('receive_notification', (notif) => {
        setNotifications(prev => [{ ...notif, id: Date.now(), read: false }, ...prev]);
        // Also show a toast
        import('react-hot-toast').then(({ toast }) => {
          toast(notif.message, { icon: '🔔', duration: 4000 });
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user?.id]);

  // ─── Data Fetching Logic ──────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && role === 'student') {
      fetchStudentDashboardData();
    }
  }, [isAuthenticated, role]);

  const fetchStudentDashboardData = async () => {
    try {
      setIsDataLoading(true);
      const [overview, skills, projects, lectures] = await Promise.all([
        axios.get('/student/overview'),
        axios.get('/student/skills'),
        axios.get('/student/projects'),
        axios.get('/student/lectures')
      ]);

      if (overview.data.success) setStudentOverview(overview.data.data);
      if (skills.data.success)   setStudentSkills(skills.data.data);
      if (projects.data.success) setStudentProjects(projects.data.data);
      if (lectures.data.success)  setStudentLectures(lectures.data.data);
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const themeStyles = {
    bg: isDarkMode ? 'bg-[#070D1A] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#0F172A]',
    sidebar: isDarkMode ? 'bg-[#050B14] border-white/10' : 'bg-white border-gray-200',
    sidebarText: isDarkMode ? 'text-[#F1F5F9]' : 'text-[#334155]',
    sidebarTextMuted: isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]',
    card: isDarkMode ? 'bg-[#0F1829] backdrop-blur-xl border border-[#1E2D45] shadow-2xl relative' : 'bg-white border border-gray-100 shadow-sm relative',
    textMain: isDarkMode ? 'text-[#F1F5F9]' : 'text-[#0F172A]',
    textMuted: isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]',
    border: isDarkMode ? 'border-[#1E2D45]' : 'border-[#E2E8F0]',
    borderSoft: isDarkMode ? 'border-white/5' : 'border-gray-100',
    hover: isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50',
    sidebarHover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5',
    input: isDarkMode ? 'bg-[#162033] border-[#1E2D45] text-[#F1F5F9] placeholder-[#94A3B8]' : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#0F172A]',
    modalBg: isDarkMode ? 'bg-[#0F1829]/95 backdrop-blur-2xl border border-[#1E2D45] shadow-2xl' : 'bg-white border border-gray-100 shadow-xl',
    profileSection: isDarkMode ? 'bg-black/20' : 'bg-gray-50'
  };

  // AI Toolkit Handlers
  const handleCareerCoach = async () => {
    setCareerCoach({ isOpen: true, loading: true, text: '' });
    const skillsList = studentSkills.map(s => s.name).join(', ');
    const prompt = `Act as an encouraging tech career coach. I am ${user.full_name}, a student intern at Gous org. My current learning areas are ${skillsList}. Give me a short, inspiring 2-sentence motivational tip and one concrete action item I can do today to advance my career. Keep it friendly and punchy.`;
    const result = await callGemini(prompt);
    setCareerCoach({ isOpen: true, loading: false, text: result });
  };

  const handleGenerateBio = async () => {
    setProfileBio({ isOpen: true, loading: true, text: '', copied: false });
    const strongSkills = studentSkills.filter(s => s.current >= 60).map(s => s.name).join(', ');
    const projectNames = studentProjects.map(p => p.title).join(', ');
    const prompt = `Act as an Teacher career strategist and resume writer. I am ${user.full_name}, an intern at Gous org. I have practical experience in ${strongSkills} and have been actively working on real-world projects like: ${projectNames}. Write a highly professional, engaging 3-sentence LinkedIn "About" section for my profile that highlights my growth and ambition. Keep it punchy and do not use cheesy buzzwords.`;
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
    const projectNames = studentProjects.map(p => p.title).join(', ');
    const skillsList = studentSkills.filter(s => s.current < s.required).map(s => s.name).join(', ');
    const prompt = `Act as an agile coach for a junior developer. I am ${user.full_name}, a student intern at Gous org. My active projects are: ${projectNames}. I am also currently trying to level up my skills in ${skillsList}. Draft a very brief, professional daily standup update (Format: "Yesterday:", "Today:", "Blockers:") that I can copy-paste into my team's Slack channel. Make it sound realistic, proactive, and positive.`;
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
    const projectNames = studentProjects.map(p => p.title).join(', ');
    const skillsList = studentSkills.filter(s => s.current < s.required).map(s => s.name).join(', ');
    const prompt = `Act as an experienced engineering manager mentoring an intern. I am ${user.full_name}, an intern at Gous org. My active projects are: ${projectNames}. I'm trying to improve in: ${skillsList}. Give me 3 smart, strategic questions or discussion topics I should bring up in my upcoming 1-on-1 with my manager to show initiative, get unblocked, or seek valuable feedback. Keep them concise, professional, and directly related to my current tasks.`;
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
    const stats = `${studentOverview.streak} day streak, ${studentOverview.activeProjectsCount} active projects, ${studentOverview.xp} XP earned.`;
    const skillsList = studentSkills.map(s => s.name).join(', ');
    const prompt = `Act as a highly articulate software engineering intern (${user.full_name}). Draft a short, professional end-of-week update email to my manager summarizing my recent progress on the Smart Skill & Live Learning Module at Gous org. My current stats: ${stats}. Mention I've been focusing on ${skillsList}. Keep it concise, positive, and ready to send. Include a subject line.`;
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
    if (studentSkills.length === 0) return;
    setDailyBriefing({ loading: true, text: '' });
    const lowestSkill = [...studentSkills].sort((a, b) => a.current - b.current)[0];
    const prompt = `Act as an inspiring tech lead for Gous org. I am ${user.full_name}, a student intern here. My biggest skill gap right now is ${lowestSkill.name} (currently at ${lowestSkill.current}%). Give me a punchy, 2-sentence "Daily Focus" to motivate me and give me a specific micro-goal for today related to improving this skill.`;
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
    
    // CONTEXT-AWARE MENTOR PROMPT
    const context = `
      User: ${user.full_name}
      Current Level: ${studentOverview.level}
      Experience Points: ${studentOverview.xp}
      Learning Streak: ${studentOverview.streak} days
      Next Lecture: ${studentOverview.nextLecture?.title || 'None scheduled'}
    `.trim();

    const prompt = `You are "SSLLM GPT", the hyper-intelligent AI Mentor for the Smart Skill & Live Learning Module at Gous org. 
    You are mentoring an intern with the following current status:
    ${context}

    Your goal is to be helpful, encouraging, and technically sharp. 
    Reference their current XP, streak, or upcoming lectures if relevant to their inquiry.
    Keep responses concise (max 3-4 sentences), actionable, and professional. 
    Use modern tech terminology correctly.

    Conversation so far:
    ${conversationHistory}
    Intern asks: "${userMsg}"
    Assistant response:`;

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

    const prompt = `Act as a helpful technical mentor explaining ${skill.name} to a software engineering intern (${user.full_name}) at Gous org. Answer their doubt concisely and clearly in a friendly tone. Keep it short. Intern asks: "${userMsg}"`;
    const result = await callGemini(prompt);

    setSkillChats(prev => {
      const history = prev[skill.id].messages;
      return { ...prev, [skill.id]: { loading: false, messages: [...history, { role: 'ai', text: result }] } };
    });
  };

  const handleLecturePrep = async (lecture) => {
    setLectureQuestions(prev => ({ ...prev, [lecture.id]: { loading: true, text: '' } }));
    const prompt = `I am a ${internData.role} attending an internal company lecture titled "${lecture.title}" hosted by ${lecture.Teacher}. Generate 3 smart, insightful questions I can ask during the Q&A to show engagement and eagerness to learn. Keep them brief.`;
    const result = await callGemini(prompt);
    setLectureQuestions(prev => ({ ...prev, [lecture.id]: { loading: false, text: result } }));
  };

  const handleLecturePrereqs = async (lecture) => {
    setLecturePrereqs(prev => ({ ...prev, [lecture.id]: { loading: true, text: '' } }));
    const prompt = `I am a ${internData.role} attending an internal company lecture titled "${lecture.title}" hosted by ${lecture.Teacher}. What are 3 brief prerequisite concepts, terms, or technologies I should quickly Google and brush up on before the session to make the most of it? Keep it very concise.`;
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
    const skillsList = studentSkills.map(s => `${s.name}: ${s.current}% (Target: ${s.required}%)`).join(', ');
    const projectNames = studentProjects.map(p => `${p.title} (${p.status})`).join(', ');
    const prompt = `Act as a supportive engineering manager writing an end-of-month review at Gous org. I am ${user.full_name}, an intern here. Stats: ${studentOverview.xp} XP, ${studentOverview.streak} day streak. My current skills: ${skillsList}. Active projects: ${projectNames}. Write a glowing but constructive 1-paragraph progress summary highlighting my strengths and suggesting 1 focus area for next month.`;
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
    studentSkills, studentProjects, studentLectures, studentOverview, isDataLoading,
    fetchStudentDashboardData,
    isDarkMode,
    isSettingsOpen, setIsSettingsOpen,
    appSettings, setAppSettings,
    isCommandPaletteOpen, setIsCommandPaletteOpen,
    t,
    handleSendMessage,
    chatEndRef,
    notifications,
    setNotifications,
    isNotifOpen, 
    setIsNotifOpen
  };
};
