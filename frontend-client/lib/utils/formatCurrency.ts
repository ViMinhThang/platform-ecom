const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export const formatCurrency = (amount: number | undefined | null): string => {
    if (typeof amount !== 'number') return '0 ₫';
    return CURRENCY_FORMATTER.format(amount);
};
