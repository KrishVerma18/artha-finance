import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Sparkles,
  Settings,
  Plus,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { Button } from '../common/Button';

export const Sidebar = ({ onOpenTransactionModal }) => {
  const { t } = useI18n();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/transactions', label: t('nav.transactions'), icon: Receipt },
    { to: '/budgets', label: t('nav.budgets'), icon: PieChart },
    { to: '/insights', label: t('nav.insights'), icon: Sparkles },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 p-4 h-[calc(100vh-4rem)] sticky top-16 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Quick Add Button */}
        {onOpenTransactionModal && (
          <Button
            onClick={onOpenTransactionModal}
            className="w-full shadow-sm"
            icon={Plus}
          >
            {t('dashboard.addTransaction')}
          </Button>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Subtle Creator Credit */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Artha Platform
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            Crafted by <span className="font-semibold text-slate-600 dark:text-slate-300">Krish Verma</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
