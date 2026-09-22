import React, { useState, useEffect, useCallback } from 'react';
import {
  PieChart,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';

export const BudgetsPage = () => {
  const { t } = useI18n();
  const { showToast } = useToast();

  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/budgets');
      setBudgets(res.data.data.budgets);
    } catch (err) {
      showToast('Failed to load category budgets.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleOpenEdit = (b) => {
    setSelectedBudget(b);
    setModalOpen(true);
  };

  const handleOpenDelete = (b) => {
    setBudgetToDelete(b);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!budgetToDelete) return;
    setIsDeleting(true);
    try {
      const id = budgetToDelete._id || budgetToDelete.id;
      await api.delete(`/budgets/${id}`);
      showToast('Budget limit removed.', 'success');
      setDeleteModalOpen(false);
      setBudgetToDelete(null);
      fetchBudgets();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Overall calculations across all category budgets
  const totalBudgeted = budgets.reduce((acc, b) => acc + Number(b.amount), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spentAmount), 0);
  const overallPercentage = totalBudgeted > 0 ? Math.min(100, Math.round((totalSpent / totalBudgeted) * 100)) : 0;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('budgets.title')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('budgets.subtitle')}
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedBudget(null);
            setModalOpen(true);
          }}
          variant="primary"
          size="md"
          icon={Plus}
        >
          {t('budgets.setBudget')}
        </Button>
      </div>

      {/* Aggregate Budget Summary Banner */}
      {budgets.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Consolidated Monthly Spending Cap
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatCurrency(Math.max(0, totalBudgeted - totalSpent))} remaining
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {overallPercentage}% consumed
              </p>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage >= 100
                  ? 'bg-rose-500'
                  : overallPercentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* Category Budgets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse h-48"
            />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title={t('budgets.empty')}
          description={t('budgets.emptyPrompt')}
          actionLabel={t('budgets.setBudget')}
          onAction={() => {
            setSelectedBudget(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const isOver = b.actualPercentage >= 100;
            const isNear = b.actualPercentage >= 80 && !isOver;

            let badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            let barColor = 'bg-emerald-500';
            let StatusIcon = CheckCircle2;

            if (isOver) {
              badgeStyle = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
              barColor = 'bg-rose-500';
              StatusIcon = AlertCircle;
            } else if (isNear) {
              badgeStyle = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
              barColor = 'bg-amber-500';
              StatusIcon = AlertTriangle;
            }

            return (
              <div
                key={b._id || b.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: getCategoryColor(b.category) }}
                    />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {b.category}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{b.status}</span>
                  </span>
                </div>

                {/* Progress Metric Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Spent: <strong className="text-slate-900 dark:text-white">{formatCurrency(b.spentAmount)}</strong>
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {b.actualPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Limit: {formatCurrency(b.amount)}</span>
                    <span className={isOver ? 'text-rose-500 font-semibold' : 'text-slate-500'}>
                      {isOver
                        ? `Over by ${formatCurrency(b.spentAmount - b.amount)}`
                        : `${formatCurrency(b.remainingAmount)} left`}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit budget limit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(b)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        budgetToEdit={selectedBudget}
        onSuccess={fetchBudgets}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Category Budget"
        message={`Are you sure you want to remove the budget cap for "${budgetToDelete?.category}"?`}
        isLoading={isDeleting}
      />
    </div>
  );
};
