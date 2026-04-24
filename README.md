# Unbound Finance TradePlan Lite

Unbound Finance TradePlan Lite is a lightweight local trading journal and risk calculator for crypto traders.
It helps traders plan trades before entering by tracking pair, direction, entry, stop loss, take profits,
risk, R:R, reasoning, invalidation, emotions, and discipline checklist.

This product is built by **Unbound Finance**.

## Features

- Vite + React + JavaScript + CSS only
- No backend, no Docker, no database, and no paid APIs
- Uses localStorage with key: `unbound_finance_tradeplan_trades`
- Save, edit, delete, and close trade plans
- Built-in demo loader with 6 Unbound Finance demo trades
- CSV export: `unbound-finance-tradeplan-trades.csv`
- JSON export: `unbound-finance-tradeplan-backup.json`
- Risk calculator, checklist score, and trade score (0 to 10)
- Stats cards: trade counts, winrate, average R, total PnL in R, most common mistake

## Install instructions

```bash
npm install
```

## Launch instructions (development)

```bash
npm run dev
```

## Production build instructions

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## How to test it

1. Start the app with `npm run dev`.
2. Create a trade and click **Save Trade**.
3. Reload the page and confirm data persists from localStorage.
4. Click **Load Demo** and verify 6 demo trades are loaded.
5. Test **Edit Trade**, **Delete Trade**, and **Mark Closed** actions in the table.
6. Click **Export CSV** and **Export JSON** to verify downloads.
7. Click **Clear All** and confirm all trades are removed.
8. Test on narrow screen width to confirm responsive layout.

## Terminal commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Financial disclaimer

Unbound Finance TradePlan Lite is not financial advice.
It does not provide trading signals or profit guarantees.
Use it only as a planning, risk-management, and journaling tool.
