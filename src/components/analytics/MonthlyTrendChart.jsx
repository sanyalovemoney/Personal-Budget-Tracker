import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const MonthlyTrendChart = () => {
  const { monthlyTransactions, selectedMonth, currency, darkMode } = useBudget();

  // Extract year and month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // Number of days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Map daily totals
  const dailyExpenses = new Array(daysInMonth).fill(0);
  const dailyIncome = new Array(daysInMonth).fill(0);

  monthlyTransactions.forEach(t => {
    if (t.date) {
      const d = new Date(t.date);
      const dayNum = d.getDate();
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        if (t.type === 'income') {
          dailyIncome[dayNum - 1] += Number(t.amount || 0);
        } else {
          dailyExpenses[dayNum - 1] += Number(t.amount || 0);
        }
      }
    }
  });

  const data = {
    labels: daysArray.map(d => `${d}`),
    datasets: [
      {
        label: 'Витрати',
        data: dailyExpenses,
        backgroundColor: '#10b981',
        borderRadius: 6,
        hoverBackgroundColor: '#059669',
      },
      {
        label: 'Доходи',
        data: dailyIncome,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        hoverBackgroundColor: '#2563eb',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#cbd5e1' : '#334155',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${formatCurrency(context.raw, currency)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: darkMode ? '#94a3b8' : '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: darkMode ? '#1e293b' : '#f1f5f9' },
        ticks: { color: darkMode ? '#94a3b8' : '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <Card title="Тренд по днях місяця">
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};
