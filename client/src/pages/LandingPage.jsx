import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  PieChart,
  Sparkles,
  ArrowRight,
  Globe2,
  Lock,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

export const LandingPage = ({ onOpenAuth }) => {
  const { loginAsDemo, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    const res = await loginAsDemo();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
        {/* Subtle Ambient Radial Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Creator & Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-8 animate-fade-in shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('landing.badge')}</span>
          </div>

          {/* Primary Statement */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {t('landing.heroTitle1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
              {t('landing.heroTitle2')}
            </span>{' '}
            {t('landing.heroTitle3')}
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>

          {/* CTA Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate('/dashboard')}
                size="lg"
                className="w-full sm:w-auto shadow-md"
                icon={ArrowRight}
              >
                {t('landing.ctaOpenDashboard')}
              </Button>
            ) : (
              <>
                <Button
                  onClick={onOpenAuth}
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto shadow-md"
                  icon={ArrowRight}
                >
                  {t('landing.ctaCreateAccount')}
                </Button>
                <Button
                  onClick={handleDemoClick}
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto border border-slate-200 dark:border-slate-700"
                  icon={Sparkles}
                >
                  {t('landing.ctaExploreDemo')}
                </Button>
              </>
            )}
          </div>

          {/* Live Product Preview Mockup */}
          <div className="mt-16 md:mt-20 max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-4 sm:p-6 backdrop-blur-md">
            {/* Window chrome header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-slate-400">arthafinance.in/dashboard</span>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {t('landing.liveDataStream')}
              </span>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t('landing.previewNetWorth')}</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹4,82,500</p>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2 block">+14.2% overall runway</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t('landing.previewInflow')}</span>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹1,27,300</p>
                <span className="text-[11px] text-slate-500 mt-2 block">Corporate & Consulting</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t('landing.previewOutflow')}</span>
                <p className="text-2xl font-extrabold text-rose-500 mt-1">₹61,849</p>
                <span className="text-[11px] text-slate-500 mt-2 block">18 recorded expenses</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">{t('landing.previewSavings')}</span>
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">₹65,451</p>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2 block">51.4% savings rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              {t('landing.pillarsTag')}
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('landing.pillarsTitle')}
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {t('landing.pillarsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('landing.feature1Title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('landing.feature1Desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('landing.feature2Title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('landing.feature2Desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('landing.feature3Title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('landing.feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multilingual & Security Showcase */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Multi-language Highlight */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{t('landing.panIndiaTag')}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('landing.panIndiaTitle')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('landing.panIndiaDesc')}
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {['English', 'हिन्दी', 'ಕನ್ನಡ', 'தமிழ்', 'తెలుగు'].map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Bank-Grade Security Architecture */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm space-y-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('landing.securityTitle')}
              </h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.securityItem1')}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.securityItem2')}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('landing.securityItem3')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('landing.bannerTitle')}
          </h2>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            {t('landing.bannerSubtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleDemoClick}
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100 dark:bg-white dark:text-slate-950 font-bold shadow-lg"
              icon={Sparkles}
            >
              {t('landing.bannerDemoBtn')}
            </Button>
            <Button
              onClick={onOpenAuth}
              size="lg"
              className="bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-500/50"
            >
              {t('landing.bannerRegisterBtn')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
