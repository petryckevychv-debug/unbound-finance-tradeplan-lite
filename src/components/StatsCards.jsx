function StatsCards({ stats }) {
  const items = [
    ['Total Trades', stats.totalTrades],
    ['Planned', stats.plannedTrades],
    ['Open', stats.openTrades],
    ['Closed', stats.closedTrades],
    ['Winrate', `${stats.winrate.toFixed(1)}%`],
    ['Average R', stats.averageR.toFixed(2)],
    ['Total PnL (R)', stats.totalPnL.toFixed(2)],
    ['Most Common Mistake', stats.mostCommonMistake],
  ];

  return (
    <section className="card">
      <h2>Journal Stats</h2>
      <div className="stats-grid">
        {items.map(([label, value]) => (
          <article key={label} className="stat-card">
            <p className="metric-label">{label}</p>
            <p className="metric-value">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StatsCards;
