import { TransactionModel } from '../models/Transaction.js';
import { BudgetModel } from '../models/Budget.js';
import { logger } from '../utils/logger.js';

export const seedFinancialHistory = async (userId) => {
  logger.info(`Seeding comprehensive demo financial history for user ${userId}`);

  // Clear existing transactions and budgets for clean state
  await TransactionModel.deleteMany({ userId });
  await BudgetModel.deleteMany({ userId });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to create dates in current and prior months
  const d = (daysAgo) => {
    const target = new Date();
    target.setDate(target.getDate() - daysAgo);
    return target.toISOString();
  };

  const sampleTransactions = [
    // Incomes
    {
      userId,
      amount: 98000,
      type: 'income',
      category: 'Salary',
      date: d(2),
      description: 'Monthly Corporate Salary - TechCorp Systems',
      notes: 'Direct bank transfer credited to HDFC salary account',
    },
    {
      userId,
      amount: 24500,
      type: 'income',
      category: 'Freelance & Consulting',
      date: d(12),
      description: 'Fintech UI/UX Consulting Retainer',
      notes: 'Milestone 2 payout via Razorpay invoice',
    },
    {
      userId,
      amount: 4800,
      type: 'income',
      category: 'Investments & Dividends',
      date: d(18),
      description: 'Quarterly Nifty ETF & Equity Dividends',
      notes: 'Zerodha trading account credit',
    },
    {
      userId,
      amount: 98000,
      type: 'income',
      category: 'Salary',
      date: d(32),
      description: 'Previous Month Salary - TechCorp Systems',
      notes: 'Direct bank deposit',
    },

    // Expenses - Current Month
    {
      userId,
      amount: 28000,
      type: 'expense',
      category: 'Housing & Rent',
      date: d(3),
      description: 'Apartment Lease & Maintenance - Indiranagar',
      notes: 'NEFT transfer to landlord with society maintenance',
    },
    {
      userId,
      amount: 15000,
      type: 'expense',
      category: 'Investments',
      date: d(5),
      description: 'SIP Auto-Debit: Parag Parikh Flexi Cap Fund',
      notes: 'Automated NACH debit for wealth compounding',
    },
    {
      userId,
      amount: 3450,
      type: 'expense',
      category: 'Bills & Utilities',
      date: d(6),
      description: 'BESCOM Electricity Bill & Fiber Internet',
      notes: 'Paid via UPI auto-pay',
    },
    {
      userId,
      amount: 2150,
      type: 'expense',
      category: 'Food & Dining',
      date: d(4),
      description: 'Gourmet Dinner with Colleagues',
      notes: 'Toit Brewpub weekend catch-up',
    },
    {
      userId,
      amount: 4200,
      type: 'expense',
      category: 'Food & Dining',
      date: d(8),
      description: 'Nature Basket Organic Groceries & Pantry',
      notes: 'Monthly staples and dairy stock',
    },
    {
      userId,
      amount: 1250,
      type: 'expense',
      category: 'Transport',
      date: d(7),
      description: 'Shell Petrol Station Fuel Top-Up',
      notes: 'Fuel for car',
    },
    {
      userId,
      amount: 850,
      type: 'expense',
      category: 'Transport',
      date: d(10),
      description: 'Uber Rides & Namma Metro Smart Card Recharge',
      notes: 'Weekday commute',
    },
    {
      userId,
      amount: 5499,
      type: 'expense',
      category: 'Shopping',
      date: d(9),
      description: 'Ergonomic Wireless Mechanical Keyboard',
      notes: 'Amazon Great Indian Sale upgrade',
    },
    {
      userId,
      amount: 1499,
      type: 'expense',
      category: 'Entertainment',
      date: d(11),
      description: 'Netflix & Spotify Annual Family Subscription',
      notes: 'Entertainment services renew',
    },
    {
      userId,
      amount: 2600,
      type: 'expense',
      category: 'Healthcare',
      date: d(14),
      description: 'Comprehensive Annual Health Checkup & Vitamins',
      notes: 'Apollo Diagnostics wellness panel',
    },
    {
      userId,
      amount: 1800,
      type: 'expense',
      category: 'Food & Dining',
      date: d(13),
      description: 'Swiggy Gourmet Family Dinner Delivery',
      notes: 'Weekend dinner',
    },

    // Expenses - Previous Month (for trend comparison)
    {
      userId,
      amount: 28000,
      type: 'expense',
      category: 'Housing & Rent',
      date: d(33),
      description: 'Prior Month Apartment Rent',
      notes: 'Transfer to landlord',
    },
    {
      userId,
      amount: 15000,
      type: 'expense',
      category: 'Investments',
      date: d(35),
      description: 'Monthly SIP Auto-Debit',
      notes: 'Mutual fund investment',
    },
    {
      userId,
      amount: 8200,
      type: 'expense',
      category: 'Food & Dining',
      date: d(38),
      description: 'Prior Month Dining & Supermarket',
      notes: 'Household food expenses',
    },
    {
      userId,
      amount: 3200,
      type: 'expense',
      category: 'Transport',
      date: d(40),
      description: 'Commute and Fuel Expenses',
      notes: 'Monthly transport',
    },
    {
      userId,
      amount: 4100,
      type: 'expense',
      category: 'Bills & Utilities',
      date: d(42),
      description: 'Utility bills & gas connection',
      notes: 'Monthly utility bills',
    },
  ];

  for (const tx of sampleTransactions) {
    await TransactionModel.create(tx);
  }

  // Sample Budgets with realistic monthly caps
  const sampleBudgets = [
    {
      userId,
      category: 'Food & Dining',
      amount: 12000,
      period: 'monthly',
      month: currentMonth + 1,
      year: currentYear,
    },
    {
      userId,
      category: 'Transport',
      amount: 4500,
      period: 'monthly',
      month: currentMonth + 1,
      year: currentYear,
    },
    {
      userId,
      category: 'Housing & Rent',
      amount: 30000,
      period: 'monthly',
      month: currentMonth + 1,
      year: currentYear,
    },
    {
      userId,
      category: 'Shopping',
      amount: 8000,
      period: 'monthly',
      month: currentMonth + 1,
      year: currentYear,
    },
    {
      userId,
      category: 'Bills & Utilities',
      amount: 5000,
      period: 'monthly',
      month: currentMonth + 1,
      year: currentYear,
    },
    {
      userId,
      category: 'Entertainment',
      amount: 3500,
      period: 'monthly',
      month: currentMonth + 1,
      year: currentYear,
    },
  ];

  for (const b of sampleBudgets) {
    await BudgetModel.create(b);
  }

  logger.info(`Successfully seeded ${sampleTransactions.length} transactions and ${sampleBudgets.length} budgets.`);
  return { transactionCount: sampleTransactions.length, budgetCount: sampleBudgets.length };
};
