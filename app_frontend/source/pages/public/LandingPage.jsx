import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings2, 
  Target, 
  Video, 
  FolderOpen, 
  Brain, 
  BarChart2, 
  Award, 
  UserPlus, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Linkedin, 
  Mail,
  Globe,
  MessageCircle,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage, LANGUAGES } = useLanguage();
  const [langModalOpen, setLangModalOpen] = useState(false);

  const stats = [
    { val: '500+', label: t('learningResources') },
    { val: '50+', label: t('TeacherTeachers') },
    { val: '1000+', label: t('activeStudents') },
    { val: '100%', label: t('freeToJoin') }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white font-sans selection:bg-[#F4A100]/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 h-[64px] bg-[#0A0F1E]/85 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E3A5F] rounded-xl flex items-center justify-center text-[#F4A100] font-sora font-bold text-xl">SS</div>
            <div>
               <div className="font-sora font-bold text-white text-sm leading-tight">{t('appTitle')}</div>
               <div className="text-slate-400 text-xs">{t('orgName')}</div>
            </div>
         </div>
         <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white text-sm transition-colors">{t('features')}</a>
            <a href="#about" className="text-slate-300 hover:text-white text-sm transition-colors">{t('about')}</a>
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangModalOpen(!langModalOpen)}
                className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface)]/5"
              >
                <Globe className="w-4 h-4 text-[#F4A100]" />
                <span>{LANGUAGES.find(l => l.code === language)?.native}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langModalOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langModalOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-[#111827] border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLangModalOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-[var(--color-surface)]/5 transition-colors ${language === lang.code ? 'text-[#F4A100] bg-[var(--color-surface)]/5' : 'text-slate-300'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span>{lang.flag}</span>
                        <span>{lang.native}</span>
                      </span>
                      {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-[#F4A100]"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[var(--color-surface)]/10 transition-colors"
              title={t('settings')}
            >
              <Settings2 className="w-5 h-5 text-[#F4A100]" />
            </button>
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => navigate('/login')}
                 className="bg-[#1E3A5F] text-white hover:bg-[#2E5490] px-5 py-2 rounded-lg text-sm font-semibold transition-all"
               >
                 {t('login')}
               </button>
               <button 
                 onClick={() => navigate('/auth/register/student')}
                 className="border border-[#F4A100] text-[#F4A100] hover:bg-[#F4A100] hover:text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
               >
                 {t('register')}
               </button>
            </div>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#060D1A] via-[#0F1E35] to-[#1E3A5F] px-6">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#F4A100 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F4A100]/10 border border-[#F4A100]/30 text-[#F4A100] text-xs font-medium">
            🎓 {t('heroBadge')}
          </div>
          <h1 className="mt-8 font-sora font-extrabold text-5xl md:text-7xl text-white leading-[1.1]">
            {t('heroTitleLine1')}<br />
            {t('heroTitleLine2')}<br />
            <span className="bg-gradient-to-r from-[#F4A100] to-[#FFB733] bg-clip-text text-transparent">{t('heroTitleModule')}</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-slate-300 text-lg leading-relaxed">
            {t('heroDesc')}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/auth/register/student')}
              className="bg-[#F4A100] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFB733] hover:scale-105 transition-all shadow-lg shadow-[#F4A100]/20"
            >
              {t('getStartedFree')}
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--color-surface)]/10 backdrop-blur-sm transition-all"
            >
              {t('loginToPlatform')}
            </button>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="font-sora font-bold text-3xl text-[#F4A100]">{stat.val}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0A0F1E] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sora font-bold text-3xl md:text-5xl text-white">{t('featuresTitle')}</h2>
            <p className="text-slate-400 mt-4 text-lg">{t('featuresSub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Target className="w-6 h-6 text-blue-500" />, 
                title: t('skillRequirementDashboard') || "Skill Requirement Dashboard", 
                desc: "See exactly which skills your department needs. Track your personal skill gap with visual progress bars and radar charts in real time.", 
                bg: "bg-blue-500/10" 
              },
              { 
                icon: <Video className="w-6 h-6 text-purple-500" />, 
                title: t('liveLectureIntegration') || "Live Lecture Integration", 
                desc: "Attend weekly live sessions by Teacher teachers. Topics based on real company needs. Watch recordings anytime you miss a session.",
                bg: "bg-purple-500/10"
              },
              { 
                icon: <FolderOpen className="w-6 h-6 text-green-500" />, 
                title: t('realWorldProjectAssignment') || "Real-World Project Assignment", 
                desc: "Work on actual company projects with milestones and deadlines. Get scored and reviewed by your manager with detailed feedback.",
                bg: "bg-green-500/10"
              },
              { 
                icon: <Brain className="w-6 h-6 text-amber-500" />, 
                title: t('aiLearningRecommendations') || "AI Learning Recommendations", 
                desc: "Get personalized course and video suggestions based on your skill gaps. Your learning path adapts as you grow every week.",
                bg: "bg-amber-500/10"
              },
              { 
                icon: <BarChart2 className="w-6 h-6 text-red-500" />, 
                title: t('progressTrackingDashboard') || "Progress Tracking Dashboard", 
                desc: "Visual charts showing your weekly growth. Track skills completed, project scores, and lecture attendance all in one place.",
                bg: "bg-red-500/10"
              },
              { 
                icon: <Award className="w-5 h-5 text-yellow-500" />, 
                title: t('certificationEvaluation') || "Certification & Evaluation", 
                desc: "Earn verified certificates with QR codes after completing skills and projects. Share directly to LinkedIn from your dashboard.",
                bg: "bg-yellow-500/10"
              }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-[#F4A100]/30 hover:shadow-2xl hover:shadow-[#F4A100]/5 transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#F4A100] transition-colors">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Students Learn */}
      <section className="py-24 bg-[#1E3A5F] px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-sora font-bold text-3xl md:text-5xl text-white">{t('whatYouWillLearn')}</h2>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">{t('chooseFromTopics')}</p>
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {[
              { name: 'HTML' }, { name: 'CSS' }, { name: 'JavaScript' }, { name: 'Python' }, 
              { name: 'Java' }, { name: 'C++' }, { name: 'C' }, { name: 'Ruby' }, 
              { name: 'PHP' }, { name: 'Swift' }, { name: 'Kotlin' }, { name: 'Go' }, 
              { name: 'Rust' }, { name: 'TypeScript' }, { name: 'React' }, { name: 'Node.js' }, 
              { name: 'Angular' }, { name: 'Vue.js' }, { name: 'SQL' }, { name: 'MongoDB' }, 
              { name: 'DSA' }, { name: 'Data Science' }, { name: 'Machine Learning' }, 
              { name: 'UI/UX Design' }, { name: 'DevOps' }, { name: 'Cloud Computing' }, 
              { name: 'Cybersecurity' }, { name: 'Docker' }, { name: 'Git' }, 
              { name: 'REST APIs' }, { name: 'GraphQL' }
            ].map((tag, i) => (
              <div key={i} className="px-5 py-2.5 rounded-full text-sm font-medium border border-white/20 bg-[var(--color-surface)]/5 hover:scale-110 hover:bg-[var(--color-surface)]/10 transition-all cursor-default">
                {tag.name}
              </div>
            ))}
          </div>
          <div className="mt-16">
            <p className="text-slate-300 text-sm mb-8">{t('andManyMore')}</p>
            <button 
              onClick={() => navigate('/auth/register/student')}
              className="bg-[#F4A100] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#FFB733] transition-all"
            >
              {t('startLearning')} →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#0A0F1E] px-6">
         <div className="max-w-7xl mx-auto">
            <h2 className="font-sora font-bold text-3xl md:text-5xl text-center text-white mb-20">{t('howItWorks')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
               <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-[2px] border-t-2 border-dashed border-white/10"></div>
               {[
                  { step: "1", icon: <UserPlus />, title: t('registerFree') || "Register Free", desc: "Create your student account in 2 minutes. No credit card. No approval needed.", color: "bg-[#F4A100]" },
                  { step: "2", icon: <BookOpen />, title: t('followYourPath') || "Follow Your Path", desc: "Get your personalized AI learning path. Attend live lectures. Work on real projects.", color: "bg-[#1E3A5F]" },
                  { step: "3", icon: <Award />, title: t('earnGrow') || "Earn & Grow", desc: "Complete skills and projects to earn verified certificates you can share anywhere.", color: "bg-green-500" }
               ].map((item, i) => (
                  <div key={i} className="relative flex flex-col items-center text-center z-10">
                     <div className={`w-12 h-12 ${item.color} text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-xl`}>
                        {item.step}
                     </div>
                     <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center text-[#F4A100] mb-6 border border-white/5">
                        {item.icon}
                     </div>
                     <h3 className="text-2xl font-bold mb-4 text-white font-sora">{item.title}</h3>
                     <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* For Every Role */}
      <section id="about" className="py-24 bg-[#111827] px-6">
         <div className="max-w-7xl mx-auto">
            <h2 className="font-sora font-bold text-3xl md:text-5xl text-center text-white mb-20">{t('builtForEveryRole')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { 
                    role: "Student/Intern", 
                    icon: <GraduationCap className="text-blue-500" />,
                    features: [
                      "Track your skill gap visually",
                      "Attend live lectures anytime",
                      "Work on real projects",
                      "Get AI learning recommendations",
                      "Earn verified certificates",
                      "Chat with AI tutor for doubts",
                      "Upload your own projects"
                    ]
                  },
                  { 
                    role: "Teacher", 
                    icon: <BookOpen className="text-purple-500" />,
                    features: [
                      "Upload learning videos",
                      "Schedule live sessions",
                      "Track student progress",
                      "Answer student questions",
                      "Manage class content"
                    ]
                  },
                  { 
                    role: "Manager", 
                    icon: <Briefcase className="text-green-500" />,
                    features: [
                      "Assign real-world projects",
                      "Review and score submissions",
                      "Monitor team performance",
                      "Approve teacher and HR access",
                      "Generate team reports"
                    ]
                  },
                  { 
                    role: "HR Admin", 
                    icon: <Users className="text-amber-500" />,
                    features: [
                      "View all intern progress",
                      "Issue certificates manually",
                      "Compare department scores",
                      "Transfer interns between depts",
                      "Export organization reports"
                    ]
                  }
               ].map((card, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-[#0A0F1E] border border-white/5">
                     <div className="w-12 h-12 bg-[#111827] rounded-xl flex items-center justify-center mb-6">
                        {card.icon}
                     </div>
                     <h3 className="text-xl font-bold mb-6 text-white font-sora">{card.role}</h3>
                     <ul className="space-y-4">
                        {card.features.map((f, fi) => (
                           <li key={fi} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className="text-green-500 mt-1">✓</span>
                              {f}
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 bg-[#060D1A] border-t border-white/10">
         <div className="max-w-7xl mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#1E3A5F] rounded-lg flex items-center justify-center text-[#F4A100] font-bold text-sm">SS</div>
                  <span className="font-sora font-bold text-white text-base">SSLLM</span>
               </div>
               <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F4A100]/10 border border-[#F4A100]/30 text-[#F4A100] text-xs font-medium mb-6">{t('orgName')}</div>
               <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {t('heroDesc').split('.')[0]}.
               </p>
               <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-surface)]/5 flex items-center justify-center text-slate-400 hover:bg-[#F4A100] hover:text-white transition-all"><Globe className="w-5 h-5" /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-surface)]/5 flex items-center justify-center text-slate-400 hover:bg-[#F4A100] hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-surface)]/5 flex items-center justify-center text-slate-400 hover:bg-[#F4A100] hover:text-white transition-all"><Mail className="w-5 h-5" /></a>
               </div>
            </div>

            <div>
               <h4 className="font-sora font-semibold text-white mb-6 uppercase tracking-wider text-xs">{t('platform')}</h4>
               <ul className="space-y-4">
                  <li><a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">{t('features')}</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{t('howItWorks')}</a></li>
                  <li><button onClick={() => navigate('/login')} className="text-slate-400 hover:text-white transition-colors text-sm">{t('login')}</button></li>
                  <li><button onClick={() => navigate('/auth/register/student')} className="text-slate-400 hover:text-white transition-colors text-sm">{t('registerAsStudent')}</button></li>
                  <li><button onClick={() => navigate('/auth/register/staff')} className="text-slate-400 hover:text-white transition-colors text-sm">{t('requestStaffAccess')}</button></li>
               </ul>
            </div>

            <div>
               <h4 className="font-sora font-semibold text-white mb-6 uppercase tracking-wider text-xs">{t('contact')}</h4>
               <ul className="space-y-4">
                  <li className="flex items-center gap-2 text-sm text-slate-400"><Mail className="w-4 h-4" /> gousk2004@gmail.com</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><Linkedin className="w-4 h-4" /> linkedin.com/in/gousskhan</li>
                  <li className="flex items-center gap-2 text-sm text-slate-400"><Globe className="w-4 h-4" /> khangulamgousamjat</li>
               </ul>
               <h4 className="font-sora font-semibold text-white mt-10 mb-6 uppercase tracking-wider text-xs">{t('madeBy')}</h4>
               <div className="text-sm text-slate-400">👨‍💻 Gous Khan</div>
               <div className="text-sm text-slate-400 mt-1">🏢 Gous org</div>
            </div>

            <div>
               <h4 className="font-sora font-semibold text-white mb-6 uppercase tracking-wider text-xs">{t('legal')}</h4>
               <ul className="space-y-4">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
               </ul>
               <div className="mt-10 pt-6 border-t border-white/5">
                  <div className="text-white text-sm font-semibold">{t('appTitle')}</div>
                  <div className="text-slate-500 text-xs mt-1">Version 1.0.0</div>
               </div>
            </div>
         </div>
         <div className="bg-black/30 py-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs">© 2026 {t('orgName')} — {t('appTitle')}</p>
            <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">{t('madeBy')} ❤️ by Gous Khan</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;

