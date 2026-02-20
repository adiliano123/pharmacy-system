// General utility functions
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Format currency in TZS
export function formatCurrency(amount: number): string {
  return `TZS ${amount.toLocaleString()}`;
}

// Format date
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Calculate days until expiry
export function daysUntilExpiry(expiryDate: string | Date): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
