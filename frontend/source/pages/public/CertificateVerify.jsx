import { useParams, Link } from 'react-router-dom';
import { Construction, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CertificateVerify() {
  const { code } = useParams();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] mb-2">
          Certificate Verification
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          Verifying credential: <span className="font-mono font-bold text-[var(--color-primary)]">{code}</span>
        </p>

        <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl p-6 mb-8 text-center">
          <Construction size={40} className="mx-auto mb-3 text-[var(--color-accent)]" />
          <p className="font-sora font-semibold text-[var(--color-text-primary)]">Verification Engine</p>
          <p className="text-[var(--color-text-muted)] text-sm mt-1 text-center">
            The blockchain verification system is currently being integrated.
          </p>
        </div>

        <Link to="/login" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          Return to Login
        </Link>
      </div>
    </div>
  );
}

