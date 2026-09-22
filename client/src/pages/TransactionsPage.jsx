import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Trash2,
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { TableSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';

const ALL_CATEGORIES = [
  'All Categories',
  'Food & Dining',
  'Housing & Rent',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Education',
  'Healthcare',
  'Travel',
  'Investments',
  'Salary',
  'Freelance & Consulting',
  'Investments & Dividends',
  'Other Expense',
  'Other Income',
];

export const TransactionsPage = () => {
  const { t } = useI18n();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (typeFilter) params.append('type', typeFilter);
      if (categoryFilter && categoryFilter !== 'All Categories') {
        params.append('category', categoryFilter);
      }
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('sortBy', sortBy);
      params.append('page', page);
      params.append('limit', 15);

      const res = await api.get(`/transactions?${params.toString()}`);
      setTransactions(res.data.data.transactions);
      if (res.data.meta) setMeta(res.data.meta);
    } catch (err) {
      showToast('Failed to load transactions.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, typeFilter, categoryFilter, sortBy, startDate, endDate, page, showToast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (typeFilter) params.append('type', typeFilter);
    if (categoryFilter && categoryFilter !== 'All Categories') {
      params.append('category', categoryFilter);
    }
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    window.open(`/api/transactions/export?${params.toString()}`, '_blank');
    showToast('Exporting filtered transactions as CSV...', 'info');
  };

  const handleOpenEdit = (tx) => {
    setSelectedTx(tx);
    setModalOpen(true);
  };

  const handleOpenDelete = (tx) => {
    setTxToDelete(tx);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!txToDelete) return;
    setIsDeleting(true);
    try {
      const id = txToDelete._id || txToDelete.id;
      await api.delete(`/transactions/${id}`);
      showToast('Transaction removed successfully.', 'success');
      setDeleteModalOpen(false);
      setTxToDelete(null);
      fetchTransactions();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('transactions.title')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('transactions.subtitle')} ({meta.total} records)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportCsv}
            variant="outline"
            size="md"
            icon={Download}
          >
            {t('transactions.export')}
          </Button>
          <Button
            onClick={() => {
              setSelectedTx(null);
              setModalOpen(true);
            }}
            variant="primary"
            size="md"
            icon={Plus}
          >
            {t('transactions.add')}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input (Span 2) */}
          <div className="sm:col-span-2 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder={t('transactions.searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">{t('transactions.allTypes')}</option>
            <option value="expense">{t('transactions.expense')}</option>
            <option value="income">{t('transactions.income')}</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="newest">{t('transactions.newest')}</option>
            <option value="oldest">{t('transactions.oldest')}</option>
            <option value="highest">{t('transactions.highest')}</option>
            <option value="lowest">{t('transactions.lowest')}</option>
          </select>
        </div>
      </div>

      {/* Desktop Financial Data Table */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={t('transactions.empty')}
          description={t('transactions.emptyPrompt')}
          actionLabel={t('transactions.add')}
          onAction={() => {
            setSelectedTx(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3.5 px-5">{t('transactions.table.date')}</th>
                  <th className="py-3.5 px-5">{t('transactions.table.description')}</th>
                  <th className="py-3.5 px-5">{t('transactions.table.category')}</th>
                  <th className="py-3.5 px-5">{t('transactions.table.type')}</th>
                  <th className="py-3.5 px-5 text-right">{t('transactions.table.amount')}</th>
                  <th className="py-3.5 px-5 text-right">{t('transactions.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {transactions.map((tx) => (
                  <tr
                    key={tx._id || tx.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-5 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {tx.description}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {tx.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                        style={{
                          backgroundColor: `${getCategoryColor(tx.category)}15`,
                          color: getCategoryColor(tx.category),
                          borderColor: `${getCategoryColor(tx.category)}30`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: getCategoryColor(tx.category) }}
                        />
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-500'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                        {tx.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-right font-extrabold text-sm">
                      <span
                        className={
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(tx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => (
              <div
                key={tx._id || tx.id}
                className="p-4 flex flex-col gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {tx.description}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-extrabold ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                      style={{
                        backgroundColor: `${getCategoryColor(tx.category)}15`,
                        color: getCategoryColor(tx.category),
                        borderColor: `${getCategoryColor(tx.category)}30`,
                      }}
                    >
                      {tx.category}
                    </span>
                  </div>
                </div>

                {tx.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "{tx.notes}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenEdit(tx)}
                    className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleOpenDelete(tx)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page <= 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={meta.page >= meta.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        transactionToEdit={selectedTx}
        onSuccess={fetchTransactions}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction Record"
        message={`Are you sure you want to delete "${txToDelete?.description}" for ${formatCurrency(txToDelete?.amount)}? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};
