import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import { Layout } from './components/layout/Layout';
import { SpendingInsights } from './components/analytics/SpendingInsights';
import { CategoryBreakdownChart } from './components/analytics/CategoryBreakdownChart';
import { MonthlyTrendChart } from './components/analytics/MonthlyTrendChart';
import { ExpenseList } from './components/expenses/ExpenseList';
import { ExpenseForm } from './components/expenses/ExpenseForm';
import { BudgetCard } from './components/budgets/BudgetCard';
import { SetBudgetModal } from './components/budgets/SetBudgetModal';
import { AuthModal } from './components/auth/AuthModal';
import { Plus } from 'lucide-react';

const MainDashboard = () => {
  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [targetBudgetCategory, setTargetBudgetCategory] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Handlers
  const handleOpenAddExpense = () => {
    setEditingTransaction(null);
    setIsExpenseModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsExpenseModalOpen(true);
  };

  const handleOpenSetBudget = (category = null) => {
    setTargetBudgetCategory(category);
    setIsBudgetModalOpen(true);
  };

  return (
    <Layout onOpenAuthModal={() => setIsAuthModalOpen(true)}>
      
      <div className="space-y-8">

        {/* Top Analytics Summary & Predictive Insights */}
        <SpendingInsights />

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Column: Trend Chart & Expense List (8 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <MonthlyTrendChart />
            <ExpenseList 
              onOpenAddModal={handleOpenAddExpense} 
              onEditTransaction={handleEditTransaction} 
            />
          </div>

          {/* Right Column: Breakdown Doughnut & Budget Control (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <CategoryBreakdownChart />
            <BudgetCard onOpenSetBudgetModal={handleOpenSetBudget} />
          </div>

        </div>

      </div>

      {/* Floating Action Button (FAB) for adding expense */}
      <button
        onClick={handleOpenAddExpense}
        className="fixed bottom-6 right-6 z-40 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-600/50 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        title="Додати нову витрату"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <ExpenseForm 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
        initialData={editingTransaction}
      />

      <SetBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        targetCategory={targetBudgetCategory}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <MainDashboard />
      </BudgetProvider>
    </AuthProvider>
  );
}
