/**
 * Format amount in XAF (Central African CFA Franc)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number as currency without symbol
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseInt(value.replace(/[^\d]/g, '')) || 0;
}