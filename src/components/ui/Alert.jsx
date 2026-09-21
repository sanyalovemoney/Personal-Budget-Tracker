import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Alert = ({ type = 'warning', title, message, action }) => {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle
  };

  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-start gap-3.5 p-4 border rounded-2xl ${styles[type]}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="opacity-90">{message}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
