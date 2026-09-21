import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { useAuth } from '../../context/AuthContext';
import { formatMonthYear } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { 
  Sun, 
  Moon, 
  Wallet, 
  Calendar, 
  LogOut, 
  LogIn, 
  DollarSign, 
  Euro, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../ui/Modal';

export const Navbar = ({ onOpenAuthModal }) => {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    currency, 
    setCurrency, 
    darkMode, 
    toggleDarkMode 
  } = useBudget();
  
  const { currentUser, isDemoMode, logout, isFirebaseConfigured } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:h-20 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Budget<span className="text-emerald-500">Flow</span>
              </h1>
              {isDemoMode && (
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full">
                  Demo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Особистий бюджет & місячна аналітика
            </p>
          </div>
        </div>

        {/* Center: Month Selector */}
        <div className="order-last lg:order-none w-full lg:w-auto flex items-center gap-2 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <Calendar className="w-4 h-4 text-emerald-500 ml-2.5 hidden sm:inline-block" />
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer px-2 py-1"
          />
          <span className="text-xs font-semibold px-2 py-1 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-xs hidden md:inline-block">
            {formatMonthYear(selectedMonth + '-01')}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Currency Select */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="UAH">₴ UAH</option>
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-800/60"
            title="Переключити тему"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Auth Status */}
          {currentUser && !isDemoMode ? (
            <div className="flex items-center gap-2">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-full border border-emerald-500/50"
                />
              ) : (
                <div 
                  aria-label="User Avatar"
                  className="w-8 h-8 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold uppercase"
                >
                  {(currentUser.displayName || currentUser.email || '?').charAt(0)}
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={logout} icon={LogOut}>
                <span className="hidden md:inline">Вихід</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={onOpenAuthModal} 
              icon={LogIn}
            >
              <span className="hidden sm:inline">Firebase Вхід</span>
            </Button>
          )}

        </div>

      </div>
    </header>
  );
};
