
// Simple: 350₾ (symbol at the end — like your original)
export const GEL = (
    n: number | string,
    opts: Intl.NumberFormatOptions = {}
): string => {
    const num = Number(n ?? 0);
    return new Intl.NumberFormat('ka-GE', {
        maximumFractionDigits: 0,
        ...opts,
    }).format(num) + '₾';
};

// Alternative (Intl currency style — symbol position/spacing locale )
export const formatGEL = (
    n: number | string,
    opts: Intl.NumberFormatOptions = {}
): string =>
    new Intl.NumberFormat('ka-GE', {
        style: 'currency',
        currency: 'GEL',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0,
        ...opts,
}).format(Number(n ?? 0));
