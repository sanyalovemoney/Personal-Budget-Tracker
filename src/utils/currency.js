// Amounts are stored in BASE_CURRENCY and converted only for display/input.
export const BASE_CURRENCY = 'USD';

export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  UAH: 41.5
};

export const RATES_UPDATED_AT = '2026-09-01';

// Largest amount that still renders and aggregates safely.
export const MAX_AMOUNT = 1_000_000_000;

export const getRate = (currency) => EXCHANGE_RATES[currency] ?? 1;

const roundMinor = (value) => Math.round(value * 100) / 100;

export const fromBase = (amount, currency) => {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return 0;
  return roundMinor(numeric * getRate(currency));
};

export const toBase = (amount, currency) => {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return 0;
  return roundMinor(numeric / getRate(currency));
};

export const isValidAmount = (value, { allowZero = false } = {}) => {
  if (value === '' || value === null || value === undefined) return false;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return false;
  if (allowZero ? numeric < 0 : numeric <= 0) return false;
  return numeric <= MAX_AMOUNT;
};
