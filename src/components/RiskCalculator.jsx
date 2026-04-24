function RiskCalculator({ riskPreview }) {
  return (
    <section className="card">
      <h2>Risk Calculator</h2>
      <div className="metrics-grid">
        <div>
          <p className="metric-label">Risk Amount</p>
          <p className="metric-value">${riskPreview.riskAmount.toFixed(2)}</p>
        </div>
        <div>
          <p className="metric-label">Stop Distance</p>
          <p className="metric-value">{riskPreview.stopDistance.toFixed(4)}</p>
        </div>
        <div>
          <p className="metric-label">R:R (TP1)</p>
          <p className="metric-value">{riskPreview.rr.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
}

export default RiskCalculator;
