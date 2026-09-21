import React from 'react';
import { CategoryTag } from './CategoryTag';
import { formatDate } from '../../utils/formatters';
import { useBudget } from '../../context/BudgetContext';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const ExpenseItem = ({ transaction, onEdit }) => {
  const { deleteTransaction, formatAmount } = useBudget();

  const isIncome = transaction.type === 'income';

  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей запис?')) {
      await deleteTransaction(transaction.id);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl transition-all group">
      
      {/* Icon + Info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className={`p-2.5 rounded-2xl flex items-center justify-center shrink-0 ${
          isIncome 
            ? 'bg-emerald-500/10 text-emerald-500' 
            : 'bg-rose-500/10 text-rose-500'
        }`}>
          {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 break-words [overflow-wrap:anywhere] line-clamp-2" title={transaction.note || ''}>
              {transaction.note || (isIncome ? 'Дохід' : 'Витрата')}
            </span>
            <CategoryTag categoryId={transaction.categoryId} />
          </div>
          <p className="text-xs text-slate-400">
            {formatDate(transaction.date, 'dd MMMM yyyy, HH:mm')}
          </p>
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="flex items-center gap-4 shrink-0 ml-auto">
        <div className="text-right">
          <span className={`block font-extrabold text-base ${
            isIncome 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-900 dark:text-slate-100'
          }`}>
            {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Редагувати"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Видалити"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
