export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);

  try {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(num);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  } catch (e) {
    return `₹${num.toLocaleString('en-IN')}`;
  }
};

export const formatDate = (dateString, locale = 'en-IN') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
};

// Fintech Category color tokens & badge styles
export const CATEGORY_COLORS = {
  'Food & Dining': '#f59e0b',      // Amber
  'Housing & Rent': '#6366f1',     // Indigo
  'Transport': '#0ea5e9',          // Sky Blue
  'Shopping': '#ec4899',           // Pink
  'Bills & Utilities': '#8b5cf6',  // Violet
  'Entertainment': '#14b8a6',      // Teal
  'Education': '#3b82f6',          // Blue
  'Healthcare': '#ef4444',         // Red
  'Travel': '#f97316',             // Orange
  'Investments': '#10b981',        // Emerald
  'Salary': '#10b981',             // Emerald
  'Freelance & Consulting': '#06b6d4', // Cyan
  'Investments & Dividends': '#84cc16', // Lime
  'Business': '#6366f1',           // Indigo
  'Rental Income': '#059669',      // Dark Emerald
  'Gifts & Grants': '#a855f7',     // Purple
  'Other Expense': '#64748b',      // Slate
  'Other Income': '#10b981',       // Emerald
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#64748b';
};
