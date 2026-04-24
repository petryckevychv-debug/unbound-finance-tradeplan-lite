import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import RiskCalculator from './components/RiskCalculator';
import TradeForm from './components/TradeForm';
import Checklist from './components/Checklist';
import StatsCards from './components/StatsCards';
import TradesTable from './components/TradesTable';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import DemoPanel from './components/DemoPanel';
import { mockTrades } from './data/mockTrades';
import {
  calculateChecklistScore,
  calculateRiskAmount,
  calculateTradeMetrics,
  calculateTradeScore,
  getMostCommonMistake,
  validateTrade,
} from './utils/calculations';
import { clearTrades, loadTrades, saveTrades } from './utils/storage';
import { exportTradesToCSV, exportTradesToJSON } from './utils/export';

const initialChecklist = {
  levelMarked: false,
  confirmation: false,
  stopDefined: false,
  takeProfitsDefined: false,
  riskOk: false,
  noFomo: false,
  invalidationDefined: false,
  strategyMatch: false,
};

const initialForm = {
  pair: '',
  direction: 'long',
  timeframe: '',
  setupType: '',
  entry: '',
  stopLoss: '',
  takeProfit1: '',
  takeProfit2: '',
  accountBalance: 10000,
  riskPercent: 1,
  confidence: 3,
  reason: '',
  invalidation: '',
  emotion: '',
  status: 'planned',
  resultR: '',
  mistake: '',
};

