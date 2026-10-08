import React from 'react';
import { GoldPriceData, GoldUnit, Currency, DataSourceHealth } from '../../types/market';
import { 
  RefreshCw, 
  Wifi, 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Clock 
} from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface HeaderProps {
  priceData: GoldPriceData;
  realYield: number;
  dxy: number;
  vix: number;
  selectedUnit: GoldUnit;
  onUnitChange: (unit: GoldUnit) => void;
  selectedCurrency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  lastSyncTime: Date;
  isSyncing: boolean;
  onRefresh: () => void;
  refreshInterval: number;
  onRefreshIntervalChange: (sec: number) => void;
  dataHealthList: DataSourceHealth[];
  onOpenAIAnalyst: () => void;
  onNavigateToDataHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  priceData,
  realYield,
  dxy,
  vix,
  selectedUnit,
  onUnitChange,
  selectedCurrency,
  onCurrencyChange,
  lastSyncTime,
  isSyncing,
  onRefresh,
  refreshInterval,
  onRefreshIntervalChange,
  dataHealthList,
  onOpenAIAnalyst,
  onNavigateToDataHealth
}) => {
  const healthyCount = dataHealthList.filter(
    (s) => s.status === 'LIVE' || s.status === 'DELAYED' || s.status === 'HISTORICAL'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[#090d14]/95 backdrop-blur-md border-b border-slate-800 text-slate-200">
      {/* Upper Global Ticker Tape */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800/80 bg-[#0d121c] text-xs font-mono overflow-x-auto">
        <div className="flex items-center gap-6 shrink-0">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
              Au
            </div>
            <span className="font-bold text-slate-100 tracking-wider">AURUMINTEL</span>
            <span className="text-[10px] text-amber-400/90 font-medium px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/20">
              MACRO QUANT
            </span>
          </div>

          {/* Ticker: XAU/USD */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">XAU/USD:</span>
            <span className="font-bold text-slate-100">${priceData.xauUsd.value.toFixed(2)}</span>
            <span className={`text-[11px] font-semibold flex items-center ${
              (priceData.xauUsd.change1D ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {(priceData.xauUsd.change1D ?? 0) >= 0 ? '+' : ''}{(priceData.xauUsd.change1D ?? 0).toFixed(2)}%
            </span>
            <DataStatusBadge status={priceData.xauUsd.status} />
          </div>

          {/* Ticker: Indian Gold 24K */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">INR GOLD (10g):</span>
            <span className="font-bold text-amber-300">₹{priceData.inr10g24k.value.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">+{(priceData.inr10g24k.change1D ?? 0).toFixed(2)}%</span>
            <DataStatusBadge status={priceData.inr10g24k.status} />
          </div>

          {/* Ticker: USD/INR */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">USD/INR:</span>
            <span className="font-bold text-slate-100">{priceData.usdInr.value.toFixed(2)}</span>
            <span className="text-[11px] text-emerald-400">+{(priceData.usdInr.change1D ?? 0).toFixed(2)}%</span>
            <DataStatusBadge status={priceData.usdInr.status} />
          </div>

          {/* Ticker: DXY */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">DXY:</span>
            <span className="font-bold text-slate-100">{dxy.toFixed(2)}</span>
            <span className="text-[11px] text-rose-400">-0.15%</span>
          </div>

          {/* Ticker: 10Y Real Yield */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">US 10Y REAL:</span>
            <span className="font-bold text-slate-100">{realYield.toFixed(2)}%</span>
            <span className="text-[11px] text-emerald-400">-3 bps</span>
          </div>

          {/* Ticker: VIX */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">VIX:</span>
            <span className="font-bold text-slate-100">{vix.toFixed(1)}</span>
          </div>
        </div>

        {/* Global Data Health Button */}
        <button
          onClick={onNavigateToDataHealth}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors border border-slate-700/60 ml-4 shrink-0"
          title="Inspect institutional data feed status"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Health: {healthyCount}/{dataHealthList.length} Online</span>
        </button>
      </div>

      {/* Main Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Gold Unit:</span>
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
              {(['10g', '1g', '1kg', 'tola', 'oz'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => onUnitChange(unit)}
                  className={`px-2 py-0.5 rounded transition-colors uppercase ${
                    selectedUnit === unit
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Currency:</span>
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
              {(['INR', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedCurrency === curr
                      ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Sync status, Auto-refresh interval, AI button */}
        <div className="flex items-center gap-3">
          {/* Live Sync Status */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">Sync:</span>
            <span className="text-slate-300">{lastSyncTime.toLocaleTimeString()}</span>
          </div>

          {/* Refresh interval dropdown */}
          <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <select
              value={refreshInterval}
              onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
              <option value={0}>Manual</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-mono text-xs transition-colors border border-slate-700/60"
            title="Force immediate data synchronization"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* AI Market Analyst Trigger */}
          <button
            onClick={onOpenAIAnalyst}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-medium font-mono text-xs transition-colors border border-amber-500/40 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Analyst</span>
          </button>
        </div>
      </div>
    </header>
  );
};
