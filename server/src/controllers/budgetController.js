import { BudgetModel } from '../models/Budget.js';
import { TransactionModel } from '../models/Transaction.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { BUDGET_STATUS } from '../config/constants.js';

export const getBudgets = async (req, res, next) => {
  try {
    const budgetCursor = await BudgetModel.find({ userId: req.userId });
    const budgets = budgetCursor.results || (Array.isArray(budgetCursor) ? budgetCursor : []);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Fetch transactions for current month to compute live spending
    const txCursor = await TransactionModel.find({ userId: req.userId, type: 'expense' });
    const expenses = txCursor.results || (Array.isArray(txCursor) ? txCursor : []);

    const spendingByCategory = {};
    expenses.forEach((tx) => {
      const d = new Date(tx.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        spendingByCategory[tx.category] = (spendingByCategory[tx.category] || 0) + Number(tx.amount);
      }
    });

    const populatedBudgets = budgets.map((b) => {
      const spent = spendingByCategory[b.category] || 0;
      const amount = Number(b.amount);
      const remaining = Math.max(0, amount - spent);
      const percentageUsed = amount > 0 ? Math.min(100, Math.round((spent / amount) * 100)) : 0;
      const actualPercentage = amount > 0 ? Math.round((spent / amount) * 100) : 0;

      let status = BUDGET_STATUS.WITHIN;
      if (actualPercentage >= 100) {
        status = BUDGET_STATUS.OVER_BUDGET;
      } else if (actualPercentage >= 80) {
        status = BUDGET_STATUS.NEAR_LIMIT;
      }

      return {
        _id: b._id || b.id,
        id: b._id || b.id,
        category: b.category,
        amount,
        spentAmount: Math.round(spent),
        remainingAmount: Math.round(remaining),
        percentageUsed,
        actualPercentage,
        status,
        period: b.period || 'monthly',
        month: b.month || currentMonth + 1,
        year: b.year || currentYear,
      };
    });

    return sendSuccess(res, {
      message: 'Budgets retrieved successfully.',
      data: {
        budgets: populatedBudgets,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createBudget = async (req, res, next) => {
  try {
    const { category, amount, period = 'monthly' } = req.body;

    if (!category || !category.trim()) {
      return sendError(res, { message: 'Category is required for budgeting.', status: 400 });
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return sendError(res, { message: 'Budget limit amount must be a positive number.', status: 400 });
    }

    const now = new Date();
    const existing = await BudgetModel.findOne({
      userId: req.userId,
      category: category.trim(),
    });

    if (existing) {
      return sendError(res, {
        message: `A budget for category "${category}" already exists. You can edit the existing budget limit instead.`,
        status: 409,
      });
    }

    const newBudget = await BudgetModel.create({
      userId: req.userId,
      category: category.trim(),
      amount: Number(amount),
      period,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    return sendSuccess(res, {
      message: 'Budget limit allocated successfully.',
      status: 201,
      data: { budget: newBudget },
    });
  } catch (err) {
    next(err);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, category } = req.body;

    const b = await BudgetModel.findById(id);
    if (!b || (b.userId.toString() !== req.userId && b.userId !== req.userId)) {
      return sendError(res, { message: 'Budget record not found or access denied.', status: 404 });
    }

    const updates = {};
    if (amount !== undefined) updates.amount = Number(amount);
    if (category !== undefined) updates.category = category.trim();

    const updated = await BudgetModel.findByIdAndUpdate(id, updates, { new: true });

    return sendSuccess(res, {
      message: 'Budget limit updated successfully.',
      data: { budget: updated },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const b = await BudgetModel.findById(id);

    if (!b || (b.userId.toString() !== req.userId && b.userId !== req.userId)) {
      return sendError(res, { message: 'Budget record not found or access denied.', status: 404 });
    }

    await BudgetModel.findByIdAndDelete(id);

    return sendSuccess(res, { message: 'Budget record deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
