import React from 'react';
import { getCategory } from '../../utils/constants';
import * as Icons from 'lucide-react';

export const CategoryTag = ({ categoryId, className = '' }) => {
  const category = getCategory(categoryId);
  const IconComponent = Icons[category.icon] || Icons.Tag;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${category.bg} ${className}`}>
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{category.name}</span>
    </span>
  );
};
