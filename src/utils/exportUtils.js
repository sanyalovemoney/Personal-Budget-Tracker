import { formatDate } from './formatters';
import { DEFAULT_CATEGORIES } from './constants';

export const exportTransactionsToCSV = (transactions, monthString) => {
  if (!transactions || transactions.length === 0) {
    alert('Немає транзакцій для експорту');
    return;
  }

  const headers = ['ID', 'Дата', 'Тип', 'Категорія', 'Сума', 'Примітка'];
  
  const rows = transactions.map(t => {
    const cat = DEFAULT_CATEGORIES.find(c => c.id === t.categoryId);
    const catName = cat ? cat.name : t.categoryId;
    const typeLabel = t.type === 'income' ? 'Дохід' : 'Витрата';
    const cleanNote = (t.note || '').replace(/"/g, '""');

    return [
      t.id,
      formatDate(t.date, 'yyyy-MM-dd HH:mm'),
      typeLabel,
      `"${catName}"`,
      t.amount,
      `"${cleanNote}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `budget_report_${monthString || 'export'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
