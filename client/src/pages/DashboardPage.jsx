import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart as PieIcon,
  Calendar,
  AlertTriangle,
  Receipt,
  ChevronRight,
  ShieldCheck,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, formatRelativeTime, getCategoryColor } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { StatCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const DashboardPage = ({ onOpenTransactionModal }) => {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const { seedDemoData } = useAuth();

  const [period, setPeriod] = useState('this_month');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/dashboard/summary?period=${period}`);
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  const handleSeedFromDashboard = async () => {
    setIsSeeding(true);
    await seedDemoData();
    await fetchDashboardData();
    setIsSeeding(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const metrics = data?.metrics || {
    totalBalance: 0,
    periodIncome: 0,
    periodExpense: 0,
    netSavings: 0,
    savingsRate: 0,
    transactionCount: 0,
  };

  const expenseByCategory = data?.expenseByCategory || [];
  const incomeVsExpenseTrend = data?.incomeVsExpenseTrend || [];
  const recentTransactions = data?.recentTransactions || [];
  const topInsights = data?.topInsights || [];

  const timeFilterOptions = [
    { key: 'this_week', label: t('dashboard.timeFilters.week') },
    { key: 'this_month', label: t('dashboard.timeFilters.month') },
    { key: 'last_month', label: t('dashboard.timeFilters.lastMonth') },
    { key: 'last_3_months', label: t('dashboard.timeFilters.quarter') },
    { key: 'this_year', label: t('dashboard.timeFilters.year') },
  ];

  // Chart styling tokens based on active theme
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Page Header & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
          {timeFilterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setPeriod(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                period === opt.key
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zero State Quick Demo Helper Banner */}
      {!isLoading && metrics.transactionCount === 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                Ledger is currently empty (₹0)
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                Load 20+ realistic transactions (Corporate Salary, Indiranagar Rent, Parag Parikh SIP, Swiggy) and category budgets with 1 click to test charts and analytics.
              </p>
            </div>
          </div>
          <Button
            onClick={handleSeedFromDashboard}
            isLoading={isSeeding}
            size="sm"
            className="shrink-0"
            icon={Sparkles}
          >
            Load Sample History
          </Button>
        </div>
      )}

      {/* 4 Financial Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Balance */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('dashboard.totalBalance')}
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {formatCurrency(metrics.totalBalance)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Unified Net Liquidity
              </p>
            </div>
          </div>

          {/* Card 2: Period Income */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('dashboard.monthlyIncome')}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {formatCurrency(metrics.periodIncome)}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Recorded Cash Inflow</span>
              </p>
            </div>
          </div>

          {/* Card 3: Period Expenses */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('dashboard.monthlyExpenses')}
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
                {formatCurrency(metrics.periodExpense)}
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Total Expenditure Outflow</span>
              </p>
            </div>
          </div>

          {/* Card 4: Net Savings */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('dashboard.netSavings')}
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <PiggyBank className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  metrics.netSavings >= 0
                    ? 'text-slate-900 dark:text-white'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatCurrency(metrics.netSavings)}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {metrics.savingsRate}% {t('dashboard.savingsRate')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Visualizations: Trend Chart & Expense Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Trend Area Chart (Span 2) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('dashboard.incomeVsExpense')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Historical monthly cash flow comparison
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={incomeVsExpenseTrend}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke={textColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                />
                <YAxis
                  stroke={textColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1">
                            {label}
                          </p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Income: {formatCurrency(payload[0]?.value)}
                          </p>
                          <p className="text-rose-500 font-semibold">
                            Expense: {formatCurrency(payload[1]?.value)}
                          </p>
                          <p className="text-indigo-500 font-bold pt-1 border-t border-slate-100 dark:border-slate-700">
                            Net: {formatCurrency((payload[0]?.value || 0) - (payload[1]?.value || 0))}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution Donut Chart (Span 1) */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('dashboard.expenseDistribution')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown by category for current period
            </p>
          </div>

          {expenseByCategory.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No expenses recorded for this timeframe.
            </div>
          ) : (
            <>
              <div className="h-52 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="amount"
                    >
                      {expenseByCategory.map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={getCategoryColor(entry.category)}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [formatCurrency(val), 'Spent']}
                      contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top 3 Category Breakdown List */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {expenseByCategory.slice(0, 3).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: getCategoryColor(cat.category) }}
                      />
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {cat.category}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white shrink-0">
                      {formatCurrency(cat.amount)} ({cat.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Smart Insights & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Fintech Insights (Span 1) */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('dashboard.quickInsights')}
              </h2>
            </div>
            <Link
              to="/insights"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
            >
              All insights <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topInsights.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Add transactions to unlock algorithmic financial insights.
              </p>
            ) : (
              topInsights.map((insight) => {
                let badgeClass = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                if (insight.type === 'positive') badgeClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                if (insight.type === 'warning') badgeClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                if (insight.type === 'danger') badgeClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';

                return (
                  <div
                    key={insight.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {insight.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                        {insight.metric}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Transactions Table / List (Span 2) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('dashboard.recentTransactions')}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenTransactionModal}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
              <Link
                to="/transactions"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center"
              >
                {t('dashboard.viewAll')} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No recent transactions"
              description="Record your first income or expense to populate your live financial ledger."
              actionLabel={t('dashboard.addTransaction')}
              onAction={onOpenTransactionModal}
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentTransactions.map((tx) => (
                <div
                  key={tx._id || tx.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                      style={{
                        backgroundColor: `${getCategoryColor(tx.category)}18`,
                        color: getCategoryColor(tx.category),
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(tx.date)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs font-extrabold ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
