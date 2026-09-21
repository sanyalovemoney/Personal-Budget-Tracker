import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  Zap, 
  AlertTriangle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export const SpendingInsights = () => {
  const { 
    totalSpent, 
    totalIncome, 
    totalBudgetLimit, 
    formatAmount, 
    selectedMonth,
    monthlyTransactions 
  } = useBudget();

  // Balance
  const netBalance = totalIncome - totalSpent;
  const budgetRemaining = totalBudgetLimit - totalSpent;

  // Predictive Analytics: Daily Spend Velocity & Forecast
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  
  // Current day of month for calculation
  let currentDay = today.getDate();
  if (today.getFullYear() !== year || (today.getMonth() + 1) !== month) {
    currentDay = daysInMonth; // If viewing past/future month, use full month
  }

  const avgDailySpend = currentDay > 0 ? totalSpent / currentDay : 0;
  const projectedMonthEndSpend = avgDailySpend * daysInMonth;
  const isProjectedOver = totalBudgetLimit > 0 && projectedMonthEndSpend > totalBudgetLimit;

  return (
    <div className="space-y-6">

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Income Card */}
        <div className="p-5 glass-card glass-card-hover border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Доходи за місяць</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold break-words text-emerald-600 dark:text-emerald-400">
            {formatAmount(totalIncome)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Отримані надходження</p>
        </div>

        {/* Total Spent Card */}
        <div className="p-5 glass-card glass-card-hover border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Витрачено за місяць</span>
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold break-words text-slate-900 dark:text-white">
            {formatAmount(totalSpent)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalBudgetLimit > 0 ? `${Math.round((totalSpent / totalBudgetLimit) * 100)}% від загального бюджету` : 'Загальні витрати'}
          </p>
        </div>

        {/* Net Balance Card */}
        <div className="p-5 glass-card glass-card-hover border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Чистий баланс</span>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold break-words ${netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-500'}`}>
            {formatAmount(netBalance)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Доходи мінус витрати</p>
        </div>

        {/* Budget Remaining Card */}
        <div className="p-5 glass-card glass-card-hover border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Залишок бюджету</span>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold break-words ${budgetRemaining >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-rose-500'}`}>
            {formatAmount(budgetRemaining)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">З загального ліміту {formatAmount(totalBudgetLimit)}</p>
        </div>

      </div>

      {/* Predictive Analytics Card */}
      <Card title="Предиктивна аналітика та прогноз витрат">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Daily Pace */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Середньодобові витрати</span>
            <div className="text-xl font-bold break-words text-slate-800 dark:text-slate-100">
              {formatAmount(avgDailySpend)} <span className="text-xs font-normal text-slate-400">/день</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Розраховано за останні {currentDay} дн.</p>
          </div>

          {/* Forecast */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Прогноз на кінець місяця</span>
            <div className={`text-xl font-bold ${isProjectedOver ? 'text-rose-500' : 'text-emerald-500'}`}>
              {formatAmount(projectedMonthEndSpend)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Очікувана сума за {daysInMonth} дн.</p>
          </div>

          {/* Insights Status */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${isProjectedOver ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-0.5">
                {isProjectedOver ? 'Ризик перевищення!' : 'Бюджет у нормі'}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isProjectedOver 
                  ? `Поточний темп загрожує перевищенням на ${formatAmount(projectedMonthEndSpend - totalBudgetLimit)}.`
                  : 'За поточного темпу ви вкладаєтеся у запланований бюджет.'}
              </p>
            </div>
          </div>

        </div>
      </Card>

    </div>
  );
};
