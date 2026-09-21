import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useBudget } from '../../context/BudgetContext';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryBreakdownChart = () => {
  const { monthlyTransactions, currency, darkMode, toDisplayAmount } = useBudget();

  // Aggregate expenses by category
  const categoryTotals = {};
  monthlyTransactions.forEach(t => {
    if (t.type === 'expense' || !t.type) {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + toDisplayAmount(t.amount || 0);
    }
  });

  const activeCategories = DEFAULT_CATEGORIES.filter(c => (categoryTotals[c.id] || 0) > 0);

  const data = {
    labels: activeCategories.map(c => c.name),
    datasets: [
      {
        data: activeCategories.map(c => categoryTotals[c.id]),
        backgroundColor: activeCategories.map(c => c.hex),
        borderColor: darkMode ? '#0f172a' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#cbd5e1' : '#334155',
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: '600'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return ` ${context.label}: ${formatCurrency(val, currency)}`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const hasData = activeCategories.length > 0;

  return (
    <Card title="Розподіл витрат за категоріями">
      {hasData ? (
        <div className="h-64 relative">
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
          <PieChart className="w-10 h-10 mb-2 opacity-30" />
          <p>Немає витрат для відображення діаграми</p>
        </div>
      )}
    </Card>
  );
};
