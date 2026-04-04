import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const getHome = () => {
    const homes = {
      super_admin : '/admin/dashboard',
      hr_admin    : '/hr/dashboard',
      manager     : '/manager/dashboard',
      teacher      : '/teacher/dashboard',
      student     : '/student/dashboard',
    };
    return homes[user?.role] || '/login';
  };

  return (
    <div className="min-h-screen flex items-center
                    justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <p className="text-8xl font-bold font-sora
                      text-[var(--color-primary)]">
          404
        </p>
        <p className="text-xl font-sora font-semibold
                      text-[var(--color-text-primary)] mt-2">
          Page not found
        </p>
        <p className="text-[var(--color-text-muted)]
                      text-sm mt-1 mb-6">
          Smart Skill & Live Learning Module — Gous org
        </p>
        <button
          onClick={() => navigate(getHome())}
          className="px-6 py-2.5 rounded-lg font-medium
                     bg-[var(--color-primary)] text-white
                     hover:bg-[var(--color-primary-light)]
                     transition-all text-sm"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

