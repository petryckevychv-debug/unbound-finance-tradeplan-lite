export const STORAGE_KEY = 'unbound_finance_tradeplan_trades';

export const loadTrades = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveTrades = (trades) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
};

export const clearTrades = () => {
  localStorage.removeItem(STORAGE_KEY);
};
