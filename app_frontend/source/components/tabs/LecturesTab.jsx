import React from 'react';
import { Video, BookMarked, HelpCircle } from 'lucide-react';
import { GlareHover } from '../ui/GlareHover';
import { useAppContext } from '../../context/AppContext';
import { upcomingLectures, internData } from '../../data/mockData';

export const LecturesTab = () => {
  const { isDarkMode, t, appSettings, lecturePrereqs, handleLecturePrereqs, lectureQuestions, handleLecturePrep } = useAppContext();

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${t.textMain}`}>Live Lecture Integration</h2>
      <p className={t.textMuted}>Join weekly sessions by company Teachers based on real needs.</p>
      
      <div className={`space-y-4 ${appSettings.compactView ? 'space-y-2' : 'space-y-4'}`}>
        {upcomingLectures.map(lecture => (
          <GlareHover
            key={lecture.id}
            glareColor={isDarkMode ? "#ffffff" : "#3f37b3"}
            glareOpacity={0.15}
            className={`${t.card} p-5 flex flex-col gap-4 hover:border-blue-500/50 transition-colors`}
          >
            <div className="relative z-10 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-4 rounded-lg mr-5 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                    <Video className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${t.textMain}`}>{lecture.title}</h3>
                    <p className={`text-sm mt-1 ${t.textMuted}`}>Teacher: {lecture.Teacher}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium mb-2 ${t.textMain}`}>{lecture.time}</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 w-full transition-colors relative z-20">
                    Join Session
                  </button>
                </div>
              </div>
              
              {/* AI Lecture Prep Section */}
              <div className={`pt-4 border-t flex flex-col gap-2 ${t.borderSoft}`}>
                {!lecturePrereqs[lecture.id] ? (
                  <button 
                    onClick={() => handleLecturePrereqs(lecture)}
                    className={`flex items-center w-max text-sm font-medium transition-colors relative z-20 ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-800'}`}
                  >
                    ✨ What should I know before attending? (AI Pre-Brief)
                  </button>
                ) : (
                  <div className={`p-4 rounded-lg shadow-sm mb-2 border ${isDarkMode ? 'bg-teal-900/20 border-teal-500/20' : 'bg-teal-50 border-teal-100'}`}>
                    <div className={`flex items-center mb-2 font-semibold text-sm ${isDarkMode ? 'text-teal-300' : 'text-teal-800'}`}>
                      <BookMarked className="w-4 h-4 mr-2" />
                      Recommended Prerequisites
                    </div>
                    {lecturePrereqs[lecture.id].loading ? (
                      <div className={`text-sm animate-pulse flex items-center ${isDarkMode ? 'text-teal-400' : 'text-teal-500'}`}>
                        Analyzing lecture topic...
                      </div>
                    ) : (
                      <div className={`text-sm whitespace-pre-wrap leading-relaxed ${isDarkMode ? 'text-teal-50' : 'text-[var(--color-text-secondary)]'}`}>
                        {lecturePrereqs[lecture.id].text}
                      </div>
                    )}
                  </div>
                )}

                {!lectureQuestions[lecture.id] ? (
                  <button 
                    onClick={() => handleLecturePrep(lecture)}
                    className={`flex items-center w-max text-sm font-medium transition-colors relative z-20 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    ✨ Generate Q&A Ideas for this session
                  </button>
                ) : (
                  <div className={`p-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-blue-900/20 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`flex items-center mb-2 font-semibold text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Suggested Questions
                    </div>
                    {lectureQuestions[lecture.id].loading ? (
                      <div className={`text-sm animate-pulse flex items-center ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                        Brainstorming questions...
                      </div>
                    ) : (
                      <div className={`text-sm whitespace-pre-wrap leading-relaxed ${isDarkMode ? 'text-blue-50' : 'text-[var(--color-text-secondary)]'}`}>
                        {lectureQuestions[lecture.id].text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </GlareHover>
        ))}
      </div>
    </div>
  );
};

