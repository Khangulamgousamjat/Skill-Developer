import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function OTPVerifyPage() {
  const { theme } = useSelector((state) => state.ui);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please register again.');
      navigate('/auth/register/student');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // Auto submit when full
    if (newOtp.every(digit => digit !== '')) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (completeOtp) => {
    const otpString = typeof completeOtp === 'string' ? completeOtp : otp.join('');
    if (otpString.length < 6) return toast.error('Please enter complete OTP');

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/verify-email', { email, otp: otpString });
      toast.success('Email verified successfully!');
      
      // Auto login after verification (handle token if backend sends it)
      if (res.data?.data?.accessToken) {
        // Redux action would normally go here if we had dispatch
        navigate('/login'); // For safety, redirect to login
      } else {
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post('/auth/resend-otp', { email });
      toast.success('OTP resent to your email');
      setTimeLeft(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className={`${theme} min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 transition-colors duration-300`}>
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-8 text-center">
        
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-green-500/10 text-green-500">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
           </svg>
        </div>

        <h1 className="text-xl font-bold font-sora text-[var(--color-text-primary)] leading-tight mb-2">Check your email</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">
          We sent a 6-digit verification code to <br/>
          <span className="font-semibold text-[var(--color-primary)]">{email}</span>
        </p>

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all"
            />
          ))}
        </div>

        <button 
          onClick={() => handleSubmit()} 
          disabled={loading || otp.join('').length < 6}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[var(--color-primary)] hover:opacity-90 transition-all disabled:opacity-60 flex justify-center items-center mb-6"
        >
          {loading ? <div className="w-5 h-5 border-2 rounded-full animate-spin border-white/30 border-t-white" /> : 'Verify Account'}
        </button>

        <div className="text-sm">
          {timeLeft > 0 ? (
            <p className="text-[var(--color-text-muted)]">Resend code in <span className="font-semibold text-[var(--color-text-primary)]">{timeLeft}s</span></p>
          ) : (
            <button onClick={handleResend} className="font-medium text-[var(--color-primary)] hover:underline">
              Resend verification code
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
          <Link to="/login" className="text-sm font-medium text-[var(--color-text-muted)] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

