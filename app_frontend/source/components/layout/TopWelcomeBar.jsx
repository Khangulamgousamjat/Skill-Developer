import React from 'react';
import { Award, Zap } from 'lucide-react';
import { GlareHover } from '../ui/GlareHover';
import { useAppContext } from '../../context/AppContext';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../contexts/LanguageContext';

export const TopWelcomeBar = () => {
  const { t } = useLanguage();
  const { isDarkMode, themeStyles, dailyBriefing, handleGenerateDailyBriefing } = useAppContext();
  const { user, role } = useSelector((state) => state.auth);
  const firstName = user?.full_name?.split(' ')[0] || 'User';
  const showDailyBriefing = role === 'student';

  return (
    <GlareHover
      glareColor={isDarkMode ? "#ffffff" : "#3f37b3"}
      glareOpacity={0.15}
      className={`${themeStyles.card} flex flex-col mb-8 p-6 rounded-2xl transition-all duration-500 gap-6`}
    >
      <div className="flex justify-between items-center w-full relative z-10">
        <div>
          <h1 className={`text-2xl font-bold font-sora ${themeStyles.textMain}`}>
            {t('welcomeBack')}, {firstName}!
          </h1>
          <p className={`mt-1 ${themeStyles.textMuted}`}>{t('learningProgressToday')}</p>
        </div>
        <div className={`p-3 rounded-xl flex items-center border ${isDarkMode ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-100'}`}>
          <Award className={`w-8 h-8 mr-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>{t('nextMilestone')}</p>
            <p className={`text-xs ${isDarkMode ? 'text-yellow-500/80' : 'text-yellow-600'}`}>Complete React Project</p>
          </div>
        </div>
      </div>

      {/* AI Daily Briefing Banner — students only */}
      {showDailyBriefing && (
        <div className={`pt-6 border-t ${themeStyles.borderSoft} relative z-20 w-full`}>
          {!dailyBriefing.text && !dailyBriefing.loading ? (
            <button
              onClick={handleGenerateDailyBriefing}
              className={`w-full flex items-center justify-center p-4 rounded-xl shadow-sm transition-all font-medium ${isDarkMode ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30' : 'bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 border border-indigo-100'}`}
            >
              <Zap className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" />
              ✨ {t('generateAIDailyFocus')}
            </button>
          ) : (
            <div className={`p-5 rounded-xl shadow-md flex flex-col sm:flex-row gap-4 items-start sm:items-center ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/60 to-blue-900/60 border border-indigo-500/30 text-white' : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'}`}>
              <div className="bg-[var(--color-surface)]/20 p-3 rounded-full shrink-0">
                <Zap className="w-6 h-6 text-yellow-300" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{t('yourDailyFocus')}</h3>
                {dailyBriefing.loading ? (
                  <div className="flex space-x-2 py-2">
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <p className="text-indigo-50 leading-relaxed text-sm font-medium">{dailyBriefing.text}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </GlareHover>
  );
};

