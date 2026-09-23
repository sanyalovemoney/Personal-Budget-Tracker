import React, { useState, useEffect } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { getCategoriesByType } from '../../utils/constants';
import { MAX_AMOUNT, isValidAmount } from '../../utils/currency';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Save, Calendar, FileText, Tag, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import * as Icons from 'lucide-react';

export const ExpenseForm = ({ isOpen, onClose, initialData = null }) => {
  const { addTransaction, updateTransaction, currency, toDisplayAmount, toStoredAmount } = useBudget();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [categoryId, setCategoryId] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = getCategoriesByType(type);

  const switchType = (nextType) => {
    setType(nextType);
    const nextCategories = getCategoriesByType(nextType);
    if (!nextCategories.some(category => category.id === categoryId)) {
      setCategoryId(nextCategories[0].id);
    }
  };

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount != null ? toDisplayAmount(initialData.amount) : '');
      const initialType = initialData.type || 'expense';
      setType(initialType);
      setCategoryId(initialData.categoryId || getCategoriesByType(initialType)[0].id);
      setDate(initialData.date ? initialData.date.substring(0, 10) : new Date().toISOString().substring(0, 10));
      setNote(initialData.note || '');
    } else {
      setAmount('');
      setType('expense');
      setCategoryId(getCategoriesByType('expense')[0].id);
      setDate(new Date().toISOString().substring(0, 10));
      setNote('');
    }
  }, [initialData, isOpen, currency]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidAmount(amount)) {
      alert(`Будь ласка, введіть суму від 0.01 до ${MAX_AMOUNT.toLocaleString('uk-UA')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: toStoredAmount(amount),
        type,
        categoryId,
        date: new Date(date).toISOString(),
        note: note.trim()
      };

      if (initialData && initialData.id) {
        await updateTransaction(initialData.id, payload);
      } else {
        await addTransaction(payload);
      }
      onClose();
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('Помилка при збереженні запису');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Редагувати запис' : 'Додати новий запис'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Type Switcher: Expense vs Income */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => switchType('expense')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Витрата
          </button>
          <button
            type="button"
            onClick={() => switchType('income')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Дохід
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Сума ({currency})
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full text-2xl font-extrabold pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              {currency}
            </span>
          </div>
        </div>

        {/* Category Selector Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            {type === 'income' ? 'Джерело доходу' : 'Категорія витрат'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
            {categories.map((cat) => {
              const IconComp = Icons[cat.icon] || Tag;
              const isSelected = categoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="truncate w-full text-center">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Дата
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Коментар / Примітка
            </label>
            <input
              type="text"
              placeholder="Наприклад: Продукти в Сільпо"
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            isLoading={isSubmitting}
            icon={Save}
          >
            {initialData ? 'Зберегти зміни' : 'Додати транзакцію'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
