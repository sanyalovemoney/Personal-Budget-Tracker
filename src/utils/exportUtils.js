import { formatDate } from './formatters';
import { ALL_CATEGORIES } from './constants';
import { fromBase } from './currency';

const escapeCell = (value) => {
  const text = String(value ?? '');
  // Neutralize spreadsheet formulas before quoting
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const exportTransactionsToCSV = (transactions, monthString, currency = 'USD') => {
  if (!transactions || transactions.length === 0) {
    alert('Немає транзакцій для експорту');
    return;
  }

  const headers = ['ID', 'Дата', 'Тип', 'Категорія', 'Сума', 'Валюта', 'Примітка'];

  const rows = transactions.map(t => {
    const cat = ALL_CATEGORIES.find(c => c.id === t.categoryId);
    const catName = cat ? cat.name : t.categoryId;
    const typeLabel = t.type === 'income' ? 'Дохід' : 'Витрата';

    return [
      escapeCell(t.id),
      escapeCell(formatDate(t.date, 'yyyy-MM-dd HH:mm')),
      escapeCell(typeLabel),
      escapeCell(catName),
      fromBase(t.amount, currency).toFixed(2),
      escapeCell(currency),
      escapeCell(t.note || '')
    ];
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCell).join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `budget_report_${monthString || 'export'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
