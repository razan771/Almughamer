export function formatCurrency(amount: number | string) {
  return `د.إ ${Number(amount).toFixed(2)}`;
}
