/**
 * Format number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format Indonesian Rupiah
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousands separator
 */
export function formatNumber(
  number: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format as percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols, spaces, and non-numeric characters except decimal point
  const cleanString = currencyString.replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators
  let numericString: string;
  
  if (cleanString.includes(',') && cleanString.includes('.')) {
    // Both comma and period present
    const lastCommaIndex = cleanString.lastIndexOf(',');
    const lastPeriodIndex = cleanString.lastIndexOf('.');
    
    if (lastPeriodIndex > lastCommaIndex) {
      // Period is decimal separator
      numericString = cleanString.replace(/,/g, '');
    } else {
      // Comma is decimal separator
      numericString = cleanString.replace(/\./g, '').replace(',', '.');
    }
  } else if (cleanString.includes(',')) {
    // Only comma present - could be thousands separator or decimal
    const commaIndex = cleanString.lastIndexOf(',');
    const afterComma = cleanString.substring(commaIndex + 1);
    
    if (afterComma.length <= 2) {
      // Likely decimal separator
      numericString = cleanString.replace(',', '.');
    } else {
      // Likely thousands separator
      numericString = cleanString.replace(/,/g, '');
    }
  } else {
    // No comma, just use as is
    numericString = cleanString;
  }
  
  return parseFloat(numericString) || 0;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format compact number (e.g., 1.2K, 1.5M)
 */
export function formatCompactNumber(
  number: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
}