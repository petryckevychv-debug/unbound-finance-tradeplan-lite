function TradeForm({ formState, onChange, onSave, onReset, editingId }) {
  const numericFields = [
    ['entry', 'Entry'],
    ['stopLoss', 'Stop Loss'],
    ['takeProfit1', 'Take Profit 1'],
    ['takeProfit2', 'Take Profit 2'],
    ['accountBalance', 'Account Balance'],
    ['riskPercent', 'Risk %'],
  ];

  return (
    <section className="card form-card">
      <h2>{editingId ? 'Edit Trade' : 'Trade Form'}</h2>
      <div className="form-grid">
        <label>
          Pair
          <input value={formState.pair} onChange={(e) => onChange('pair', e.target.value.toUpperCase())} />
        </label>
        <label>
          Direction
          <select value={formState.direction} onChange={(e) => onChange('direction', e.target.value)}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </label>
        <label>
          Timeframe
          <input value={formState.timeframe} onChange={(e) => onChange('timeframe', e.target.value)} />
        </label>
        <label>
          Setup Type
          <input value={formState.setupType} onChange={(e) => onChange('setupType', e.target.value)} />
        </label>

        {numericFields.map(([field, label]) => (
          <label key={field}>
            {label}
            <input
              type="number"
              step="any"
              value={formState[field]}
              onChange={(e) => onChange(field, e.target.value)}
            />
          </label>
        ))}

        <label>
          Confidence (1-5)
          <input
            type="number"
            min="1"
            max="5"
            value={formState.confidence}
            onChange={(e) => onChange('confidence', e.target.value)}
          />
        </label>
        <label>
          Status
          <select value={formState.status} onChange={(e) => onChange('status', e.target.value)}>
            <option value="planned">Planned</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label>
          Emotion
          <input value={formState.emotion} onChange={(e) => onChange('emotion', e.target.value)} />
        </label>
        <label>
          Result R (for closed)
          <input type="number" step="any" value={formState.resultR} onChange={(e) => onChange('resultR', e.target.value)} />
        </label>
      </div>

      <label>
        Reason
        <textarea rows="2" value={formState.reason} onChange={(e) => onChange('reason', e.target.value)} />
      </label>
      <label>
        Invalidation
        <textarea rows="2" value={formState.invalidation} onChange={(e) => onChange('invalidation', e.target.value)} />
      </label>
      <label>
        Mistake
        <textarea rows="2" value={formState.mistake} onChange={(e) => onChange('mistake', e.target.value)} />
      </label>

      <div className="button-row">
        <button className="btn btn-primary" onClick={onSave}>
          Save Trade
        </button>
        <button className="btn" onClick={onReset}>
          Reset Form
        </button>
      </div>
    </section>
  );
}

export default TradeForm;
