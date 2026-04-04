import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings2, 
  Menu,
  Globe2,
  Target, 
  Video, 
  FolderOpen, 
  Lightbulb, 
  BarChart2, 
  Award, 
  UserPlus, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Mail,
  Github,
  Linkedin,
  X
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans">
      
      {/* SECTION 1 — STICKY NAVBAR */}
      <nav className="sticky top-0 z-50 h-[64px] bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-6 md:px-12 flex items-center justify-between">
         {/* LEFT — Logo area */}
         <div className="flex items-center gap-2.5">
            <div className="w-[36px] h-[36px] rounded-lg bg-[#1E3A5F] flex items-center justify-center text-[#F4A100] font-sora font-bold text-lg">SS</div>
            <div>
               <div className="text-[#1E3A5F] dark:text-white font-sora font-bold text-sm leading-tight">Smart Skill & Live Learning</div>
               <div className="text-[var(--color-text-muted)] text-xs">Module — Gous org</div>
            </div>
         </div>
         
         {/* CENTER — Navigation links */}
         <div className="hidden md:flex items-center gap-2">
            <a href="#features" className="text-[var(--color-text-secondary)] hover:text-[#1E3A5F] dark:hover:text-[#F4A100] text-sm font-medium px-3 py-1 rounded-lg hover:bg-[var(--color-surface-2)] transition-all">Features</a>
            <a href="#teach" className="text-[var(--color-text-secondary)] hover:text-[#1E3A5F] dark:hover:text-[#F4A100] text-sm font-medium px-3 py-1 rounded-lg hover:bg-[var(--color-surface-2)] transition-all">What We Teach</a>
            <a href="#how" className="text-[var(--color-text-secondary)] hover:text-[#1E3A5F] dark:hover:text-[#F4A100] text-sm font-medium px-3 py-1 rounded-lg hover:bg-[var(--color-surface-2)] transition-all">How It Works</a>
            <a href="#roles" className="text-[var(--color-text-secondary)] hover:text-[#1E3A5F] dark:hover:text-[#F4A100] text-sm font-medium px-3 py-1 rounded-lg hover:bg-[var(--color-surface-2)] transition-all">For Roles</a>
         </div>

         {/* RIGHT — Actions */}
         <div className="hidden md:flex items-center gap-3">
            {/* Language globe button */}
            <button 
              onClick={() => navigate('/settings#language')}
              className="text-[var(--color-text-muted)] hover:text-[#1E3A5F] dark:hover:text-white p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-all"
            >
              <Globe2 className="w-5 h-5" />
            </button>

            {/* Settings key button (SPECIAL) */}
            <button 
              onClick={() => navigate('/settings')}
              className="text-[#F4A100] hover:drop-shadow-[0_0_8px_rgba(244,161,0,0.5)] p-2 rounded-lg hover:bg-[#F4A100]/10 transition-all"
            >
              <Settings2 className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-[var(--color-border)]"></div>

            <button 
              onClick={() => navigate('/login')}
              className="border border-[#1E3A5F] dark:border-slate-600 text-[#1E3A5F] dark:text-slate-200 hover:bg-[#1E3A5F] dark:hover:bg-slate-700 hover:text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/auth/register/student')}
              className="bg-[#F4A100] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#FFB733] hover:scale-105 shadow-sm shadow-amber-200/50 transition-all duration-200"
            >
              Register Free
            </button>
         </div>

         {/* Mobile hamburger */}
         <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={() => navigate('/settings')}
              className="text-[#F4A100] hover:drop-shadow-[0_0_8px_rgba(244,161,0,0.5)] p-2 rounded-lg hover:bg-[#F4A100]/10 transition-all"
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[var(--color-text-primary)] p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
         </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[64px] z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 shadow-xl md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
           <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-[var(--color-text-secondary)] font-medium px-4 py-2 hover:bg-[var(--color-surface-2)] rounded-lg">Features</a>
           <a href="#teach" onClick={() => setMobileMenuOpen(false)} className="text-[var(--color-text-secondary)] font-medium px-4 py-2 hover:bg-[var(--color-surface-2)] rounded-lg">What We Teach</a>
           <a href="#how" onClick={() => setMobileMenuOpen(false)} className="text-[var(--color-text-secondary)] font-medium px-4 py-2 hover:bg-[var(--color-surface-2)] rounded-lg">How It Works</a>
           <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="text-[var(--color-text-secondary)] font-medium px-4 py-2 hover:bg-[var(--color-surface-2)] rounded-lg">For Roles</a>
           <div className="h-px w-full bg-[var(--color-border)] my-2"></div>
           <button onClick={() => navigate('/login')} className="w-full border border-[#1E3A5F] dark:border-slate-600 text-[#1E3A5F] dark:text-slate-200 py-2.5 rounded-lg font-semibold">Login</button>
           <button onClick={() => navigate('/auth/register/student')} className="w-full bg-[#F4A100] text-white py-2.5 rounded-lg font-bold">Register Free</button>
        </div>
      )}

      {/* SECTION 2 — HERO */}
      <section className="relative w-full min-h-[90vh] bg-gradient-to-r from-[#0A1628] via-[#1E3A5F] to-[#0A1628] overflow-hidden flex items-center">
        {/* LEFT CONTENT */}
        <div className="max-w-xl px-6 md:px-12 pt-20 pb-20 relative z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full">
            🎓 Complete ERP Learning Platform
          </div>

          <h1 className="mt-5 font-sora font-extrabold text-white text-4xl md:text-6xl leading-tight">
            India's Smart<br/>
            Skill Development<br/>
            <span className="bg-gradient-to-r from-[#F4A100] to-[#FFD166] bg-clip-text text-transparent">Platform</span>
          </h1>

          <p className="mt-4 text-white/70 text-lg leading-relaxed max-w-md">
            Master real skills, attend live lectures, work on real projects, and earn verified certificates — all in one platform by Gous org.
          </p>

          {/* CTA FORM BOX */}
          <div className="mt-8 bg-white dark:bg-[#0F1829] rounded-2xl p-5 shadow-2xl">
            <div className="text-[#1E3A5F] dark:text-white font-semibold text-sm">Get Started — It's Free</div>
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-[#F4A100] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] transition-all outline-none"
              id="heroEmailInput"
            />
            <button 
              onClick={() => {
                const email = document.getElementById('heroEmailInput').value;
                navigate(`/auth/register/student${email ? '?email='+encodeURIComponent(email) : ''}`);
              }}
              className="w-full mt-3 bg-[#F4A100] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#FFB733] transition-all"
            >
              Continue with Email →
            </button>

            <div className="flex items-center justify-center gap-2 my-3">
              <div className="h-px bg-[var(--color-border)] flex-1"></div>
              <span className="text-[var(--color-text-muted)] text-xs">or</span>
              <div className="h-px bg-[var(--color-border)] flex-1"></div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#1E3A5F] dark:text-slate-300 text-sm hover:underline font-medium"
              >
                Already have an account? Login →
              </button>
            </div>
            
            <p className="text-[var(--color-text-muted)] text-xs mt-3 text-center">
              By registering you agree to our Terms & Privacy Policy
            </p>
          </div>

          {/* STATS ROW */}
          <div className="mt-10 flex items-center gap-6 flex-wrap">
             <div>
                <div className="font-sora font-bold text-2xl text-white">1000+</div>
                <div className="text-white/60 text-xs">Students</div>
             </div>
             <div>
                <div className="font-sora font-bold text-2xl text-white">50+</div>
                <div className="text-white/60 text-xs">Teachers</div>
             </div>
             <div>
                <div className="font-sora font-bold text-2xl text-white">500+</div>
                <div className="text-white/60 text-xs">Resources</div>
             </div>
             <div>
                <div className="font-sora font-bold text-2xl text-white">100%</div>
                <div className="text-white/60 text-xs">Free</div>
             </div>
          </div>
        </div>

        {/* RIGHT SIDE (Decorative) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-[#F4A100] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
           <div className="absolute top-1/4 right-20 w-[400px] h-[400px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30"></div>
           {/* Floating Cards Simulation */}
           <div className="absolute right-24 top-1/3 w-64 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 transform rotate-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 rounded-full bg-[#F4A100] flex items-center justify-center text-white"><GraduationCap className="w-5 h-5"/></div>
                 <div>
                    <div className="h-3 w-20 bg-white/30 rounded-full mb-1.5"></div>
                    <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                 </div>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full mb-2"></div>
              <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
           </div>
           <div className="absolute right-48 bottom-1/4 w-56 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transform -rotate-3 shadow-2xl">
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-lg bg-green-400/20 flex items-center justify-center text-green-400"><FolderOpen className="w-4 h-4"/></div>
                 <div>
                    <div className="h-2 w-16 bg-white/30 rounded-full mb-2 mt-1"></div>
                    <div className="h-1.5 w-24 bg-white/20 rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 3 — TRUSTED BY */}
      <section className="bg-[var(--color-surface)] py-6 border-b border-[var(--color-border)]">
         <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-6">
            <div className="font-bold text-[#1E3A5F] dark:text-white shrink-0 whitespace-nowrap border-b md:border-b-0 md:border-r border-[var(--color-border)] pb-4 md:pb-0 md:pr-6">
               | 1000+ Active Learners
            </div>
            <div className="overflow-hidden w-full relative">
               <div className="flex items-center text-[var(--color-text-muted)] text-sm whitespace-nowrap animate-[scroll_20s_linear_infinite]">
                  Python <span className="mx-4 text-gray-300">|</span> React <span className="mx-4 text-gray-300">|</span> JavaScript <span className="mx-4 text-gray-300">|</span> DSA <span className="mx-4 text-gray-300">|</span> SQL <span className="mx-4 text-gray-300">|</span> ML <span className="mx-4 text-gray-300">|</span> DevOps <span className="mx-4 text-gray-300">|</span> UI/UX <span className="mx-4 text-gray-300">|</span> Python <span className="mx-4 text-gray-300">|</span> React <span className="mx-4 text-gray-300">|</span> JavaScript <span className="mx-4 text-gray-300">|</span> DSA
               </div>
            </div>
         </div>
      </section>
      
      <style>{`
         @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
         }
      `}</style>

      {/* SECTION 4 — WHAT YOU LEARN */}
      <section id="teach" className="bg-[var(--color-bg)] py-20 px-6 md:px-12">
         <div className="max-w-7xl mx-auto">
            <h2 className="font-sora font-bold text-2xl md:text-3xl text-[var(--color-text-primary)]">What Will You Learn?</h2>
            <p className="text-[var(--color-text-muted)] mt-2">Choose from 30+ topics and build your career</p>

            <div className="mt-10 space-y-8">
               {/* Row 1 */}
               <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">Programming Languages</h4>
                  <div className="flex flex-wrap gap-y-3">
                     {["HTML", "CSS", "JavaScript", "TypeScript", "Python", "Java", "C++", "C", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust"].map(tag => (
                        <span key={tag} className="text-[#1E3A5F] dark:text-blue-400 hover:text-[#F4A100] dark:hover:text-[#F4A100] text-sm font-medium border-r border-[var(--color-border)] pr-3 mr-3 cursor-pointer transition-colors last:border-0">{tag}</span>
                     ))}
                     <button onClick={() => navigate('/auth/register/student')} className="text-sm font-semibold text-[#F4A100] hover:underline">View all languages ›</button>
                  </div>
               </div>

               {/* Row 2 */}
               <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">Web & Mobile Frameworks</h4>
                  <div className="flex flex-wrap gap-y-3">
                     {["React", "Node.js", "Vue.js", "Angular", "React Native", "Flutter", "Next.js", "Express.js"].map(tag => (
                        <span key={tag} className="text-[#1E3A5F] dark:text-blue-400 hover:text-[#F4A100] dark:hover:text-[#F4A100] text-sm font-medium border-r border-[var(--color-border)] pr-3 mr-3 cursor-pointer transition-colors last:border-0">{tag}</span>
                     ))}
                     <button onClick={() => navigate('/auth/register/student')} className="text-sm font-semibold text-[#F4A100] hover:underline">View all frameworks ›</button>
                  </div>
               </div>

               {/* Row 3 */}
               <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">Data & AI</h4>
                  <div className="flex flex-wrap gap-y-3">
                     {["Machine Learning", "Data Science", "SQL", "MongoDB", "PostgreSQL", "Python for Data", "DSA"].map(tag => (
                        <span key={tag} className="text-[#1E3A5F] dark:text-blue-400 hover:text-[#F4A100] dark:hover:text-[#F4A100] text-sm font-medium border-r border-[var(--color-border)] pr-3 mr-3 cursor-pointer transition-colors last:border-0">{tag}</span>
                     ))}
                     <button onClick={() => navigate('/auth/register/student')} className="text-sm font-semibold text-[#F4A100] hover:underline">View all ›</button>
                  </div>
               </div>

               {/* Row 4 */}
               <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">DevOps & Cloud</h4>
                  <div className="flex flex-wrap gap-y-3">
                     {["Docker", "Git", "AWS", "DevOps", "Linux", "Cybersecurity"].map(tag => (
                        <span key={tag} className="text-[#1E3A5F] dark:text-blue-400 hover:text-[#F4A100] dark:hover:text-[#F4A100] text-sm font-medium border-r border-[var(--color-border)] pr-3 mr-3 cursor-pointer transition-colors last:border-0">{tag}</span>
                     ))}
                     <button onClick={() => navigate('/auth/register/student')} className="text-sm font-semibold text-[#F4A100] hover:underline">View all ›</button>
                  </div>
               </div>

               {/* Row 5 */}
               <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">Design & Other</h4>
                  <div className="flex flex-wrap gap-y-3">
                     {["UI/UX Design", "Figma", "Graphic Design", "REST APIs", "GraphQL", "Blockchain"].map(tag => (
                        <span key={tag} className="text-[#1E3A5F] dark:text-blue-400 hover:text-[#F4A100] dark:hover:text-[#F4A100] text-sm font-medium border-r border-[var(--color-border)] pr-3 mr-3 cursor-pointer transition-colors last:border-0">{tag}</span>
                     ))}
                     <button onClick={() => navigate('/auth/register/student')} className="text-sm font-semibold text-[#F4A100] hover:underline">View all ›</button>
                  </div>
               </div>
            </div>

            <div className="mt-14 pt-8 border-t border-[var(--color-border)] text-center">
               <p className="text-[var(--color-text-primary)] font-medium mb-4">Start learning any of these for FREE</p>
               <button 
                 onClick={() => navigate('/auth/register/student')}
                 className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg hover:bg-[#2E5490] hover:scale-105 transition-all shadow-lg"
               >
                 Explore All Topics →
               </button>
            </div>
         </div>
      </section>

      {/* SECTION 5 — FEATURES */}
      <section id="features" className="bg-[var(--color-surface-2)] py-20 px-6 md:px-12">
         <div className="max-w-7xl mx-auto">
            <div className="mb-14">
               <div className="text-[#F4A100] text-xs uppercase font-semibold tracking-widest mb-2">PLATFORM FEATURES</div>
               <h2 className="font-sora font-bold text-3xl text-[var(--color-text-primary)] mb-3">Everything in One Platform</h2>
               <p className="text-[var(--color-text-muted)] max-w-lg">No need for multiple tools. Everything you need to grow your skills is right here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 {
                   icon: <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
                   bg: "bg-blue-50 dark:bg-blue-900/30",
                   title: "Skill Gap Dashboard",
                   desc: "Know exactly which skills your department needs. Track your personal skill gap with visual charts and progress bars in real time."
                 },
                 {
                   icon: <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
                   bg: "bg-purple-50 dark:bg-purple-900/30",
                   title: "Live Lectures",
                   desc: "Weekly live sessions by expert teachers on real topics. Watch recordings anytime. Ask questions during sessions."
                 },
                 {
                   icon: <FolderOpen className="w-5 h-5 text-green-600 dark:text-green-400" />,
                   bg: "bg-green-50 dark:bg-green-900/30",
                   title: "Real Projects",
                   desc: "Work on actual company-like projects with milestones, deadlines, and scored reviews from your manager."
                 },
                 {
                   icon: <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
                   bg: "bg-amber-50 dark:bg-amber-900/30",
                   title: "AI Recommendations",
                   desc: "Personalized course and video suggestions based on your skill gaps. Your learning path adapts every week automatically."
                 },
                 {
                   icon: <BarChart2 className="w-5 h-5 text-red-600 dark:text-red-400" />,
                   bg: "bg-red-50 dark:bg-red-900/30",
                   title: "Progress Tracking",
                   desc: "Visual weekly growth charts. See your skill score, project results, and attendance all in one dashboard."
                 },
                 {
                   icon: <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
                   bg: "bg-yellow-50 dark:bg-yellow-900/30",
                   title: "Verified Certificates",
                   desc: "Earn certificates with unique QR codes after completing skills and projects. Share directly to LinkedIn."
                 }
               ].map((feat, i) => (
                 <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-lg hover:border-[#F4A100]/30 hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-10 h-10 ${feat.bg} rounded-full flex items-center justify-center mb-4`}>
                       {feat.icon}
                    </div>
                    <h3 className="font-sora font-semibold text-[var(--color-text-primary)] text-lg mb-2">{feat.title}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 6 — HOW IT WORKS */}
      <section id="how" className="bg-[var(--color-bg)] py-20 px-6 md:px-12">
         <div className="max-w-7xl mx-auto">
            <h2 className="font-sora font-bold text-3xl text-center text-[var(--color-text-primary)] mb-16">How It Works</h2>
            
            <div className="flex flex-col md:flex-row gap-10 md:gap-6 relative">
               {/* Connecting arrow background line on desktop */}
               <div className="hidden md:block absolute top-[28px] left-1/6 right-1/6 w-2/3 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
               
               {[
                 {
                   step: "01",
                   icon: <UserPlus className="w-6 h-6" />,
                   bg: "bg-[#1E3A5F]",
                   title: "Register Free",
                   desc: "Create your account in 2 minutes. No credit card. No approval needed."
                 },
                 {
                   step: "02",
                   icon: <BookOpen className="w-6 h-6" />,
                   bg: "bg-[#F4A100]",
                   title: "Learn & Build",
                   desc: "Get your personalized path. Attend live lectures. Work on real projects. Chat with AI assistant anytime."
                 },
                 {
                   step: "03",
                   icon: <Award className="w-6 h-6" />,
                   bg: "bg-green-500",
                   title: "Earn & Grow",
                   desc: "Complete skills and projects to earn verified certificates and advance your career."
                 }
               ].map((step, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10">
                    <div className={`w-14 h-14 rounded-full ${step.bg} text-white flex items-center justify-center shadow-lg relative mb-6 border-4 border-[var(--color-bg)]`}>
                       {step.icon}
                       <div className="absolute -top-2 -right-2 bg-white dark:bg-black text-[#1E3A5F] dark:text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm border border-[var(--color-border)]">
                          {step.step}
                       </div>
                    </div>
                    <h3 className="font-sora font-bold text-[var(--color-text-primary)] text-xl mb-3">{step.title}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm max-w-xs">{step.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 7 — FOR EVERY ROLE */}
      <section id="roles" className="bg-[var(--color-surface-2)] py-20 px-6 md:px-12">
         <div className="max-w-7xl mx-auto">
            <h2 className="font-sora font-bold text-3xl text-center text-[var(--color-text-primary)] mb-16">Built for Every Role</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Student */}
               <div className="bg-[var(--color-surface)] border-2 border-blue-200 dark:border-blue-900/50 rounded-2xl p-8 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <GraduationCap className="w-6 h-6" />
                     </div>
                     <h3 className="font-sora font-bold text-2xl text-[var(--color-text-primary)]">Students & Interns</h3>
                  </div>
                  <ul className="space-y-3 mb-8">
                     {["Track skill gaps visually", "Attend live lectures anytime", "Work on real projects", "AI learning recommendations", "Chat with AI tutor anytime", "Earn verified certificates", "Upload your own projects portfolio", "Learn 30+ languages & technologies"].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm"><span className="text-blue-500 font-bold shrink-0">✓</span> {item}</li>
                     ))}
                  </ul>
                  <button onClick={() => navigate('/auth/register/student')} className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-all">Register as Student →</button>
               </div>

               {/* Teacher */}
               <div className="bg-[var(--color-surface)] border-2 border-purple-200 dark:border-purple-900/50 rounded-2xl p-8 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <BookOpen className="w-6 h-6" />
                     </div>
                     <h3 className="font-sora font-bold text-2xl text-[var(--color-text-primary)]">Teachers & Experts</h3>
                  </div>
                  <ul className="space-y-3">
                     {["Upload learning videos", "Schedule live sessions", "Track each student's progress", "Answer student questions", "Manage class content"].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm"><span className="text-purple-500 font-bold shrink-0">✓</span> {item}</li>
                     ))}
                  </ul>
               </div>

               {/* Manager */}
               <div className="bg-[var(--color-surface)] border-2 border-green-200 dark:border-green-900/50 rounded-2xl p-8 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <Briefcase className="w-6 h-6" />
                     </div>
                     <h3 className="font-sora font-bold text-2xl text-[var(--color-text-primary)]">Managers</h3>
                  </div>
                  <ul className="space-y-3">
                     {["Assign real-world projects", "Review and score submissions", "Monitor team performance", "Approve teacher/HR requests", "Generate team performance reports"].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm"><span className="text-green-500 font-bold shrink-0">✓</span> {item}</li>
                     ))}
                  </ul>
               </div>

               {/* HR Admin */}
               <div className="bg-[var(--color-surface)] border-2 border-amber-200 dark:border-amber-900/50 rounded-2xl p-8 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Users className="w-6 h-6" />
                     </div>
                     <h3 className="font-sora font-bold text-2xl text-[var(--color-text-primary)]">HR Admins</h3>
                  </div>
                  <ul className="space-y-3">
                     {["View all intern progress", "Issue verified certificates", "Compare department performance", "Transfer interns between depts", "Export organization reports"].map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-[var(--color-text-secondary)] text-sm"><span className="text-amber-500 font-bold shrink-0">✓</span> {item}</li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 8 — CTA BANNER */}
      <section className="bg-gradient-to-r from-[#1E3A5F] to-[#2E5490] py-16 px-6 text-center">
         <div className="max-w-3xl mx-auto">
            <h2 className="font-sora font-bold text-3xl text-white mb-3">Ready to Start Your Learning Journey?</h2>
            <p className="text-white/70 mb-8 text-lg max-w-xl mx-auto">Join thousands of students already growing on the Smart Skill & Live Learning Module</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
               <button 
                 onClick={() => navigate('/auth/register/student')}
                 className="w-full sm:w-auto bg-[#F4A100] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#FFB733] hover:scale-105 transition-all shadow-lg"
               >
                 Start Learning Free →
               </button>
               <button 
                 onClick={() => navigate('/login')}
                 className="w-full sm:w-auto border-2 border-white/40 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
               >
                 Login to Dashboard
               </button>
            </div>
         </div>
      </section>

      {/* SECTION 9 — FOOTER */}
      <footer className="bg-[#0A0F1E] text-slate-400 border-t border-white/5 pt-16 pb-6 px-6 md:px-12">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
               {/* Column 1 */}
               <div>
                  <div className="flex items-center gap-2.5 mb-4">
                     <div className="w-[32px] h-[32px] rounded border border-white/10 bg-[#1E3A5F] flex items-center justify-center text-[#F4A100] font-sora font-bold">SS</div>
                     <span className="text-white font-sora font-bold text-lg">SSLLM</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-[#F4A100]/10 text-[#F4A100] mb-4">Gous org</div>
                  <p className="text-sm leading-relaxed">
                    A complete ERP learning platform for skill development, live lectures, real projects, and certified growth. Built for the future of learning.
                  </p>
               </div>

               {/* Column 2 */}
               <div>
                  <h4 className="text-slate-300 text-sm font-semibold mb-5 uppercase tracking-wider">Platform</h4>
                  <ul className="space-y-3">
                     <li><a href="#features" className="text-sm hover:text-white transition-colors">Features</a></li>
                     <li><a href="#how" className="text-sm hover:text-white transition-colors">How It Works</a></li>
                     <li><a href="#roles" className="text-sm hover:text-white transition-colors">For Students</a></li>
                     <li><a href="#roles" className="text-sm hover:text-white transition-colors">For Teachers</a></li>
                     <li><a href="#roles" className="text-sm hover:text-white transition-colors">For Managers</a></li>
                     <li><a href="#roles" className="text-sm hover:text-white transition-colors">For HR Admins</a></li>
                  </ul>
               </div>

               {/* Column 3 */}
               <div>
                  <h4 className="text-slate-300 text-sm font-semibold mb-5 uppercase tracking-wider">Get Started</h4>
                  <ul className="space-y-3">
                     <li><button onClick={() => navigate('/auth/register/student')} className="text-sm hover:text-white transition-colors">Register as Student →</button></li>
                     <li><button onClick={() => navigate('/auth/register/staff')} className="text-sm hover:text-white transition-colors">Request Teacher Access →</button></li>
                     <li><button onClick={() => navigate('/auth/register/staff')} className="text-sm hover:text-white transition-colors">Request Manager Access →</button></li>
                     <li><button onClick={() => navigate('/login')} className="text-sm hover:text-white transition-colors">Login to Platform →</button></li>
                     <li><button onClick={() => navigate('/settings')} className="text-sm hover:text-white transition-colors">Settings →</button></li>
                  </ul>
               </div>

               {/* Column 4 */}
               <div>
                  <h4 className="text-slate-300 text-sm font-semibold mb-5 uppercase tracking-wider">Created By</h4>
                  <div className="text-white font-sora font-bold text-lg mb-4">Gous Khan</div>
                  <ul className="space-y-3">
                     <li><a href="mailto:gousk2004@gmail.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors"><Mail className="w-4 h-4"/> gousk2004@gmail.com</a></li>
                     <li><a href="https://linkedin.com/in/gousskhan" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-white transition-colors"><Linkedin className="w-4 h-4"/> linkedin.com/in/gousskhan</a></li>
                     <li><a href="https://github.com/khangulamgousamjat" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-white transition-colors"><Github className="w-4 h-4"/> github.com/khangulamgousamjat</a></li>
                  </ul>
                  <div className="text-white font-semibold mt-4">🏢 Gous org</div>
                  
                  <div className="flex gap-2 mt-4">
                     <a href="https://github.com/khangulamgousamjat" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all"><Github className="w-4 h-4"/></a>
                     <a href="https://linkedin.com/in/gousskhan" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all"><Linkedin className="w-4 h-4"/></a>
                     <a href="mailto:gousk2004@gmail.com" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all"><Mail className="w-4 h-4"/></a>
                  </div>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 pt-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="text-xs">© 2026 Gous org — All rights reserved</div>
               <div className="text-xs font-semibold text-slate-400">Smart Skill & Live Learning Module v1.0.0</div>
               <div className="text-xs">Made with ❤️ by Gous Khan</div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-6 text-xs border-t border-white/5 pt-4 opacity-70">
               <a href="https://linkedin.com/in/gousskhan" className="hover:text-white transition-colors">LinkedIn</a>
               <span>|</span>
               <a href="https://github.com/khangulamgousamjat" className="hover:text-white transition-colors">GitHub</a>
               <span>|</span>
               <a href="mailto:gousk2004@gmail.com" className="hover:text-white transition-colors">Email</a>
               <span>|</span>
               <button onClick={() => navigate('/settings')} className="hover:text-white transition-colors">Settings</button>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
