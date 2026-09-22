import { TransactionModel } from '../models/Transaction.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'newest',
      page = 1,
      limit = 15,
    } = req.query;

    const filter = { userId: req.userId };

    if (type && (type === 'income' || type === 'expense')) {
      filter.type = type;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate).toISOString();
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end.toISOString();
      }
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    // Determine sort object
    let sortObj = { date: -1 };
    if (sortBy === 'oldest') sortObj = { date: 1 };
    if (sortBy === 'highest') sortObj = { amount: -1 };
    if (sortBy === 'lowest') sortObj = { amount: 1 };

    const queryRes = await TransactionModel.find(filter);
    let allMatching = queryRes.results || (Array.isArray(queryRes) ? queryRes : []);

    // Filter by text search if provided
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      allMatching = allMatching.filter((tx) =>
        (tx.description && tx.description.toLowerCase().includes(q)) ||
        (tx.category && tx.category.toLowerCase().includes(q)) ||
        (tx.notes && tx.notes.toLowerCase().includes(q))
      );
    }

    // Apply sorting
    allMatching.sort((a, b) => {
      const [field, order] = Object.entries(sortObj)[0];
      let valA = a[field];
      let valB = b[field];
      if (field === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return order === 1 ? -1 : 1;
      if (valA > valB) return order === 1 ? 1 : -1;
      return 0;
    });

    const totalCount = allMatching.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allMatching.slice(startIndex, startIndex + limitNum);

    return sendSuccess(res, {
      message: 'Transactions retrieved successfully.',
      data: {
        transactions: paginated,
      },
      meta: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, date, description, notes } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return sendError(res, { message: 'Amount must be a positive financial value.', status: 400 });
    }

    if (!type || !['income', 'expense'].includes(type)) {
      return sendError(res, { message: 'Transaction type must be income or expense.', status: 400 });
    }

    if (!category || !category.trim()) {
      return sendError(res, { message: 'Transaction category is required.', status: 400 });
    }

    if (!description || !description.trim()) {
      return sendError(res, { message: 'Description is required.', status: 400 });
    }

    const newTx = await TransactionModel.create({
      userId: req.userId,
      amount: Number(amount),
      type,
      category: category.trim(),
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      description: description.trim(),
      notes: notes ? notes.trim() : '',
    });

    return sendSuccess(res, {
      message: 'Transaction recorded successfully.',
      status: 201,
      data: { transaction: newTx },
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await TransactionModel.findById(id);

    if (!tx || (tx.userId.toString() !== req.userId && tx.userId !== req.userId)) {
      return sendError(res, { message: 'Transaction not found or access denied.', status: 404 });
    }

    return sendSuccess(res, { data: { transaction: tx } });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, description, notes } = req.body;

    const tx = await TransactionModel.findById(id);
    if (!tx || (tx.userId.toString() !== req.userId && tx.userId !== req.userId)) {
      return sendError(res, { message: 'Transaction not found or access denied.', status: 404 });
    }

    const updates = {};
    if (amount !== undefined) updates.amount = Number(amount);
    if (type !== undefined) updates.type = type;
    if (category !== undefined) updates.category = category.trim();
    if (date !== undefined) updates.date = new Date(date).toISOString();
    if (description !== undefined) updates.description = description.trim();
    if (notes !== undefined) updates.notes = notes.trim();

    const updated = await TransactionModel.findByIdAndUpdate(id, updates, { new: true });

    return sendSuccess(res, {
      message: 'Transaction updated successfully.',
      data: { transaction: updated },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await TransactionModel.findById(id);

    if (!tx || (tx.userId.toString() !== req.userId && tx.userId !== req.userId)) {
      return sendError(res, { message: 'Transaction not found or access denied.', status: 404 });
    }

    await TransactionModel.findByIdAndDelete(id);

    return sendSuccess(res, { message: 'Transaction deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const exportTransactionsCsv = async (req, res, next) => {
  try {
    const { search, type, category, startDate, endDate } = req.query;

    const filter = { userId: req.userId };
    if (type && (type === 'income' || type === 'expense')) filter.type = type;
    if (category && category !== 'all') filter.category = category;

    const queryRes = await TransactionModel.find(filter);
    let transactions = queryRes.results || (Array.isArray(queryRes) ? queryRes : []);

    if (startDate || endDate) {
      transactions = transactions.filter((tx) => {
        const t = new Date(tx.date).getTime();
        if (startDate && t < new Date(startDate).getTime()) return false;
        if (endDate && t > new Date(endDate).getTime()) return false;
        return true;
      });
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      transactions = transactions.filter((tx) =>
        (tx.description && tx.description.toLowerCase().includes(q)) ||
        (tx.category && tx.category.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Build CSV formatted response
    const headers = ['Date', 'Description', 'Type', 'Category', 'Amount (INR)', 'Notes'];
    const rows = transactions.map((t) => [
      `"${new Date(t.date).toISOString().split('T')[0]}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      t.amount,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="artha-transactions-${new Date().toISOString().split('T')[0]}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
