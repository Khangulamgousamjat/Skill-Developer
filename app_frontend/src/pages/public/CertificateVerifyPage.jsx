import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { BadgeCheck, ShieldCheck, XCircle, Calendar, User, Briefcase, FileText, Loader2 } from 'lucide-react';

const CertificateVerifyPage = () => {
  const { theme } = useSelector((state) => state.ui);
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifyCertificate();
  }, [code]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/certificates/verify/${code}`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Invalid certificate code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate verification failed. It may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${theme} min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 text-center transition-colors duration-300`}>
        <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mb-4" />
        <h1 className="text-[var(--color-text-primary)] text-xl font-bold">Verifying Credential...</h1>
        <p className="text-[var(--color-text-muted)] mt-2 font-medium">Connecting to SSLLM Blockchain Registry</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${theme} min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 text-center transition-colors duration-300`}>
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-[var(--color-text-primary)] text-3xl font-extrabold mb-2 tracking-tight">Verification Failed</h1>
        <p className="text-[var(--color-text-muted)] max-w-md mx-auto mb-8 font-medium">{error}</p>
        <Link to="/login" className="px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all">
          Back to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className={`${theme} min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300`}>
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
            <BadgeCheck className="w-14 h-14 text-green-500" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[var(--color-primary)] text-sm font-bold tracking-widest uppercase">Verified Credential</span>
          </div>
          <h1 className="text-[var(--color-text-primary)] text-4xl font-extrabold font-sora tracking-tight leading-tight">
            Authentication Successful
          </h1>
          <p className="text-[var(--color-text-muted)] mt-3 text-lg font-medium">
            This digital certificate is genuine and issued by <strong>NRC INNOVATE-X</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <DetailCard icon={<User />} label="Holder Name" value={data.holder_name} />
          <DetailCard icon={<FileText />} label="Credential Type" value={data.certificate_type} />
          <DetailCard icon={<Calendar />} label="Date Issued" value={new Date(data.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          <DetailCard icon={<Briefcase />} label="Department" value={data.department_name || 'Global Engineering'} />
        </div>

        <div className="bg-[var(--color-bg)] rounded-3xl p-6 border border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[var(--color-text-muted)] text-sm mb-1 uppercase tracking-wider font-bold">Verification Code</p>
            <p className="text-[var(--color-text-primary)] font-mono text-xl font-bold bg-[var(--color-surface)] px-4 py-2 rounded-xl border border-[var(--color-border)] uppercase">{code}</p>
          </div>
          <a
            href={data.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-8 py-4 bg-[var(--color-primary)] text-white font-extrabold rounded-2xl hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center justify-center gap-2"
          >
            Open Original PDF
          </a>
        </div>
      </div>

      <p className="text-[var(--color-text-muted)] mt-8 text-sm font-medium">
        &copy; 2026 Smart Skill & Live Learning Module — Gous org
      </p>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-5 rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)]/30 transition-all">
    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-border)]">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[var(--color-text-primary)] font-bold text-lg leading-tight">{value}</p>
    </div>
  </div>
);

export default CertificateVerifyPage;
