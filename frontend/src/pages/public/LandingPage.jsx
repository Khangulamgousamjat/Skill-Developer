import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A1628]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 h-16
        bg-[#0A1628]/95 backdrop-blur-md
        border-b border-white/10
        flex items-center justify-between px-6 md:px-12">

        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-lg bg-[#1E3A5F]
            flex items-center justify-center">
            <span className="text-[#F4A100] font-bold
              text-base font-sora">SS</span>
          </div>
          <div>
            <p className="text-white font-sora font-bold
              text-sm leading-tight">
              Smart Skill &amp; Live Learning
            </p>
            <p className="text-slate-400 text-xs">
              Module — Gous org
            </p>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="border border-white/30 text-white
              px-5 py-2 rounded-lg text-sm font-semibold
              hover:bg-white/10 transition-all">
            Login
          </button>
          <button
            onClick={() => navigate('/auth/register/student')}
            className="bg-[#F4A100] text-white
              px-5 py-2 rounded-lg text-sm font-bold
              hover:bg-[#FFB733] transition-all">
            Register Free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="min-h-[90vh] flex items-center
        px-6 md:px-12 py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2
            bg-[#F4A100]/10 border border-[#F4A100]/30
            text-[#F4A100] text-xs px-4 py-1.5 rounded-full">
            🎓 Complete ERP Learning Platform by Gous org
          </span>

          <h1 className="mt-6 font-sora font-extrabold
            text-white text-5xl md:text-7xl leading-tight">
            Smart Skill<br />
            &amp; Live<br />
            <span className="bg-gradient-to-r from-[#F4A100]
              to-[#FFD166] bg-clip-text text-transparent">
              Learning Module
            </span>
          </h1>

          <p className="mt-6 text-slate-300 text-lg
            leading-relaxed max-w-lg">
            The complete platform to manage your learning
            journey — master real skills, attend live lectures,
            work on real-world projects, and earn verified
            certificates. Built by Gous org.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/auth/register/student')}
              className="bg-[#F4A100] text-white px-8 py-4
                rounded-xl font-bold text-lg
                hover:bg-[#FFB733] hover:scale-105
                transition-all duration-200 shadow-lg">
              Start Learning Free →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border-2 border-white/30 text-white
                px-8 py-4 rounded-xl font-semibold text-lg
                hover:bg-white/10 transition-all">
              Login to Platform
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4
            gap-6">
            {[
              { num: '500+', label: 'Learning Resources' },
              { num: '50+', label: 'Expert Teachers' },
              { num: '1000+', label: 'Active Students' },
              { num: '100%', label: 'Free to Join' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-sora font-bold text-3xl
                  text-[#F4A100]">{s.num}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white py-20 px-6 md:px-12"
        id="features">
        <p className="text-[#F4A100] text-xs font-semibold
          uppercase tracking-widest text-center">
          PLATFORM FEATURES
        </p>
        <h2 className="font-sora font-bold text-3xl
          text-gray-900 text-center mt-2">
          Everything in One Platform
        </h2>
        <p className="text-gray-500 text-center mt-3">
          One powerful platform for complete skill development
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6
          mt-14 max-w-6xl mx-auto">
          {[
            {
              icon: '🎯', color: 'bg-blue-50 text-blue-600',
              title: 'Skill Gap Dashboard',
              desc: 'See exactly which skills your department needs. Track personal skill gap with visual charts.'
            },
            {
              icon: '🎥', color: 'bg-purple-50 text-purple-600',
              title: 'Live Lectures',
              desc: 'Weekly live sessions by expert teachers. Watch recordings anytime. Ask questions live.'
            },
            {
              icon: '📁', color: 'bg-green-50 text-green-600',
              title: 'Real Projects',
              desc: 'Work on actual company-like projects with milestones, deadlines, and reviewed scoring.'
            },
            {
              icon: '💡', color: 'bg-amber-50 text-amber-600',
              title: 'AI Recommendations',
              desc: 'Personalized course and video suggestions based on your skill gaps every week.'
            },
            {
              icon: '📊', color: 'bg-red-50 text-red-600',
              title: 'Progress Tracking',
              desc: 'Visual weekly growth charts. Skill scores, project results, attendance in one dashboard.'
            },
            {
              icon: '🏆', color: 'bg-yellow-50 text-yellow-600',
              title: 'Verified Certificates',
              desc: 'Earn QR-verified certificates after completing skills and projects. Share on LinkedIn.'
            },
          ].map(f => (
            <div key={f.title}
              className="bg-white border border-gray-100
                rounded-2xl p-6 shadow-sm hover:shadow-lg
                hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${f.color}
                flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-sora font-semibold text-gray-900
                text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-2
                leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT YOU LEARN */}
      <div className="bg-[#060D1A] py-20 px-6 md:px-12"
        id="teach">
        <h2 className="font-sora font-bold text-3xl md:text-5xl
          text-white text-center">
          What You Will Learn
        </h2>
        <p className="text-slate-400 text-center mt-3">
          Choose from 30+ programming languages and technologies
        </p>

        <div className="flex flex-wrap justify-center gap-3
          mt-12 max-w-5xl mx-auto">
          {[
            'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React',
            'Vue.js', 'Angular', 'Node.js', 'Python', 'Java',
            'C++', 'C', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
            'Go', 'Rust', 'SQL', 'MongoDB', 'Docker', 'Git',
            'DevOps', 'AWS', 'Machine Learning', 'Data Science',
            'DSA', 'UI/UX Design', 'React Native', 'Flutter',
            'GraphQL', 'REST APIs', 'Cybersecurity', 'Blockchain',
          ].map((lang, i) => {
            const colors = [
              'bg-blue-500/10 border-blue-500/30 text-blue-400',
              'bg-green-500/10 border-green-500/30 text-green-400',
              'bg-amber-500/10 border-amber-500/30 text-amber-400',
              'bg-purple-500/10 border-purple-500/30 text-purple-400',
              'bg-red-500/10 border-red-500/30 text-red-400',
              'bg-teal-500/10 border-teal-500/30 text-teal-400',
            ];
            return (
              <span key={lang}
                className={`px-4 py-2 rounded-full text-sm
                  font-medium border
                  hover:scale-110 transition-transform cursor-default
                  ${colors[i % colors.length]}`}>
                {lang}
              </span>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm mb-6">
            And many more — your path is personalized for your goals
          </p>
          <button
            onClick={() => navigate('/auth/register/student')}
            className="bg-[#F4A100] text-white px-8 py-3.5
              rounded-xl font-bold hover:bg-[#FFB733]
              transition-all">
            Start Learning Free →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#030810] py-16 px-6 md:px-12
        border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4
          gap-10 max-w-6xl mx-auto">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#1E3A5F]
                flex items-center justify-center">
                <span className="text-[#F4A100] font-bold
                  font-sora">SS</span>
              </div>
              <div>
                <p className="text-white font-sora font-bold
                  text-sm">Smart Skill &</p>
                <p className="text-white font-sora font-bold
                  text-sm">Live Learning Module</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A complete ERP learning platform for skill
              development, live lectures, real projects,
              and certified growth.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-slate-300 text-sm font-semibold
              mb-4 uppercase tracking-wide">Platform</p>
            {[
              ['Features', '#features'],
              ['How It Works', '#how'],
              ['For Students', '/auth/register/student'],
              ['Login', '/login'],
              ['Settings', '/settings'],
            ].map(([label, href]) => (
              <div key={label} className="mb-2">
                <a href={href}
                  className="text-slate-400 hover:text-white
                    text-sm transition-colors">
                  {label}
                </a>
              </div>
            ))}
          </div>

          {/* Get Started */}
          <div>
            <p className="text-slate-300 text-sm font-semibold
              mb-4 uppercase tracking-wide">Get Started</p>
            {[
              ['Register as Student', '/auth/register/student'],
              ['Request Staff Access', '/auth/register/staff'],
              ['Login to Platform', '/login'],
            ].map(([label, href]) => (
              <div key={label} className="mb-2">
                <a href={href}
                  className="text-slate-400 hover:text-white
                    text-sm transition-colors">
                  {label}
                </a>
              </div>
            ))}
          </div>

          {/* Creator */}
          <div>
            <p className="text-slate-300 text-sm font-semibold
              mb-4 uppercase tracking-wide">Created By</p>
            <p className="text-white font-sora font-bold
              text-lg mb-3">Gous Khan</p>
            <div className="space-y-2">
              <a href="mailto:gousk2004@gmail.com"
                className="flex items-center gap-2
                  text-slate-400 hover:text-white
                  text-sm transition-colors">
                📧 gousk2004@gmail.com
              </a>
              <a href="https://linkedin.com/in/gulamgous"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2
                  text-slate-400 hover:text-white
                  text-sm transition-colors">
                💼 linkedin.com/in/gulamgous
              </a>
              <a href="https://github.com/khangulamgousamjat"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2
                  text-slate-400 hover:text-white
                  text-sm transition-colors">
                🐙 github.com/khangulamgousamjat
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-slate-300 text-sm font-semibold">
                🏢 Gous Org.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-6
          flex flex-col md:flex-row items-center
          justify-between gap-2 max-w-6xl mx-auto">
          <p className="text-slate-500 text-xs">
            © 2026 Gous org — All rights reserved
          </p>
          <p className="text-slate-500 text-xs">
            Smart Skill &amp; Live Learning Module v1.0.1
          </p>
          <p className="text-slate-500 text-xs">
            Made by <a href="https://github.com/Khangulamgousamjat/Skill-Developer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gous Org</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
