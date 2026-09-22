import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const BUDGETABLE_CATEGORIES = [
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
  'Other Expense',
];

export const BudgetModal = ({
  isOpen,
  onClose,
  budgetToEdit = null,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [category, setCategory] = useState(BUDGETABLE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category || BUDGETABLE_CATEGORIES[0]);
      setAmount(budgetToEdit.amount ? budgetToEdit.amount.toString() : '');
    } else {
      setCategory(BUDGETABLE_CATEGORIES[0]);
      setAmount('');
    }
  }, [budgetToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showToast('Please enter a valid monthly budget limit.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (budgetToEdit) {
        const id = budgetToEdit._id || budgetToEdit.id;
        await api.put(`/budgets/${id}`, { amount: Number(amount), category });
        showToast('Budget limit updated.', 'success');
      } else {
        await api.post('/budgets', { amount: Number(amount), category });
        showToast('Monthly budget created.', 'success');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Modify Budget Limit' : 'Set Category Budget'}
      subtitle="Establish monthly spending guardrails to optimize savings."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block mb-1.5">
            Spending Category
          </label>
          <select
            disabled={!!budgetToEdit}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:opacity-60"
          >
            {BUDGETABLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block mb-1.5">
            Monthly Limit (₹ INR)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm font-bold text-slate-400 dark:text-slate-500">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="1"
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-base font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {budgetToEdit ? 'Update Budget' : 'Establish Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
