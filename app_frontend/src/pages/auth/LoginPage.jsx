import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { theme } = useSelector((state) => state.ui);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        toast.success(`Welcome back, ${res.data.data.user.full_name}!`);
        
        // Role-based redirect
        const roleRedirect = {
          student: '/student/dashboard',
          manager: '/manager/dashboard',
          hr_admin: '/hr/dashboard',
          expert: '/expert/dashboard',
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
         toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme} min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300`}>
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-sora font-bold text-2xl text-[var(--color-text-primary)] mb-1">
            Smart Skill & Live Learning Module
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Gous org — ERP Learning Platform
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 relative z-10">
          <h2 className="text-2xl font-bold mb-6 font-sora text-[var(--color-text-primary)]">Welcome back</h2>
          
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 ml-1">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[var(--color-border)] rounded-xl leading-5 bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition-all sm:text-sm"
                  placeholder="intern@gousorg.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[var(--color-border)] rounded-xl leading-5 bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition-all sm:text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/auth/forgot-password" className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-[var(--color-accent)]/20 text-sm font-bold text-white bg-[var(--color-primary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center space-y-3 relative z-10">
            <p className="text-sm text-[var(--color-text-secondary)]">
              New Intern?{' '}
              <Link to="/auth/register/student" className="font-semibold text-[var(--color-primary)] hover:opacity-80 transition-colors">
                Register here
              </Link>
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Staff Member?{' '}
              <Link to="/auth/register/staff" className="font-semibold text-[var(--color-primary)] hover:opacity-80 transition-colors">
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
