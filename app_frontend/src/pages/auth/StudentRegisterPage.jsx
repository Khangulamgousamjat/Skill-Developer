import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

export default function StudentRegisterPage() {
  const { theme } = useSelector((state) => state.ui);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    department_id: '',
    phone: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await axiosInstance.get('/admin/departments'); // assume public or open
        setDepartments(res.data.data || []);
      } catch (err) {
        // Mock fallback if api fails on public route
        setDepartments([
          { id: '00000000-0000-0000-0000-000000000000', name: 'Computer Science' },
          { id: '11111111-1111-1111-1111-111111111111', name: 'Mechanical Engineering' }
        ]);
      }
    };
    fetchDepts();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return toast.error("Passwords don't match");
    }
    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/register/student', formData);
      toast.success("Registration successful! Please verify your email.");
      navigate('/auth/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme} min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-8 transition-colors duration-300`}>
      <div className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-[var(--color-primary)]">
            <span className="text-[var(--color-accent)] font-bold text-xl font-sora">SS</span>
          </div>
          <h1 className="text-xl font-bold font-sora text-[var(--color-primary)] leading-tight">Student Registration</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">Smart Skill & Live Learning Module</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Full Name</label>
              <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                     className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                     placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange}
                     className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                     placeholder="email@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Password</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange}
                     className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                     placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Confirm Password</label>
              <input required type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange}
                     className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                     placeholder="••••••••" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Department</label>
              <select name="department_id" onChange={handleChange} value={formData.department_id} required
                      className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]">
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Phone (Optional)</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                     className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                     placeholder="+1234567890" />
            </div>
          </div>

          <button type="submit" disabled={loading}
                  className="w-full py-2.5 mt-4 rounded-lg font-semibold text-sm text-white bg-[var(--color-primary)] hover:bg-opacity-90 transition-all disabled:opacity-60 flex justify-center items-center">
            {loading ? <div className="w-5 h-5 border-2 rounded-full animate-spin border-white/30 border-t-white" /> : 'Register as Student'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--color-border)] text-center">
           <Link to="/login" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
             Already have an account? Sign In
           </Link>
        </div>
      </div>
    </div>
  );
}
