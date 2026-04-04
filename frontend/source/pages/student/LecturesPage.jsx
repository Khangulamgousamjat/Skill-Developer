import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  Video, Calendar, User2, Clock, Loader2,
  MessageSquare, BookMarked, ExternalLink, Mic, CheckCircle
} from 'lucide-react';

const LectureCard = ({ lecture, t, isDarkMode }) => {
  const { lectureQuestions, handleLecturePrep, lecturePrereqs, handleLecturePrereqs } = useAppContext();
  const [activePanel, setActivePanel] = useState(null); // 'questions' | 'prereqs' | null
  const qData = lectureQuestions[lecture.id];
  const pData = lecturePrereqs[lecture.id];

  const togglePanel = (panel) => setActivePanel(v => v === panel ? null : panel);

  return (
    <div className={`rounded-2xl overflow-hidden glare-hover ${t.card}`}>
      {/* Header accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #1E3A5F, #F4A100)' }} />

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
            isDarkMode ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>
            <Mic className="w-3 h-3" /> LIVE UPCOMING
          </div>
        </div>

        <h3 className={`font-bold text-base leading-snug mb-3 ${t.textMain}`}>{lecture.title}</h3>

        <div className="space-y-1.5 mb-4">
          <div className={`flex items-center gap-2 text-sm ${t.textMuted}`}>
            <User2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F4A100' }} />
            {lecture.Teacher_name}
          </div>
          <div className={`flex items-center gap-2 text-sm ${t.textMuted}`}>
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#F4A100' }} />
            {new Date(lecture.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
          {lecture.attended && (
            <div className={`flex items-center gap-2 text-sm text-emerald-500 font-bold`}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Attended
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Smart Questions */}
          <button
            onClick={() => { handleLecturePrep(lecture); togglePanel('questions'); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20'
                         : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'
            }`}
          >
            <MessageSquare className="w-3 h-3" /> Smart Questions
          </button>

          {/* Pre Lecture Prereqs */}
          <button
            onClick={() => { handleLecturePrereqs(lecture); togglePanel('prereqs'); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
                         : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
            }`}
          >
            <BookMarked className="w-3 h-3" /> Pre-Lecture Brief
          </button>

          {/* Join Link */}
          {lecture.meeting_link ? (
            <a
              href={lecture.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                isDarkMode ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                           : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
              }`}
            >
              <ExternalLink className="w-3 h-3" /> Join Session
            </a>
          ) : (
            <button
               disabled
               className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border opacity-50 cursor-not-allowed ${
                isDarkMode ? 'bg-slate-500/10 text-slate-300 border-slate-500/20'
                           : 'bg-slate-50 text-slate-700 border-slate-100'
              }`}
            >
              <Clock className="w-3 h-3" /> Link Not Ready
            </button>
          )}
        </div>
      </div>

      {/* AI Smart Questions Panel */}
      {activePanel === 'questions' && (
        <div className={`px-5 pb-5 border-t ${t.border}`}>
          <p className={`text-xs font-bold uppercase tracking-wider py-3 ${t.textMuted}`}>AI-Generated Smart Questions</p>
          {qData?.loading ? (
            <div className="flex items-center gap-2 text-sm text-indigo-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating questions…
            </div>
          ) : qData?.text ? (
            <div className={`text-sm leading-relaxed whitespace-pre-line rounded-xl p-3 ${
              isDarkMode ? 'bg-indigo-500/5 text-indigo-200 border border-indigo-500/10'
                         : 'bg-indigo-50 text-indigo-800 border border-indigo-100'
            }`}>
              {qData.text}
            </div>
          ) : null}
        </div>
      )}

      {/* Pre-Lecture Brief Panel */}
      {activePanel === 'prereqs' && (
        <div className={`px-5 pb-5 border-t ${t.border}`}>
          <p className={`text-xs font-bold uppercase tracking-wider py-3 ${t.textMuted}`}>Pre-Lecture Prerequisites</p>
          {pData?.loading ? (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating briefing…
            </div>
          ) : pData?.text ? (
            <div className={`text-sm leading-relaxed whitespace-pre-line rounded-xl p-3 ${
              isDarkMode ? 'bg-amber-500/5 text-amber-200 border border-amber-500/10'
                         : 'bg-amber-50 text-amber-800 border border-amber-100'
            }`}>
              {pData.text}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const LecturesPage = () => {
  const { t, isDarkMode, studentLectures, isDataLoading } = useAppContext();
  const [tab, setTab] = useState('upcoming');

  const filteredLectures = studentLectures.filter(l => {
    const isPast = new Date(l.scheduled_at) < new Date();
    return tab === 'past' ? isPast : !isPast;
  });

  if (isDataLoading && studentLectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
        <p className={`mt-4 ${t.textMuted}`}>Retrieving live session calendar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Live Lectures</h2>
          <p className={t.textMuted}>Company Teacher sessions with AI preparation tools.</p>
        </div>
        <div className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl ${
          isDarkMode ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          {studentLectures.filter(l => new Date(l.scheduled_at) > new Date()).length} Sessions Upcoming
        </div>
      </div>

      {/* Tab Bar */}
      <div className={`flex gap-1 p-1 rounded-xl w-fit ${isDarkMode ? 'bg-[var(--color-surface)]/5' : 'bg-[var(--color-surface-2)]'}`}>
        {['upcoming', 'past'].map(t2 => (
          <button
            key={t2}
            onClick={() => setTab(t2)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
              tab === t2
                ? isDarkMode ? 'bg-[var(--color-surface)]/10 text-white shadow-sm' : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {t2}
          </button>
        ))}
      </div>

      {filteredLectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLectures.map(l => (
            <LectureCard key={l.id} lecture={l} t={t} isDarkMode={isDarkMode} />
          ))}
        </div>
      ) : (
        <div className={`p-12 rounded-2xl text-center ${t.card}`}>
          <Video className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-700' : 'text-gray-200'}`} />
          <p className={`font-semibold ${t.textMain}`}>No {tab} sessions found.</p>
          <p className={`text-sm mt-1 ${t.textMuted}`}>Records will appear here as they are scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default LecturesPage;

