import { checklistFieldKeys } from '../utils/calculations';

const labels = {
  levelMarked: 'Level marked',
  confirmation: 'Confirmation candle',
  stopDefined: 'Stop defined',
  takeProfitsDefined: 'Take profits defined',
  riskOk: 'Risk acceptable',
  noFomo: 'No FOMO',
  invalidationDefined: 'Invalidation defined',
  strategyMatch: 'Matches strategy',
};

function Checklist({ checklist, onToggle, checklistScore }) {
  return (
    <section className="card">
      <h2>Pre-Trade Checklist</h2>
      <p className="small-text">Checklist score: {checklistScore.toFixed(0)}%</p>
      <div className="checklist-grid">
        {checklistFieldKeys.map((key) => (
          <label key={key} className="check-item">
            <input type="checkbox" checked={Boolean(checklist[key])} onChange={() => onToggle(key)} />
            <span>{labels[key]}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

export default Checklist;
