import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { theme } = useSelector((state) => state.ui);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Real implementation would call API
    setTimeout(() => {
       toast.success('Password reset link sent to your email');
       setLoading(false);
       setEmail('');
    }, 1000);
  };

  return (
    <div className={`${theme} min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 transition-colors duration-300`}>
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-8 text-center">
        
        <h1 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-2">Forgot Password</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work Email"
            required
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button 
            type="submit" 
            disabled={loading || !email}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-[var(--color-surface)] bg-[var(--color-text-primary)] hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center"
          >
            {loading ? <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/30 border-t-white" /> : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--color-border)] text-sm">
          <Link to="/login" className="font-medium text-[var(--color-primary)] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

