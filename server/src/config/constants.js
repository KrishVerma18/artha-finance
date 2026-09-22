export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const EXPENSE_CATEGORIES = [
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

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance & Consulting',
  'Investments & Dividends',
  'Business',
  'Rental Income',
  'Gifts & Grants',
  'Other Income',
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'kn', 'ta', 'te'];
export const SUPPORTED_THEMES = ['light', 'dark', 'system'];
export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

export const BUDGET_STATUS = {
  WITHIN: 'Within budget',
  NEAR_LIMIT: 'Near limit',
  OVER_BUDGET: 'Over budget',
};
