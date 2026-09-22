import { TransactionModel } from '../models/Transaction.js';
import { BudgetModel } from '../models/Budget.js';
import { generateSmartInsights } from '../services/insightEngine.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const { period = 'this_month', startDate, endDate } = req.query;

    const allTxCursor = await TransactionModel.find({ userId: req.userId });
    const allTransactions = allTxCursor.results || (Array.isArray(allTxCursor) ? allTxCursor : []);

    const now = new Date();
    let filterStart = new Date(0);
    let filterEnd = new Date(now.getFullYear() + 10, 0, 1);

    if (period === 'this_week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      filterStart = new Date(now.setDate(diff));
      filterStart.setHours(0, 0, 0, 0);
      filterEnd = new Date();
    } else if (period === 'this_month') {
      filterStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filterEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'last_month') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      filterEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === 'last_3_months') {
      filterStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      filterEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'this_year') {
      filterStart = new Date(now.getFullYear(), 0, 1);
      filterEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else if (period === 'custom' && startDate && endDate) {
      filterStart = new Date(startDate);
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      filterEnd = e;
    }

    // Filter transactions by date range
    const filteredTx = allTransactions.filter((tx) => {
      const d = new Date(tx.date);
      return d >= filterStart && d <= filterEnd;
    });

    // Calculate all-time Net Worth/Balance
    let lifetimeBalance = 0;
    allTransactions.forEach((tx) => {
      if (tx.type === 'income') lifetimeBalance += Number(tx.amount);
      else lifetimeBalance -= Number(tx.amount);
    });

    // Period metrics
    let periodIncome = 0;
    let periodExpense = 0;
    const categoryTotals = {};

    filteredTx.forEach((tx) => {
      const amt = Number(tx.amount);
      if (tx.type === 'income') {
        periodIncome += amt;
      } else {
        periodExpense += amt;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
      }
    });

    const netSavings = periodIncome - periodExpense;
    const savingsRate = periodIncome > 0 ? Math.max(0, Math.round((netSavings / periodIncome) * 100)) : 0;

    // Expense by Category (Donut chart data)
    const expenseByCategory = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount),
        percentage: periodExpense > 0 ? Math.round((amount / periodExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly Trend Analysis (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendMap = {};

    // Initialize last 6 months in chronological order
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      trendMap[key] = {
        label: key,
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    allTransactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (trendMap[key]) {
        const amt = Number(tx.amount);
        if (tx.type === 'income') {
          trendMap[key].income += amt;
        } else {
          trendMap[key].expense += amt;
        }
        trendMap[key].net = trendMap[key].income - trendMap[key].expense;
      }
    });

    const incomeVsExpenseTrend = Object.values(trendMap);

    // Recent Transactions (latest 6)
    const sortedTx = [...allTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentTransactions = sortedTx.slice(0, 6);

    // Dynamic Smart Insights
    const allInsights = await generateSmartInsights(req.userId);
    const topInsights = allInsights.slice(0, 3);

    // Budgets Summary
    const budgetCursor = await BudgetModel.find({ userId: req.userId });
    const budgets = budgetCursor.results || (Array.isArray(budgetCursor) ? budgetCursor : []);

    let overBudgetCount = 0;
    let nearLimitCount = 0;

    budgets.forEach((b) => {
      const spent = categoryTotals[b.category] || 0;
      const ratio = (spent / b.amount) * 100;
      if (ratio >= 100) overBudgetCount++;
      else if (ratio >= 80) nearLimitCount++;
    });

    return sendSuccess(res, {
      message: 'Dashboard summary retrieved.',
      data: {
        metrics: {
          totalBalance: Math.round(lifetimeBalance),
          periodIncome: Math.round(periodIncome),
          periodExpense: Math.round(periodExpense),
          netSavings: Math.round(netSavings),
          savingsRate,
          transactionCount: filteredTx.length,
        },
        expenseByCategory,
        incomeVsExpenseTrend,
        recentTransactions,
        topInsights,
        budgetsSummary: {
          totalBudgets: budgets.length,
          overBudgetCount,
          nearLimitCount,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