function App() {
  const [trades, setTrades] = useState([]);
  const [formState, setFormState] = useState(initialForm);
  const [checklist, setChecklist] = useState(initialChecklist);
  const [editingId, setEditingId] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTrades(loadTrades());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const checklistScore = useMemo(() => calculateChecklistScore(checklist), [checklist]);

  const riskPreview = useMemo(() => {
    const riskAmount = calculateRiskAmount(formState.accountBalance, formState.riskPercent);
    const { stopDistance, rr } = calculateTradeMetrics(formState);
    return { riskAmount, stopDistance, rr };
  }, [formState]);

  const stats = useMemo(() => {
    const totalTrades = trades.length;
    const plannedTrades = trades.filter((trade) => trade.status === 'planned').length;
    const openTrades = trades.filter((trade) => trade.status === 'open').length;
    const closedTradesList = trades.filter((trade) => trade.status === 'closed');
    const closedTrades = closedTradesList.length;
    const wins = closedTradesList.filter((trade) => Number(trade.resultR) > 0).length;
    const totalPnL = closedTradesList.reduce((sum, trade) => sum + Number(trade.resultR || 0), 0);

    return {
      totalTrades,
      plannedTrades,
      openTrades,
      closedTrades,
      winrate: closedTrades ? (wins / closedTrades) * 100 : 0,
      averageR: closedTrades ? totalPnL / closedTrades : 0,
      totalPnL,
      mostCommonMistake: getMostCommonMistake(trades),
    };
  }, [trades]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const updateTrades = (nextTrades) => {
    setTrades(nextTrades);
    saveTrades(nextTrades);
  };

  const handleFieldChange = (field, value) => setFormState((prev) => ({ ...prev, [field]: value }));

  const handleChecklistToggle = (key) => setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));

  const resetForm = () => {
    setFormState(initialForm);
    setChecklist(initialChecklist);
    setEditingId('');
  };

  const handleSaveTrade = () => {
    const errors = validateTrade(formState);
    if (errors.length) {
      showToast(errors[0], 'error');
      return;
    }

    const riskAmount = calculateRiskAmount(formState.accountBalance, formState.riskPercent);
    const { stopDistance, rr } = calculateTradeMetrics(formState);
    const tradeScore = calculateTradeScore({
      checklistScore,
      riskPercent: formState.riskPercent,
      confidence: formState.confidence,
      reason: formState.reason,
      invalidation: formState.invalidation,
      checklist,
    });

    const payload = {
      ...formState,
      id: editingId || `trade-${Date.now()}`,
      createdAt: editingId
        ? trades.find((trade) => trade.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      entry: Number(formState.entry),
      stopLoss: Number(formState.stopLoss),
      takeProfit1: Number(formState.takeProfit1),
      takeProfit2: Number(formState.takeProfit2 || 0),
      accountBalance: Number(formState.accountBalance),
      riskPercent: Number(formState.riskPercent),
      confidence: Number(formState.confidence),
      resultR: formState.resultR === '' ? '' : Number(formState.resultR),
      riskAmount,
      stopDistance,
      rr,
      checklist: { ...checklist },
      checklistScore,
      tradeScore,
      source: 'User',
    };

    const nextTrades = editingId
      ? trades.map((trade) => (trade.id === editingId ? payload : trade))
      : [payload, ...trades];

    updateTrades(nextTrades);
    showToast(editingId ? 'Trade updated successfully.' : 'Trade saved successfully.', 'success');
    resetForm();
  };

  const handleLoadDemo = () => {
    const enriched = mockTrades.map((trade) => {
      const riskAmount = calculateRiskAmount(trade.accountBalance, trade.riskPercent);
      const { stopDistance, rr } = calculateTradeMetrics(trade);
      const demoChecklistScore = calculateChecklistScore(trade.checklist);
      return {
        ...trade,
        riskAmount,
        stopDistance,
        rr,
        checklistScore: demoChecklistScore,
        tradeScore: calculateTradeScore({
          checklistScore: demoChecklistScore,
          riskPercent: trade.riskPercent,
          confidence: trade.confidence,
          reason: trade.reason,
          invalidation: trade.invalidation,
          checklist: trade.checklist,
        }),
      };
    });

    updateTrades(enriched);
    showToast('Demo data loaded.', 'success');
  };

  const handleDeleteTrade = (tradeId) => {
    updateTrades(trades.filter((trade) => trade.id !== tradeId));
    showToast('Trade deleted.', 'success');
  };

  const handleEditTrade = (trade) => {
    setEditingId(trade.id);
    setFormState({
      pair: trade.pair,
      direction: trade.direction,
      timeframe: trade.timeframe,
      setupType: trade.setupType,
      entry: trade.entry,
      stopLoss: trade.stopLoss,
      takeProfit1: trade.takeProfit1,
      takeProfit2: trade.takeProfit2,
      accountBalance: trade.accountBalance,
      riskPercent: trade.riskPercent,
      confidence: trade.confidence,
      reason: trade.reason,
      invalidation: trade.invalidation,
      emotion: trade.emotion,
      status: trade.status,
      resultR: trade.resultR,
      mistake: trade.mistake,
    });
    setChecklist(trade.checklist || initialChecklist);
    showToast('Trade loaded into form.', 'success');
  };

  const handleMarkClosed = (trade) => {
    const resultRInput = window.prompt('Enter Result R value (example: 1.5, -1, 0):', trade.resultR || '');
    if (resultRInput === null) return;

    const mistakeInput = window.prompt('Add mistake note (optional):', trade.mistake || '');
    if (mistakeInput === null) return;

    const resultR = resultRInput === '' ? '' : Number(resultRInput);
    const updated = {
      ...trade,
      status: 'closed',
      resultR: Number.isNaN(resultR) ? '' : resultR,
      mistake: mistakeInput,
    };

    updateTrades(trades.map((item) => (item.id === trade.id ? updated : item)));
    showToast('Trade marked as closed.', 'success');
  };

  const handleExportCSV = () => {
    if (!trades.length) {
      showToast('No trades to export.', 'error');
      return;
    }
    exportTradesToCSV(trades);
    showToast('CSV export complete.', 'success');
  };

  const handleExportJSON = () => {
    if (!trades.length) {
      showToast('No trades to export.', 'error');
      return;
    }
    exportTradesToJSON(trades);
    showToast('JSON export complete.', 'success');
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all trades from localStorage?')) return;
    clearTrades();
    setTrades([]);
    resetForm();
    showToast('All trades cleared.', 'success');
  };

  return (
    <div className="app-shell">
      <Header />

      <section className="card hero">
        <h2>Unbound Finance TradePlan Lite</h2>
        <p>
          A lightweight trading journal and risk calculator for crypto traders who want to trade with a plan,
          not with emotions.
        </p>
      </section>

      <div className="two-col">
        <RiskCalculator riskPreview={riskPreview} />
        <Checklist checklist={checklist} onToggle={handleChecklistToggle} checklistScore={checklistScore} />
      </div>

      <TradeForm
        formState={formState}
        onChange={handleFieldChange}
        onSave={handleSaveTrade}
        onReset={resetForm}
        editingId={editingId}
      />

      <StatsCards stats={stats} />

      {trades.length ? (
        <TradesTable
          trades={trades}
          onDelete={handleDeleteTrade}
          onEdit={handleEditTrade}
          onMarkClosed={handleMarkClosed}
        />
      ) : (
        <EmptyState />
      )}

      <DemoPanel
        onLoadDemo={handleLoadDemo}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onClearAll={handleClearAll}
      />

      <footer className="footer">
        Unbound Finance TradePlan Lite is not financial advice. It does not provide trading signals or profit
        guarantees. Use it as a planning and journaling tool.
      </footer>

      <Toast toast={toast} />
    </div>
  );
}

export default App;
