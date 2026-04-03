import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export const TeacherQnAPage = () => {
  const { t, isDarkMode } = useAppContext();
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
      const res = await axios.get('/Teacher/qna');
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
      const res = await axios.post(`/Teacher/qna/${activeQuestion.id}/answer`, { answer: reply });
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Q&A Dashboard</h2>
          <p className={t.textMuted}>Answer pending queries submitted by interns during your lectures.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex-1 rounded-2xl overflow-hidden shadow-sm border ${t.borderSoft} ${t.bg}`}>
          <div className="p-4 border-b font-bold tracking-wide text-amber-500 uppercase text-sm border-amber-500/20 bg-amber-500/5">
            Pending Questions
          </div>
          <div className="divide-y divide-gray-200 dark:divide-white/5">
            {questions.filter(q => !q.answered).map(q => (
              <div 
                key={q.id} 
                onClick={() => setActiveQuestion(q)}
                className={`p-4 cursor-pointer transition-colors ${activeQuestion?.id === q.id ? (isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50') : t.hover}`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <div className="flex-1">
                    <p className={`font-semibold ${t.textMain}`}>{q.question}</p>
                    <p className={`text-xs mt-1 ${t.textMuted}`}>From <strong className={t.textMain}>{q.student}</strong> via {q.lecture}</p>
                  </div>
                </div>
              </div>
            ))}
            {questions.filter(q => !q.answered).length === 0 && (
              <div className="p-10 text-center text-[var(--color-text-muted)] text-sm">You are all caught up!</div>
            )}
          </div>
        </div>

        {activeQuestion && (
           <div className={`w-full lg:w-[450px] p-6 rounded-2xl flex flex-col justify-between ${t.card}`}>
              <div>
                <h3 className={`font-bold text-lg leading-tight mb-2 ${t.textMain}`}>{activeQuestion.question}</h3>
                <p className={`text-sm ${t.textMuted}`}>Posted by {activeQuestion.student}</p>
              </div>
              <div className="mt-8">
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your Teacher answer here..."
                  className={`w-full h-32 p-3 rounded-xl border resize-none focus:ring-2 focus:ring-amber-500 outline-none ${t.input}`}
                ></textarea>
                <button 
                  onClick={submitAnswer}
                  className="w-full mt-4 flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Send className="w-5 h-5" /> Send Reply to Intern
                </button>
              </div>
           </div>
        )}
      </div>

      <div className="mt-10">
        <h3 className={`text-lg font-bold mb-4 ${t.textMain}`}>Answered History</h3>
        <div className="space-y-4">
          {questions.filter(q => q.answered).map(q => (
            <div key={q.id} className={`p-5 rounded-2xl ${t.card}`}>
              <p className={`font-semibold ${t.textMain}`}>{q.question}</p>
              <div className={`mt-3 p-3 text-sm rounded-xl border ${isDarkMode ? 'bg-[var(--color-surface)]/5 border-white/10 text-slate-300' : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
                <strong>Your Reply:</strong> {q.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherQnAPage;

