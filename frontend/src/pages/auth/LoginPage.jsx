import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles, Home, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const LoginPage = () => {
  const { t } = useLanguage();
  const { theme } = useSelector((state) => state.ui);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        dispatch(loginSuccess(res.data.data));
        toast.success(`${t('welcomeBack')}, ${res.data.data.user.full_name}!`);
        
        const roleRedirect = {
          student: '/student/dashboard',
          manager: '/manager/dashboard',
          hr_admin: '/hr/dashboard',
          teacher: '/teacher/dashboard',
          super_admin: '/admin/dashboard'
        };
        navigate(roleRedirect[res.data.data.user.role] || '/login');
      }
    } catch (error) {
      if (error.response?.data?.account_status === 'pending_email') {
        navigate('/auth/verify-email', { state: { email } });
        toast.error(error.response.data.message);
      } else if (error.response?.data?.account_status === 'pending_approval') {
        navigate('/auth/pending');
      } else {
         toast.error(error.response?.data?.message || t('loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme} min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500`}>
      <Link 
        to="/" 
        className="fixed top-6 left-6 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl hover:translate-y-[-2px] transition-all group z-50 text-[var(--color-primary)] flex items-center justify-center"
        title="Back to Home"
      >
        <Home size={20} className="group-hover:scale-110 transition-transform" />
      </Link>
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-primary)]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/20"
          >
            <ShieldCheck size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold font-sora text-[var(--color-text-primary)] tracking-tight mb-2">
            Skill Developer <span className="text-[var(--color-primary)]">Platform</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] font-semibold uppercase tracking-[0.1em] text-[11px]">
            Institutional Knowledge Retrieval Engine
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[3rem] shadow-2xl p-12 backdrop-blur-md relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000 text-[var(--color-text-primary)]">
            <Sparkles size={120} />
          </div>

          <h2 className="text-2xl font-bold mb-8 font-sora text-[var(--color-text-primary)]">Authenticate Credentials</h2>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] ml-2">{t('emailAddress')}</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400 group-focus-within/input:text-[var(--color-primary)] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all text-[var(--color-text-primary)]"
                  placeholder="agent@gousorg.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] ml-2">{t('password')}</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400 group-focus-within/input:text-[var(--color-primary)] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-12 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl text-sm focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all text-[var(--color-text-primary)]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-[var(--color-primary)] transition-all p-1"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/auth/forgot-password" id="forgot_password_link" className="text-xs font-bold text-[var(--color-primary)] hover:underline transition-all">
                  {t('forgotPassword')}?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[var(--color-primary)] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[var(--color-primary)]/20 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {t('signIn')} Identity
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-[var(--color-border)] space-y-4 text-center">
            <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide leading-relaxed">
              New to the ecosystem?{' '}
              <Link to="/auth/register/student" className="text-[var(--color-primary)] font-bold hover:underline">
                New Registration
              </Link>
              <span className="mx-3 opacity-40">|</span>
              <Link to="/auth/register/staff" className="text-[var(--color-primary)] font-bold hover:underline">
                Request Staff Auth
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">
          SECURED BY SKILL DEVELOPER INFRASTRUCTURE
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
