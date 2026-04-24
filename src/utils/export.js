const downloadFile = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportTradesToJSON = (trades) => {
  downloadFile(
    'unbound-finance-tradeplan-backup.json',
    JSON.stringify(trades, null, 2),
    'application/json;charset=utf-8;'
  );
};

const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export const exportTradesToCSV = (trades) => {
  const headers = [
    'id',
    'createdAt',
    'pair',
    'direction',
    'timeframe',
    'setupType',
    'entry',
    'stopLoss',
    'takeProfit1',
    'takeProfit2',
    'accountBalance',
    'riskPercent',
    'riskAmount',
    'stopDistance',
    'rr',
    'checklistScore',
    'tradeScore',
    'confidence',
    'reason',
    'invalidation',
    'emotion',
    'status',
    'resultR',
    'mistake',
    'source',
  ];

  const rows = trades.map((trade) => headers.map((header) => csvEscape(trade[header])));
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  downloadFile('unbound-finance-tradeplan-trades.csv', csvContent, 'text/csv;charset=utf-8;');
};
