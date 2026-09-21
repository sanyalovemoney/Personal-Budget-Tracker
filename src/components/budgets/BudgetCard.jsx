import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Target, AlertTriangle, CheckCircle, Edit3 } from 'lucide-react';
import * as Icons from 'lucide-react';

export const BudgetCard = ({ onOpenSetBudgetModal }) => {
  const { monthlyTransactions, budgets, formatAmount } = useBudget();

  // Aggregate spent per category
  const categorySpent = {};
  monthlyTransactions.forEach(t => {
    if (t.type === 'expense' || !t.type) {
      categorySpent[t.categoryId] = (categorySpent[t.categoryId] || 0) + Number(t.amount || 0);
    }
  });

  return (
    <Card 
      title="Контроль бюджету по категоріях" 
      action={
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onOpenSetBudgetModal()}
          icon={Target}
        >
          Налаштувати ліміти
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_CATEGORIES.map(cat => {
          const limit = Number(budgets[cat.id] ?? cat.defaultBudget ?? 0);
          const spent = categorySpent[cat.id] || 0;
          // Compare in minor units so rounding never turns an exact hit into an overrun
          const spentMinor = Math.round(spent * 100);
          const limitMinor = Math.round(limit * 100);
          const rawPercent = limitMinor > 0 ? (spentMinor / limitMinor) * 100 : 0;
          const isOver = spentMinor > limitMinor;
          const isReached = spentMinor === limitMinor && limitMinor > 0;
          const isWarning = !isOver && !isReached && rawPercent >= 80;
          const percent = isOver || isReached ? 100 : Math.min(Math.round(rawPercent), 100);

          const IconComponent = Icons[cat.icon] || Target;

          return (
            <div 
              key={cat.id} 
              className="p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-xl border ${cat.bg}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 break-words">{cat.name}</h4>
                    <p className="text-[11px] text-slate-400 break-words">
                      {formatAmount(spent)} з {formatAmount(limit)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-extrabold ${
                    isOver 
                      ? 'text-rose-500' 
                      : isWarning 
                      ? 'text-amber-500' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {limitMinor > 0 ? `${Math.round(rawPercent)}%` : '—'}
                  </span>
                  <button
                    onClick={() => onOpenSetBudgetModal(cat)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-500 transition-opacity"
                    title="Змінити ліміт"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1.5">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    isOver 
                      ? 'bg-rose-500 shadow-sm shadow-rose-500/50' 
                      : isWarning 
                      ? 'bg-amber-500 shadow-sm shadow-amber-500/50' 
                      : 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                  }`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              {/* Alert status footnote */}
              {isOver ? (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Перевищено на {formatAmount(spent - limit)}!
                </div>
              ) : isReached ? (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 mt-1">
                  <CheckCircle className="w-3 h-3" /> Ліміт досягнуто
                </div>
              ) : isWarning ? (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Наближається до ліміту (80%+)
                </div>
              ) : null}

            </div>
          );
        })}
      </div>
    </Card>
  );
};
