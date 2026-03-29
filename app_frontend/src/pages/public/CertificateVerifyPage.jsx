import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { BadgeCheck, ShieldCheck, XCircle, Calendar, User, Briefcase, FileText, Loader2 } from 'lucide-react';

const CertificateVerifyPage = () => {
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
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h1 className="text-white text-xl font-bold">Verifying Credential...</h1>
        <p className="text-slate-400 mt-2">Connecting to SSLLM Blockchain Registry</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-white text-3xl font-bold mb-2">Verification Failed</h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8">{error}</p>
        <Link to="/login" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
          Back to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
            <BadgeCheck className="w-14 h-14 text-green-500" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-sm font-bold tracking-widest uppercase">Verified Credential</span>
          </div>
          <h1 className="text-white text-4xl font-extrabold font-sora tracking-tight leading-tight">
            Authentication Successful
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            This digital certificate is genuine and issued by <strong>NRC INNOVATE-X</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <DetailCard icon={<User />} label="Holder Name" value={data.holder_name} />
          <DetailCard icon={<FileText />} label="Credential Type" value={data.certificate_type} />
          <DetailCard icon={<Calendar />} label="Date Issued" value={new Date(data.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          <DetailCard icon={<Briefcase />} label="Department" value={data.department_name || 'Global Engineering'} />
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Verification Code</p>
            <p className="text-white font-mono text-xl font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase">{code}</p>
          </div>
          <a
            href={data.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
          >
            Open Original PDF
          </a>
        </div>
      </div>

      <p className="text-slate-600 mt-8 text-sm">
        &copy; 2026 Smart Skill & Live Learning Module — Gous org
      </p>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/3 border border-white/5">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-bold text-lg leading-tight">{value}</p>
    </div>
  </div>
);

export default CertificateVerifyPage;
