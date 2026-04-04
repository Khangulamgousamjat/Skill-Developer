import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TeacherQnA() {
  const { isDarkMode } = { isDarkMode: document.documentElement.classList.contains('dark') };
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/teacher/qna');
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!reply.trim() || !activeQuestion) return;
    try {
      setIsSubmitting(true);
      const res = await axios.post(`/teacher/qna/${activeQuestion.id}/answer`, { answer: reply });
      if (res.data.success) {
        toast.success('Answer sent to student!');
        setReply('');
        setActiveQuestion(null);
        fetchQuestions();
      }
    } catch (err) {
      toast.error('Failed to send answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex justify-between items-center mb-6 text-left">
          <div>
            <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Q&A Dashboard</h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Answer pending queries submitted by interns during your lectures.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 rounded-[32px] overflow-hidden shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="p-4 border-b font-bold tracking-wide text-amber-500 uppercase text-xs border-amber-500/20 bg-amber-500/5 text-left">
              Pending Questions
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <div className="p-10 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
                </div>
              ) : questions.filter(q => !q.answered).map(q => (
                <div 
                  key={q.id} 
                  onClick={() => setActiveQuestion(q)}
                  className={`p-5 cursor-pointer transition-colors text-left ${activeQuestion?.id === q.id ? 'bg-amber-500/5' : 'hover:bg-[var(--color-surface-2)]/50'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--color-text-primary)] text-sm line-clamp-2">{q.question}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest mt-1">From {q.student} • {q.lecture}</p>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && questions.filter(q => !q.answered).length === 0 && (
                <div className="p-16 text-center">
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">All queries resolved!</p>
                </div>
              )}
            </div>
          </div>

          {activeQuestion && (
             <div className="w-full lg:w-[450px] p-8 rounded-[40px] flex flex-col justify-between border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-amber-500/5 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest">Active Query</span>
                  </div>
                  <h3 className="font-bold text-xl leading-tight text-[var(--color-text-primary)] mb-2 font-sora">{activeQuestion.question}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">Posted by <span className="text-[var(--color-text-primary)] font-bold">{activeQuestion.student}</span></p>
                </div>
                <div className="mt-10">
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your Teacher response..."
                    className="w-full h-32 p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] resize-none focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all"
                  ></textarea>
                  <button 
                    onClick={submitAnswer}
                    disabled={isSubmitting || !reply.trim()}
                    className="w-full mt-4 flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                    Broadcast Reply
                  </button>
                </div>
             </div>
          )}
        </div>

        <div className="mt-12 text-left">
          <h3 className="text-lg font-bold mb-6 font-sora text-[var(--color-text-primary)]">Resolved History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.filter(q => q.answered).map(q => (
              <div key={q.id} className="p-6 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] group hover:border-amber-500/30 transition-all">
                <p className="font-bold text-[var(--color-text-primary)] text-sm mb-3 line-clamp-1">{q.question}</p>
                <div className="p-4 text-xs rounded-2xl bg-[var(--color-surface-2)]/50 border border-[var(--color-border)] text-[var(--color-text-secondary)] italic leading-relaxed">
                  <span className="text-amber-500 font-black not-italic uppercase text-[9px] block mb-1">Your Broadcast:</span>
                  "{q.answer}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

