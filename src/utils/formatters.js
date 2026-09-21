import { format, parseISO, isValid } from 'date-fns';
import { uk } from 'date-fns/locale';

export const formatCurrency = (amount, currency = 'USD') => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export const formatDate = (dateInput, formatStr = 'dd MMM yyyy') => {
  if (!dateInput) return '';
  const dateObj = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr, { locale: uk });
};

export const formatMonthYear = (dateInput) => {
  if (!dateInput) return '';
  const dateObj = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
  if (!isValid(dateObj)) return '';
  const str = format(dateObj, 'LLLL yyyy', { locale: uk });
  return str.charAt(0).toUpperCase() + str.slice(1);
};
