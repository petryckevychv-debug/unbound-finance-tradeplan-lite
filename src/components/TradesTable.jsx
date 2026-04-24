function TradesTable({ trades, onDelete, onEdit, onMarkClosed }) {
  return (
    <section className="card">
      <h2>Trades Journal</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>Dir</th>
              <th>Status</th>
              <th>Entry</th>
              <th>SL</th>
              <th>TP1</th>
              <th>Risk $</th>
              <th>R:R</th>
              <th>Checklist</th>
              <th>Score</th>
              <th>Result R</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.pair}</td>
                <td className={trade.direction === 'long' ? 'text-good' : 'text-risk'}>{trade.direction}</td>
                <td>{trade.status}</td>
                <td>{Number(trade.entry).toFixed(4)}</td>
                <td>{Number(trade.stopLoss).toFixed(4)}</td>
                <td>{Number(trade.takeProfit1).toFixed(4)}</td>
                <td>{Number(trade.riskAmount || 0).toFixed(2)}</td>
                <td>{Number(trade.rr || 0).toFixed(2)}</td>
                <td>{Number(trade.checklistScore || 0).toFixed(0)}%</td>
                <td>{Number(trade.tradeScore || 0)}/10</td>
                <td>{trade.resultR === '' ? '-' : trade.resultR}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-xs" onClick={() => onEdit(trade)}>
                      Edit Trade
                    </button>
                    <button className="btn btn-xs btn-danger" onClick={() => onDelete(trade.id)}>
                      Delete Trade
                    </button>
                    {trade.status !== 'closed' && (
                      <button className="btn btn-xs btn-secondary" onClick={() => onMarkClosed(trade)}>
                        Mark Closed
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TradesTable;
