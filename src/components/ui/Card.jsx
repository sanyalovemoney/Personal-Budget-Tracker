import React from 'react';

export const Card = ({ children, className = '', title, action, ...props }) => {
  return (
    <div className={`glass-card glass-card-hover p-6 ${className}`} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
