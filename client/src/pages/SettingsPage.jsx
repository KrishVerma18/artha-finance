import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Languages,
  DollarSign,
  User,
  Lock,
  Sparkles,
  CheckCircle2,
  Database,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import api from '../services/api';

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, languages, t } = useI18n();
  const { user, updateProfile, seedDemoData, logout } = useAuth();
  const { showToast } = useToast();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Demo loading state
  const [isSeeding, setIsSeeding] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateProfile({ name, currency, preferredLanguage: language, preferredTheme: theme });
    setIsSavingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      showToast('Password updated securely.', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLoadDemo = async () => {
    setIsSeeding(true);
    await seedDemoData();
    setIsSeeding(false);
  };

  return (
    <div className="max-w-4xl space-y-10 pb-16 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Section 1: Visual Theme Mode (Tri-mode) */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('settings.appearance')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('settings.themeDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Sun className="w-5 h-5 text-amber-500" />
              {theme === 'light' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t('settings.light')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Crisp daylight surfaces with dark readable text
            </p>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Moon className="w-5 h-5 text-emerald-400" />
              {theme === 'dark' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t('settings.dark')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Deep obsidian tones with audited WCAG contrast
            </p>
          </button>

          {/* System Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'system'
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Laptop className="w-5 h-5 text-slate-400" />
              {theme === 'system' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t('settings.system')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Syncs seamlessly with your OS preference
            </p>
          </button>
        </div>
      </section>

      {/* Section 2: Internationalization (5 Indian Languages) */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('settings.language')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('settings.languageDescription')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                language === l.code
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <p className="text-sm font-bold">{l.native}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{l.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Section 3: Profile & Regional Currency */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('settings.account')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update your identity and display preferences
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
          <Input
            label={t('auth.fullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block mb-1.5">
              {t('settings.currency')}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            >
              <option value="INR">₹ INR (Indian Rupee - Default)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
              <option value="GBP">£ GBP (British Pound)</option>
            </select>
          </div>

          <Button type="submit" variant="primary" isLoading={isSavingProfile}>
            {t('settings.save')}
          </Button>
        </form>
      </section>

      {/* Section 4: Security & Password */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('settings.security')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep your credentials updated and protected
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimum 6 characters with mixed characters recommended."
          />
          <Button type="submit" variant="outline" isLoading={isUpdatingPassword}>
            {t('settings.changePassword')}
          </Button>
        </form>
      </section>

      {/* Section 5: Demo Dataset Manager */}
      <section className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('settings.demoData')}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-lg leading-relaxed">
              {t('settings.demoDescription')} This populates 20+ realistic transactions (Salary, Swiggy, Indiranagar Rent, Mutual Fund SIP, Fuel) and category budgets.
            </p>
          </div>
        </div>

        <Button
          onClick={handleLoadDemo}
          variant="primary"
          icon={RefreshCw}
          isLoading={isSeeding}
        >
          {t('settings.loadDemo')}
        </Button>
      </section>

      {/* Section 6: Session Management */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Active Session
          </p>
          <p className="text-[11px] text-slate-400">
            Signed in as {user?.email || user?.mobile}
          </p>
        </div>
        <Button onClick={logout} variant="danger" size="sm" icon={LogOut}>
          {t('nav.logout')}
        </Button>
      </div>
    </div>
  );
};
