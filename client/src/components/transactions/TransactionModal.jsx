import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useToast } from '../../context/ToastContext';
import { useI18n } from '../../context/I18nContext';
import api from '../../services/api';

const EXPENSE_CATEGORIES = [
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

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance & Consulting',
  'Investments & Dividends',
  'Business',
  'Rental Income',
  'Gifts & Grants',
  'Other Income',
];

export const TransactionModal = ({
  isOpen,
  onClose,
  transactionToEdit = null,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const { t } = useI18n();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type || 'expense');
      setAmount(transactionToEdit.amount ? transactionToEdit.amount.toString() : '');
      setCategory(transactionToEdit.category || EXPENSE_CATEGORIES[0]);
      setDate(
        transactionToEdit.date
          ? new Date(transactionToEdit.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setDescription(transactionToEdit.description || '');
      setNotes(transactionToEdit.notes || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setNotes('');
    }
  }, [transactionToEdit, isOpen]);

  // When type changes, ensure valid default category
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showToast('Please enter a valid positive financial amount.', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Please provide a description or merchant name.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        type,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        description: description.trim(),
        notes: notes.trim(),
      };

      if (transactionToEdit) {
        const id = transactionToEdit._id || transactionToEdit.id;
        await api.put(`/transactions/${id}`, payload);
        showToast('Transaction updated successfully.', 'success');
      } else {
        await api.post('/transactions', payload);
        showToast('Transaction recorded successfully.', 'success');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : t('dashboard.addTransaction')}
      subtitle="Record and categorize your cash flow movement."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Income / Expense Toggle Switch */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Income (+)
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block mb-1.5">
            Amount (₹ INR)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm font-bold text-slate-400 dark:text-slate-500">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              placeholder="e.g. 2500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-base font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              required
            />
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <Input
          label="Transaction Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Description Input */}
        <Input
          label="Description / Merchant"
          placeholder="e.g. Groceries at Nature Basket, Monthly Rent"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Notes Input */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide block mb-1.5">
            Optional Notes / Receipt Reference
          </label>
          <textarea
            rows={2}
            placeholder="Additional context or invoice reference..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {transactionToEdit ? 'Update Transaction' : 'Save Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
