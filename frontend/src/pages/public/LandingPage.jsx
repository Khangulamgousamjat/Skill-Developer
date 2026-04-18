import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Video, FolderGit2, Lightbulb, 
  BarChart3, Award, ArrowRight, CheckCircle2,
  Users, GraduationCap, Globe, Zap, ChevronDown,
  Sun, Moon
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { setTheme } from '../../store/slices/uiSlice';
import { applyTheme } from '../../utils/applyTheme';

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, language, changeLanguage, LANGUAGES } = useLanguage();
  const { theme } = useSelector((s) => s.ui);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <Target className="w-6 h-6" />, 
      color: "text-blue-400 bg-blue-500/10",
      title: t('feature1Title'),
      desc: t('feature1Desc')
    },
    {
      icon: <Video className="w-6 h-6" />, 
      color: "text-purple-400 bg-purple-500/10",
      title: t('feature2Title'),
      desc: t('feature2Desc')
    },
    {
      icon: <FolderGit2 className="w-6 h-6" />, 
      color: "text-green-400 bg-green-500/10",
      title: t('feature3Title'),
      desc: t('feature3Desc')
    },
    {
      icon: <Lightbulb className="w-6 h-6" />, 
      color: "text-amber-400 bg-amber-500/10",
      title: t('feature4Title'),
      desc: t('feature4Desc')
    },
    {
      icon: <BarChart3 className="w-6 h-6" />, 
      color: "text-red-400 bg-red-500/10",
      title: t('skillHeatMap'),
      desc: t('feature4Desc')
    },
    {
      icon: <Award className="w-6 h-6" />, 
      color: "text-yellow-400 bg-yellow-500/10",
      title: t('certificates'),
      desc: t('feature3Desc')
    },
  ];

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(next));
    applyTheme(next);
    localStorage.setItem('skill_developer_theme', next);
  };

  return (
    <div className={`min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] selection:bg-[#F4A100]/30 transition-colors duration-500`}>
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[var(--color-surface)]/80 backdrop-blur-xl border-[var(--color-border)] py-3 shadow-lg shadow-black/5' 
          : 'bg-transparent border-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-premium-gradient border border-[var(--color-border)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-[#F4A100] font-sora font-extrabold">SD</span>
            </div>
            <div>
              <p className="font-sora font-bold text-base leading-tight">Skill Developer</p>
              <p className="text-[#F4A100] text-[10px] font-bold tracking-widest uppercase">{t('orgName')}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[#F4A100] transition-colors">
              {t('navFeatures')}
            </a>
            <a href="#howitworks" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[#F4A100] transition-colors">
              {t('navHowItWorks')}
            </a>
            <a href="#reviews" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[#F4A100] transition-colors">
              {t('navReviews')}
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[#F4A100]/50 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F4A100]" /> : <Moon className="w-4 h-4 text-[var(--color-primary)]" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[#F4A100]/50 transition-all text-xs font-bold"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline uppercase">{currentLang.code}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-2 z-[60]"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          language === lang.code ? 'bg-[#F4A100] text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.native}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => navigate('/login')} className="text-sm font-semibold hover:text-[#F4A100] transition-colors">
              {t('login')}
            </button>
            <button 
              onClick={() => navigate('/auth/register/student')}
              className="bg-[#F4A100] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(244,161,0,0.4)] transition-all active:scale-95"
            >
              {t('getStartedFree')}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#F4A100]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[#F4A100] text-xs font-bold tracking-wide mb-8"
            >
              <Zap className="w-3 h-3" /> {t('navHowItWorks')}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-sora font-extrabold leading-[1.1] mb-8"
            >
              <span dangerouslySetInnerHTML={{ __html: t('heroTitle').replace(': ', ':<br/>') }} />
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[var(--color-text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
            >
              <button 
                onClick={() => navigate('/auth/register/student')}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F4A100] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(244,161,0,0.5)] transition-all active:scale-95"
              >
                {t('getStartedFree')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-all font-semibold text-lg"
              >
                {t('launchPlatform')}
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex items-center justify-center lg:justify-start gap-8"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-surface-2)]" />
                ))}
              </div>
              <p className="text-sm text-[var(--color-text-muted)]"><span className="text-[var(--color-text-primary)] font-bold">12k+</span> {t('activeStudents').toLowerCase()}</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-xl"
          >
            <div className="aspect-square rounded-3xl bg-premium-gradient border border-[var(--color-border)] overflow-hidden p-8 flex items-center justify-center">
              <div className="w-full h-full border border-white/5 rounded-2xl bg-[#0A1628] glass flex items-center justify-center group">
                 <GraduationCap className="w-32 h-32 text-[#F4A100]/30 group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute top-10 left-10 p-4 rounded-2xl glass-premium shadow-2xl">
                    <CheckCircle2 className="text-[#F4A100] w-6 h-6 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Weekly Goal</p>
                    <p className="text-sm font-bold text-white">Advanced React</p>
                 </div>
                 <div className="absolute bottom-10 right-10 p-4 rounded-2xl glass-premium shadow-2xl">
                    <Users className="text-blue-400 w-6 h-6 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Live Study</p>
                    <p className="text-sm font-bold text-white">1.2k active now</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">{t('featuresTitle')}</h2>
            <p className="text-[var(--color-text-secondary)] text-lg">{t('featuresSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[#F4A100]/30 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-sora font-bold mb-4">{feature.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[40px] bg-premium-gradient border border-white/10 p-12 md:p-20 overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-6xl font-sora font-bold mb-8 italic text-white">{t('ctaTitle')}</h2>
              <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">{t('ctaSubtitle')}</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/auth/register/student')}
                  className="w-full sm:w-auto !bg-white !text-black px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all active:scale-95 border-2 border-transparent hover:border-white/20"
                >
                  {t('ctaButton')}
                </button>
                <p className="text-white/40 text-sm">No credit card required. Cancel anytime.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-gradient pt-20 pb-10 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#F4A100] flex items-center justify-center">
                  <span className="text-white font-bold text-xs uppercase">SD</span>
                </div>
                <span className="font-sora font-bold text-xl tracking-tight">Skill Developer</span>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                Empowering the next generation of creators through accessible, high-quality technical education and ERP systems.
              </p>
            </div>

            {[
              { title: t('platform'), links: [t('navFeatures'), t('lectures'), t('projects'), t('dashboard')] },
              { title: 'Community', links: ['Success Stories', 'Expert Teachers', 'GitHub Connect', 'Mentorship'] },
              { title: 'Organization', links: ['About Gous Org', 'Contact', 'Privacy Policy', 'Terms of Service'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="font-sora font-bold mb-6 uppercase tracking-widest text-xs">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[var(--color-text-secondary)] hover:text-[#F4A100] text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-[0.2em]">© 2026 GOUS ORG. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-6">
               <Globe className="w-4 h-4 text-[var(--color-text-muted)] hover:text-[#F4A100] cursor-pointer transition-colors" />
               <p className="text-[var(--color-text-muted)] text-xs">Built with precision in India</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
