export function refillRatio (qty, sold) {
  sold = sold || 0;
  if (sold === 0) return 0;
  qty = qty || 0;
  return (qty / (sold * 2)) * 100;
}