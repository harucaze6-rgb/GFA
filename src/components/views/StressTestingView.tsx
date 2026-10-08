import React, { useState } from 'react';
import { StressScenario } from '../../types/market';
import { History, ShieldAlert, TrendingUp, TrendingDown, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface StressTestingViewProps {
  scenarios: StressScenario[];
}

export const StressTestingView: React.FC<StressTestingViewProps> = ({ scenarios }) => {
  const [selectedScenario, setSelectedScenario] = useState<StressScenario>(scenarios[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            HISTORICAL REGIME REPLAY • EMPIRICAL STRESS TESTS
          </span>
          <DataStatusBadge status="HISTORICAL" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <span>Historical Macro Stress Scenarios & Crisis Performance</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
          Evaluates actual empirical performance across pivotal macroeconomic crisis regimes, distinguishing global dollar gold from Rupee-hedged domestic Indian bullion returns.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((s) => {
          const isSelected = selectedScenario.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/40 shadow-lg text-slate-100'
                  : 'bg-[#121824] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-400 uppercase mb-1">
                {s.period}
              </div>
              <div className="font-bold text-xs truncate text-slate-100">
                {s.name}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span>Gold Return:</span>
                <span className={`font-bold ${s.goldResponsePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {s.goldResponsePct >= 0 ? `+${s.goldResponsePct}%` : `${s.goldResponsePct}%`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Inspector for Selected Stress Episode */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold font-mono text-slate-100">
              {selectedScenario.name}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Period: {selectedScenario.period}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Recovery Duration:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-bold">
              {selectedScenario.recoveryPeriodMonths} Months
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-mono mb-5 p-3 rounded-lg bg-[#141b2b] border border-slate-800">
          {selectedScenario.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono mb-5">
          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="text-slate-400 block mb-1">Gold Return</span>
            <span className={`text-xl font-bold ${
              selectedScenario.goldResponsePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {selectedScenario.goldResponsePct >= 0 ? `+${selectedScenario.goldResponsePct}%` : `${selectedScenario.goldResponsePct}%`}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">XAU/USD Spot</span>
          </div>

          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="text-slate-400 block mb-1">Indian Gold Return</span>
            <span className={`text-xl font-bold ${
              selectedScenario.inrGoldResponsePct >= 0 ? 'text-amber-300' : 'text-rose-400'
            }`}>
              {selectedScenario.inrGoldResponsePct >= 0 ? `+${selectedScenario.inrGoldResponsePct}%` : `${selectedScenario.inrGoldResponsePct}%`}
            </span>
            <span className="text-[10px] text-amber-400/80 block mt-0.5">Rupee Cushion</span>
          </div>

          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="text-slate-400 block mb-1">USD (DXY) Move</span>
            <span className={`text-xl font-bold ${
              selectedScenario.usdResponsePct >= 0 ? 'text-slate-100' : 'text-slate-400'
            }`}>
              {selectedScenario.usdResponsePct >= 0 ? `+${selectedScenario.usdResponsePct}%` : `${selectedScenario.usdResponsePct}%`}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Dollar Index</span>
          </div>

          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="text-slate-400 block mb-1">10Y Real Yield Shift</span>
            <span className={`text-xl font-bold ${
              selectedScenario.realYieldResponseBps >= 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {selectedScenario.realYieldResponseBps >= 0 ? `+${selectedScenario.realYieldResponseBps}` : selectedScenario.realYieldResponseBps} bps
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">TIPS Real Rate</span>
          </div>

          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="text-slate-400 block mb-1">Max Drawdown</span>
            <span className="text-xl font-bold text-rose-400">
              -{selectedScenario.maxDrawdownPct}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Peak-to-Trough</span>
          </div>

          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="text-slate-400 block mb-1">Annualized Vol</span>
            <span className="text-xl font-bold text-slate-200">
              {selectedScenario.realizedVolPct}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Realized Std Dev</span>
          </div>
        </div>

        {/* Underlying Institutional Drivers */}
        <div className="p-4 rounded-lg bg-[#121824] border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Institutional Market Transmission Catalysts:</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            {selectedScenario.keyDrivers.map((driver, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
