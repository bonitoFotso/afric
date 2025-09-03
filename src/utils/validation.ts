/**
 * Validate transfer amount
 */
export function validateAmount(amount: number, maxAmount: number): boolean {
  return amount > 0 && amount <= maxAmount;
}

/**
 * Validate account number format (basic validation)
 */
export function validateAccountNumber(accountNumber: string): boolean {
  return /^\d{10,16}$/.test(accountNumber.replace(/\s/g, ''));
}

/**
 * Validate required fields
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Format account number with spaces for display
 */
export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}