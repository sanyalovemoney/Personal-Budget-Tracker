import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { ExpenseItem } from './ExpenseItem';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { exportTransactionsToCSV } from '../../utils/exportUtils';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { Search, Download, Plus, Filter, Receipt } from 'lucide-react';

export const ExpenseList = ({ onOpenAddModal, onEditTransaction }) => {
  const { monthlyTransactions, selectedMonth } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'
  const [filterCategory, setFilterCategory] = useState('all');

  const filtered = monthlyTransactions.filter(t => {
    // Type filter
    if (filterType !== 'all' && t.type !== filterType) return false;

    // Category filter
    if (filterCategory !== 'all' && t.categoryId !== filterCategory) return false;

    // Search term filter
    if (searchTerm.trim()) {
      const cat = DEFAULT_CATEGORIES.find(c => c.id === t.categoryId);
      const catName = cat ? cat.name.toLowerCase() : '';
      const note = (t.note || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return note.includes(term) || catName.includes(term);
    }

    return true;
  });

  return (
    <Card 
      title="Історія витрат та доходів"
      action={
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportTransactionsToCSV(filtered, selectedMonth)}
            icon={Download}
          >
            <span className="hidden sm:inline">CSV Експорт</span>
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onOpenAddModal}
            icon={Plus}
          >
            Додати
          </Button>
        </div>
      }
    >
      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Пошук витрат..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
        >
          <option value="all">Усі типи</option>
          <option value="expense">Тільки Витрати</option>
          <option value="income">Тільки Доходи</option>
        </select>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
        >
          <option value="all">Усі категорії</option>
          {DEFAULT_CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

      </div>

      {/* List / Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Receipt className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Записів не знайдено за вибраний період
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Спробуйте змінити фільтри або додайте нову витрату
          </p>
          <Button variant="primary" size="sm" onClick={onOpenAddModal} icon={Plus}>
            Створити першу витрату
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filtered.map((t) => (
            <ExpenseItem 
              key={t.id} 
              transaction={t} 
              onEdit={onEditTransaction} 
            />
          ))}
        </div>
      )}
    </Card>
  );
};
