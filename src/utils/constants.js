export const DEFAULT_CATEGORIES = [
  {
    id: 'food',
    name: 'Продукти харчування',
    icon: 'ShoppingBag',
    color: 'emerald',
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    hex: '#10b981',
    defaultBudget: 400
  },
  {
    id: 'housing',
    name: 'Житло та Комунальні',
    icon: 'Home',
    color: 'blue',
    bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    hex: '#3b82f6',
    defaultBudget: 600
  },
  {
    id: 'transport',
    name: 'Транспорт та Паливо',
    icon: 'Car',
    color: 'amber',
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    hex: '#f59e0b',
    defaultBudget: 150
  },
  {
    id: 'entertainment',
    name: 'Розваги та Відпочинок',
    icon: 'Film',
    color: 'purple',
    bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    hex: '#8b5cf6',
    defaultBudget: 200
  },
  {
    id: 'health',
    name: 'Здоров\'я та Аптека',
    icon: 'HeartPulse',
    color: 'rose',
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    hex: '#f43f5e',
    defaultBudget: 100
  },
  {
    id: 'education',
    name: 'Освіта та Книги',
    icon: 'GraduationCap',
    color: 'indigo',
    bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    hex: '#6366f1',
    defaultBudget: 150
  },
  {
    id: 'shopping',
    name: 'Одяг та Покупки',
    icon: 'Shirt',
    color: 'pink',
    bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    hex: '#ec4899',
    defaultBudget: 250
  },
  {
    id: 'other',
    name: 'Інше',
    icon: 'MoreHorizontal',
    color: 'slate',
    bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    hex: '#64748b',
    defaultBudget: 100
  }
];

export const INITIAL_DEMO_TRANSACTIONS = [
  {
    id: 'demo-1',
    amount: 145.80,
    type: 'expense',
    categoryId: 'food',
    note: 'Супермаркет (продукти на тиждень)',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 18).toISOString(),
  },
  {
    id: 'demo-2',
    amount: 320.00,
    type: 'expense',
    categoryId: 'housing',
    note: 'Оплата комунальних послуг',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString(),
  },
  {
    id: 'demo-3',
    amount: 45.00,
    type: 'expense',
    categoryId: 'transport',
    note: 'Заправка авто (бензин)',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 19).toISOString(),
  },
  {
    id: 'demo-4',
    amount: 85.50,
    type: 'expense',
    categoryId: 'entertainment',
    note: 'Кінотеатр та вечеря з друзями',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 14).toISOString(),
  },
  {
    id: 'demo-5',
    amount: 60.00,
    type: 'expense',
    categoryId: 'health',
    note: 'Вітаміни та ліки',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString(),
  },
  {
    id: 'demo-6',
    amount: 120.00,
    type: 'expense',
    categoryId: 'shopping',
    note: 'Нова кросівки',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(),
  },
  {
    id: 'demo-7',
    amount: 210.00,
    type: 'expense',
    categoryId: 'food',
    note: 'Закупівля м\'яса та овочів',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 21).toISOString(),
  },
  {
    id: 'demo-8',
    amount: 1800.00,
    type: 'income',
    categoryId: 'other',
    note: 'Основна заробітна плата',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
  }
];

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  UAH: '₴'
};
