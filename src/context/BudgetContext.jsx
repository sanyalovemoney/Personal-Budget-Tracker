import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { DEFAULT_CATEGORIES, INITIAL_DEMO_TRANSACTIONS } from '../utils/constants';
import { fromBase, toBase } from '../utils/currency';
import { formatCurrency } from '../utils/formatters';
import { format } from 'date-fns';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const { currentUser, isDemoMode } = useAuth();

  // Active view date filter (default YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [currency, setCurrency] = useState(() => localStorage.getItem('pbt_currency') || 'USD');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('pbt_theme') === 'dark' || 
      (!('pbt_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // State
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  // Sync Dark mode HTML class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pbt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pbt_theme', 'light');
    }
  }, [darkMode]);

  // Sync Currency to localStorage
  useEffect(() => {
    localStorage.setItem('pbt_currency', currency);
  }, [currency]);

  // Load Transactions & Budgets
  useEffect(() => {
    let unsubscribeTx = () => {};
    let unsubscribeBudgets = () => {};

    if (isFirebaseConfigured && currentUser && !isDemoMode) {
      setLoadingData(true);
      
      // 1. Transactions collection
      const txRef = collection(db, 'users', currentUser.uid, 'transactions');
      const q = query(txRef, orderBy('date', 'desc'));
      
      unsubscribeTx = onSnapshot(q, (snapshot) => {
        const txs = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setTransactions(txs);
        setLoadingData(false);
      }, (err) => {
        console.error("Firestore transactions listener error:", err);
        setLoadingData(false);
      });

      // 2. Budgets collection
      const budgetsRef = collection(db, 'users', currentUser.uid, 'budgets');
      unsubscribeBudgets = onSnapshot(budgetsRef, (snapshot) => {
        const bMap = {};
        snapshot.docs.forEach(docSnap => {
          bMap[docSnap.id] = docSnap.data().monthlyLimit;
        });
        setBudgets(bMap);
      });

    } else {
      // LocalStorage / Demo Mode Fallback
      setLoadingData(true);
      const savedTxs = localStorage.getItem('pbt_transactions');
      if (savedTxs) {
        setTransactions(JSON.parse(savedTxs));
      } else {
        setTransactions(INITIAL_DEMO_TRANSACTIONS);
        localStorage.setItem('pbt_transactions', JSON.stringify(INITIAL_DEMO_TRANSACTIONS));
      }

      const savedBudgets = localStorage.getItem('pbt_budgets');
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      } else {
        const defaultBMap = {};
        DEFAULT_CATEGORIES.forEach(c => {
          defaultBMap[c.id] = c.defaultBudget;
        });
        setBudgets(defaultBMap);
        localStorage.setItem('pbt_budgets', JSON.stringify(defaultBMap));
      }
      setLoadingData(false);
    }

    return () => {
      unsubscribeTx();
      unsubscribeBudgets();
    };
  }, [currentUser, isDemoMode]);

  // Persist LocalStorage changes in demo mode
  const persistDemoTransactions = (newTxs) => {
    setTransactions(newTxs);
    localStorage.setItem('pbt_transactions', JSON.stringify(newTxs));
  };

  const persistDemoBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem('pbt_budgets', JSON.stringify(newBudgets));
  };

  // CRUD Operations
  const addTransaction = async (txData) => {
    const newTx = {
      ...txData,
      amount: Number(txData.amount),
      date: txData.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && currentUser && !isDemoMode) {
      await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), newTx);
    } else {
      const demoTx = { ...newTx, id: 'tx-' + Date.now() };
      const updated = [demoTx, ...transactions];
      persistDemoTransactions(updated);
    }
  };

  const updateTransaction = async (id, updatedFields) => {
    const updatedData = {
      ...updatedFields,
      amount: Number(updatedFields.amount),
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && currentUser && !isDemoMode) {
      const txDocRef = doc(db, 'users', currentUser.uid, 'transactions', id);
      await updateDoc(txDocRef, updatedData);
    } else {
      const updated = transactions.map(t => t.id === id ? { ...t, ...updatedData } : t);
      persistDemoTransactions(updated);
    }
  };

  const deleteTransaction = async (id) => {
    if (isFirebaseConfigured && currentUser && !isDemoMode) {
      const txDocRef = doc(db, 'users', currentUser.uid, 'transactions', id);
      await deleteDoc(txDocRef);
    } else {
      const updated = transactions.filter(t => t.id !== id);
      persistDemoTransactions(updated);
    }
  };

  const setCategoryBudget = async (categoryId, monthlyLimit) => {
    const limitNum = Number(monthlyLimit);
    if (isFirebaseConfigured && currentUser && !isDemoMode) {
      const budgetDocRef = doc(db, 'users', currentUser.uid, 'budgets', categoryId);
      await setDoc(budgetDocRef, { monthlyLimit: limitNum, updatedAt: new Date().toISOString() });
    } else {
      const updatedBudgets = { ...budgets, [categoryId]: limitNum };
      persistDemoBudgets(updatedBudgets);
    }
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Stored amounts are in the base currency; convert only at the display/input boundary
  const toDisplayAmount = (baseAmount) => fromBase(baseAmount, currency);
  const toStoredAmount = (displayAmount) => toBase(displayAmount, currency);
  const formatAmount = (baseAmount) => formatCurrency(fromBase(baseAmount, currency), currency);

  // Compute stats for the currently selected month
  const monthlyTransactions = transactions.filter(t => {
    if (!t.date) return false;
    return t.date.substring(0, 7) === selectedMonth;
  });

  const totalSpent = monthlyTransactions
    .filter(t => t.type === 'expense' || !t.type)
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  // A category without a saved budget falls back to its default, so totals and
  // cards always describe the same limits.
  const effectiveBudgets = DEFAULT_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = Number(budgets[cat.id] ?? cat.defaultBudget ?? 0);
    return acc;
  }, {});

  const totalBudgetLimit = Object.values(effectiveBudgets).reduce((acc, b) => acc + Number(b || 0), 0);

  const value = {
    selectedMonth,
    setSelectedMonth,
    currency,
    setCurrency,
    darkMode,
    toggleDarkMode,
    transactions,
    monthlyTransactions,
    budgets,
    effectiveBudgets,
    loadingData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setCategoryBudget,
    toDisplayAmount,
    toStoredAmount,
    formatAmount,
    totalSpent,
    totalIncome,
    totalBudgetLimit
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
