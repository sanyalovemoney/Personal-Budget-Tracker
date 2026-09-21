import React, { useState, useEffect } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { MAX_AMOUNT, isValidAmount } from '../../utils/currency';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Save, Target } from 'lucide-react';

export const SetBudgetModal = ({ isOpen, onClose, targetCategory = null }) => {
  const { budgets, setCategoryBudget, currency, toDisplayAmount, toStoredAmount } = useBudget();
  const [categoryId, setCategoryId] = useState('food');
  const [limit, setLimit] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const limitForCategory = (id) => {
    const cat = DEFAULT_CATEGORIES.find(c => c.id === id);
    const stored = budgets[id] ?? cat?.defaultBudget ?? 100;
    return toDisplayAmount(stored);
  };

  useEffect(() => {
    const id = targetCategory ? targetCategory.id : 'food';
    setCategoryId(id);
    setLimit(limitForCategory(id));
  }, [targetCategory, isOpen, budgets, currency]);

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setCategoryId(id);
    setLimit(limitForCategory(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidAmount(limit, { allowZero: true })) {
      alert(`Будь ласка, введіть суму від 0 до ${MAX_AMOUNT.toLocaleString('uk-UA')}`);
      return;
    }

    setIsSaving(true);
    try {
      await setCategoryBudget(categoryId, toStoredAmount(limit));
      onClose();
    } catch (err) {
      console.error('Error updating budget:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Встановити щомісячний бюджет"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Категорія
          </label>
          <select
            value={categoryId}
            onChange={handleCategoryChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          >
            {DEFAULT_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Ліміт на місяць ({currency})
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="0"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
              className="w-full text-xl font-bold pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              {currency}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button variant="primary" type="submit" isLoading={isSaving} icon={Save}>
            Зберегти ліміт
          </Button>
        </div>

      </form>
    </Modal>
  );
};
