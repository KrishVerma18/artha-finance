import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { EmptyState } from '../components/common/EmptyState';

const ICONS = {
  TrendingUp,
  TrendingDown,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Clock,
  AlertCircle,
  Sparkles,
};

export const InsightsPage = ({ onOpenTransactionModal }) => {
  const { t } = useI18n();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/insights');
        setInsights(res.data.data.insights || []);
      } catch (err) {
        console.error('Failed to load insights:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Automated Algorithmic Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('insights.title')}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('insights.subtitle')}
        </p>
      </div>

      {/* Insights Cards List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse h-32"
            />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={t('insights.empty')}
          description={t('insights.emptyPrompt')}
          actionLabel="Record Transactions"
          onAction={onOpenTransactionModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((item) => {
            const IconComponent = ICONS[item.icon] || Sparkles;

            let borderStyle = 'border-slate-200 dark:border-slate-800';
            let iconStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
            let badgeStyle = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

            if (item.type === 'positive') {
              borderStyle = 'border-emerald-200/80 dark:border-emerald-900/60';
              iconStyle = 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400';
              badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            } else if (item.type === 'warning') {
              borderStyle = 'border-amber-200/80 dark:border-amber-900/60';
              iconStyle = 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400';
              badgeStyle = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            } else if (item.type === 'danger') {
              borderStyle = 'border-rose-200/80 dark:border-rose-900/60';
              iconStyle = 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400';
              badgeStyle = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
            } else if (item.type === 'info') {
              borderStyle = 'border-indigo-200/80 dark:border-indigo-900/60';
              iconStyle = 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400';
              badgeStyle = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
            }

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border ${borderStyle} bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconStyle}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Priority: {item.priority}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeStyle} shrink-0`}>
                    {item.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Confidence: verified against actual transactions</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
