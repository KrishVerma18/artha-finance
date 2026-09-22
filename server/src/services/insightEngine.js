import { TransactionModel } from '../models/Transaction.js';
import { BudgetModel } from '../models/Budget.js';

export const generateSmartInsights = async (userId) => {
  const allTxCursor = await TransactionModel.find({ userId });
  const transactions = allTxCursor.results || (Array.isArray(allTxCursor) ? allTxCursor : []);

  if (transactions.length < 2) {
    return [
      {
        id: 'onboarding',
        type: 'info',
        title: 'Start Tracking Your Wealth',
        description: 'Add your recent income and regular expenses to unlock automated spending velocity analysis, budget warnings, and savings optimization.',
        metric: '0 transactions analyzed',
        icon: 'Sparkles',
        priority: 'high',
      },
    ];
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  let thisMonthIncome = 0;
  let thisMonthExpense = 0;
  let lastMonthExpense = 0;
  const categoryExpenses = {};

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const m = txDate.getMonth();
    const y = txDate.getFullYear();

    if (m === currentMonth && y === currentYear) {
      if (tx.type === 'income') {
        thisMonthIncome += Number(tx.amount);
      } else {
        thisMonthExpense += Number(tx.amount);
        categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + Number(tx.amount);
      }
    } else if (m === lastMonth && y === lastMonthYear) {
      if (tx.type === 'expense') {
        lastMonthExpense += Number(tx.amount);
      }
    }
  });

  const insights = [];

  // 1. Month-over-Month Spending Velocity
  if (lastMonthExpense > 0 && thisMonthExpense > 0) {
    const delta = ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
    const isHigher = delta > 0;
    const absDelta = Math.abs(Math.round(delta));

    insights.push({
      id: 'mom-trend',
      type: isHigher ? (absDelta > 20 ? 'warning' : 'neutral') : 'positive',
      title: isHigher ? 'Higher Spending Velocity' : 'Reduced Spending Pace',
      description: isHigher
        ? `You have spent ${absDelta}% more this month compared to the same period last month. Review discretionary expenses to maintain your target savings.`
        : `Great financial discipline! Your expenses are ${absDelta}% lower than last month at this stage.`,
      metric: `${isHigher ? '+' : '-'}${absDelta}% MoM`,
      icon: isHigher ? 'TrendingUp' : 'TrendingDown',
      priority: absDelta > 25 ? 'high' : 'medium',
    });
  }

  // 2. Largest Expense Category
  const sortedCategories = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0 && thisMonthExpense > 0) {
    const [topCat, topAmount] = sortedCategories[0];
    const percentage = Math.round((topAmount / thisMonthExpense) * 100);

    insights.push({
      id: 'top-category',
      type: 'info',
      title: `Top Expense Driver: ${topCat}`,
      description: `${topCat} accounts for ${percentage}% of your total outflow this month. Keeping tabs on this category will have the highest impact on your net savings.`,
      metric: `${percentage}% of total outflow`,
      icon: 'PieChart',
      priority: percentage > 40 ? 'high' : 'medium',
    });
  }

  // 3. Savings Rate Analysis
  if (thisMonthIncome > 0) {
    const netSavings = thisMonthIncome - thisMonthExpense;
    const savingsRate = Math.round((netSavings / thisMonthIncome) * 100);

    if (netSavings < 0) {
      insights.push({
        id: 'negative-savings',
        type: 'danger',
        title: 'Cash Outflow Exceeds Inflow',
        description: 'Your total expenses have surpassed your income for this period. Consider deferring non-essential purchases to preserve liquidity.',
        metric: `₹${Math.abs(Math.round(netSavings)).toLocaleString('en-IN')} deficit`,
        icon: 'AlertTriangle',
        priority: 'high',
      });
    } else {
      const isStrong = savingsRate >= 20;
      insights.push({
        id: 'savings-rate',
        type: isStrong ? 'positive' : 'neutral',
        title: isStrong ? 'Strong Financial Runway' : 'Moderate Savings Rate',
        description: isStrong
          ? `You have preserved ${savingsRate}% of your total earnings this month, surpassing the recommended 20% benchmark.`
          : `You are saving ${savingsRate}% of your income. Aiming for a 20% savings buffer will accelerate your emergency fund.`,
        metric: `${savingsRate}% saved`,
        icon: 'ShieldCheck',
        priority: 'medium',
      });
    }
  }

  // 4. Budget Alerts
  const budgetCursor = await BudgetModel.find({ userId });
  const budgets = budgetCursor.results || (Array.isArray(budgetCursor) ? budgetCursor : []);

  for (const b of budgets) {
    const spent = categoryExpenses[b.category] || 0;
    const utilization = (spent / b.amount) * 100;

    if (utilization >= 100) {
      insights.push({
        id: `budget-over-${b.category}`,
        type: 'danger',
        title: `Budget Exceeded: ${b.category}`,
        description: `You have crossed 100% of your allocated limit for ${b.category} (spent ₹${Math.round(spent).toLocaleString('en-IN')} of ₹${Number(b.amount).toLocaleString('en-IN')}).`,
        metric: `${Math.round(utilization)}% used`,
        icon: 'AlertCircle',
        priority: 'high',
      });
    } else if (utilization >= 80) {
      insights.push({
        id: `budget-near-${b.category}`,
        type: 'warning',
        title: `Approaching Budget Limit: ${b.category}`,
        description: `You have consumed ${Math.round(utilization)}% of your ₹${Number(b.amount).toLocaleString('en-IN')} budget for ${b.category}. Only ₹${Math.round(b.amount - spent).toLocaleString('en-IN')} remaining.`,
        metric: `${Math.round(utilization)}% used`,
        icon: 'Clock',
        priority: 'medium',
      });
    }
  }

  return insights;
};
