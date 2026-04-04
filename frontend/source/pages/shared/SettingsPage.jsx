import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Globe, Moon, Sun, Check, Laptop } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { setTheme } from '../../store/slices/uiSlice';
import { applyTheme } from '../../utils/applyTheme';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export default function SettingsPage() {
  const { language: currentLang, changeLanguage, t } = useLanguage();
  const { theme } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
    applyTheme(newTheme);
    localStorage.setItem('ssllm_theme', newTheme);
    toast.success(t('preferencesUpdated'));
  };

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    toast.success(t('preferencesUpdated'));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-bold font-sora text-[var(--color-text-primary)] mb-2">
            {t('settings')}
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Manage your account preferences and application settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Language Settings */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                <Globe size={24} />
              </div>
              <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">
                {t('language')}
              </h2>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              {t('selectLanguage')}
            </p>

            <div className="space-y-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${
                    currentLang === lang.code
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className={`font-medium ${currentLang === lang.code ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                      {lang.name}
                    </span>
                  </div>
                  {currentLang === lang.code && (
                    <Check size={18} className="text-[var(--color-primary)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                <Moon size={24} />
              </div>
              <h2 className="text-xl font-bold font-sora text-[var(--color-text-primary)]">
                {t('theme')}
              </h2>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Customize the application's appearance to your preference.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                  theme === 'light'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun size={20} className={theme === 'light' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                  <span className={`font-medium ${theme === 'light' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                    {t('lightMode')}
                  </span>
                </div>
                {theme === 'light' && <Check size={18} className="text-[var(--color-primary)]" />}
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon size={20} className={theme === 'dark' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                    {t('darkMode')}
                  </span>
                </div>
                {theme === 'dark' && <Check size={18} className="text-[var(--color-primary)]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

