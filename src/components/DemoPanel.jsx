function DemoPanel({ onLoadDemo, onExportCSV, onExportJSON, onClearAll }) {
  return (
    <section className="card">
      <h2>Export & Demo Controls</h2>
      <div className="button-row">
        <button className="btn" onClick={onLoadDemo}>
          Load Demo
        </button>
        <button className="btn" onClick={onExportCSV}>
          Export CSV
        </button>
        <button className="btn" onClick={onExportJSON}>
          Export JSON
        </button>
        <button className="btn btn-danger" onClick={onClearAll}>
          Clear All
        </button>
      </div>
    </section>
  );
}

export default DemoPanel;
