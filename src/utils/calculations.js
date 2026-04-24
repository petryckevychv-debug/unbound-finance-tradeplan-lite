const checklistKeys = [
  'levelMarked',
  'confirmation',
  'stopDefined',
  'takeProfitsDefined',
  'riskOk',
  'noFomo',
  'invalidationDefined',
  'strategyMatch',
];

const toNumber = (value) => Number(value || 0);

export const calculateRiskAmount = (accountBalance, riskPercent) => {
  const balance = toNumber(accountBalance);
  const risk = toNumber(riskPercent);
  return balance * (risk / 100);
};

export const calculateTradeMetrics = ({ direction, entry, stopLoss, takeProfit1 }) => {
  const entryNum = toNumber(entry);
  const stopNum = toNumber(stopLoss);
  const tp1Num = toNumber(takeProfit1);

  let stopDistance = 0;
  let reward = 0;

  if (direction === 'long') {
    stopDistance = entryNum - stopNum;
    reward = tp1Num - entryNum;
  } else {
    stopDistance = stopNum - entryNum;
    reward = entryNum - tp1Num;
  }

  const rr = stopDistance > 0 ? reward / stopDistance : 0;

  return {
    stopDistance,
    reward,
    rr,
  };
};

export const calculateChecklistScore = (checklist) => {
  const checkedItems = checklistKeys.filter((key) => checklist[key]).length;
  const totalItems = checklistKeys.length;
  return (checkedItems / totalItems) * 100;
};

export const calculateTradeScore = ({ checklistScore, riskPercent, confidence, reason, invalidation, checklist }) => {
  let score = 0;

  if (checklistScore >= 80) score += 2;
  if (toNumber(riskPercent) <= 1) score += 2;
  if (toNumber(confidence) >= 4) score += 1;
  if (reason?.trim()) score += 1;
  if (invalidation?.trim()) score += 1;
  if (checklist?.noFomo) score += 2;

  return Math.min(10, score);
};

export const validateTrade = (trade) => {
  const errors = [];
  const entry = toNumber(trade.entry);
  const stopLoss = toNumber(trade.stopLoss);
  const takeProfit1 = toNumber(trade.takeProfit1);
  const riskPercent = toNumber(trade.riskPercent);

  if (!trade.pair?.trim()) errors.push('Pair is required.');
  if (entry <= 0) errors.push('Entry must be greater than 0.');
  if (stopLoss <= 0) errors.push('Stop loss must be greater than 0.');
  if (takeProfit1 <= 0) errors.push('Take profit 1 must be greater than 0.');
  if (riskPercent <= 0) errors.push('Risk percent must be greater than 0.');
  if (riskPercent > 10) errors.push('Risk percent cannot be above 10.');

  if (trade.direction === 'long' && stopLoss >= entry) {
    errors.push('For long trades, stop loss must be below entry.');
  }

  if (trade.direction === 'short' && stopLoss <= entry) {
    errors.push('For short trades, stop loss must be above entry.');
  }

  return errors;
};

export const getMostCommonMistake = (trades) => {
  const counter = trades
    .filter((trade) => trade.status === 'closed' && trade.mistake?.trim())
    .reduce((acc, trade) => {
      const key = trade.mistake.trim();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : 'None logged';
};

export const checklistFieldKeys = checklistKeys;
