import React, { useState } from 'react';
import { Sliders, RotateCcw, ArrowRight, Activity, TrendingUp, TrendingDown, Scale } from 'lucide-react';

export const ScenariosView: React.FC = () => {
  const [fedDeltaBps, setFedDeltaBps] = useState<number>(-25);
  const [realYieldDeltaBps, setRealYieldDeltaBps] = useState<number>(-20);
  const [dxyDeltaPct, setDxyDeltaPct] = useState<number>(-1.5);
  const [inflationDeltaPct, setInflationDeltaPct] = useState<number>(0.2);
  const [growthDeltaPct, setGrowthDeltaPct] = useState<number>(-0.5);
  const [geoDeltaPts, setGeoDeltaPts] = useState<number>(10);
  const [inrDeltaPct, setInrDeltaPct] = useState<number>(1.2);
  const [cbDeltaPct, setCbDeltaPct] = useState<number>(5);

  const resetScenarios = () => {
    setFedDeltaBps(0);
    setRealYieldDeltaBps(0);
    setDxyDeltaPct(0);
    setInflationDeltaPct(0);
    setGrowthDeltaPct(0);
    setGeoDeltaPts(0);
    setInrDeltaPct(0);
    setCbDeltaPct(0);
  };

  // Compute simulated factor shifts
  const globalImpactScore = Math.round(
    (-realYieldDeltaBps * 0.45) +
    (-dxyDeltaPct * 5.2) +
    (inflationDeltaPct * 8.0) +
    (-growthDeltaPct * 6.0) +
    (geoDeltaPts * 0.4) +
    (cbDeltaPct * 0.8)
  );

  const currencyImpactScore = Math.round(inrDeltaPct * 7.5);
  const indianImpactScore = Math.round(globalImpactScore * 0.7 + currencyImpactScore * 0.3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                HYPOTHETICAL RISK SIMULATION • WHAT-IF SCENARIOS
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Macro Parameter Scenario Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Adjust forward macroeconomic assumptions to simulate directional transmission through global spot gold, currency mechanics (USD/INR), and Indian landed gold environment.
            </p>
          </div>

          <button
            onClick={resetScenarios}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Outcome Output Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Global Gold Outlook */}
        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800">
          <div className="text-slate-400 mb-1">Global Gold Environment</div>
          <div className={`text-2xl font-bold mt-1 ${
            globalImpactScore > 15 ? 'text-emerald-400' : globalImpactScore < -15 ? 'text-rose-400' : 'text-slate-300'
          }`}>
            {globalImpactScore > 15 ? 'FAVORABLE / SUPPORTIVE' : globalImpactScore < -15 ? 'HEADWIND / PRESSURE' : 'NEUTRAL / BALANCED'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Simulated Global Score Shift: <b className="text-slate-200">{globalImpactScore > 0 ? `+${globalImpactScore}` : globalImpactScore} pts</b>
          </div>
        </div>

        {/* Currency Transmission */}
        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800">
          <div className="text-slate-400 mb-1">USD/INR Transmission Effect</div>
          <div className={`text-2xl font-bold mt-1 ${
            inrDeltaPct > 0 ? 'text-amber-300' : inrDeltaPct < 0 ? 'text-blue-300' : 'text-slate-300'
          }`}>
            {inrDeltaPct > 0 ? 'RUPEE TAILWIND' : inrDeltaPct < 0 ? 'RUPEE DRAG' : 'NEUTRAL CURRENCY'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Currency Cushion Contribution: <b className="text-slate-200">{currencyImpactScore > 0 ? `+${currencyImpactScore}` : currencyImpactScore} pts</b>
          </div>
        </div>

        {/* Final Indian Market Environment */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 shadow-lg">
          <div className="text-amber-300/80 mb-1">Final Indian Gold Environment</div>
          <div className={`text-2xl font-bold mt-1 ${
            indianImpactScore > 15 ? 'text-amber-300' : indianImpactScore < -15 ? 'text-rose-400' : 'text-slate-300'
          }`}>
            {indianImpactScore > 15 ? 'HIGHLY CONSTRUCTIVE' : indianImpactScore < -15 ? 'RESTRICTIVE' : 'STABLE HARMONY'}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            Combined Domestic Shift: <b className="text-amber-200">{indianImpactScore > 0 ? `+${indianImpactScore}` : indianImpactScore} pts</b>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide mb-4 pb-2 border-b border-slate-800 font-mono">
          Independent Macroeconomic Variable Adjusters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          {/* Fed Rate Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Fed Rate Shift:</span>
              <span className="font-bold text-amber-400">{fedDeltaBps > 0 ? `+${fedDeltaBps}` : fedDeltaBps} bps</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="25"
              value={fedDeltaBps}
              onChange={(e) => setFedDeltaBps(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-100 bps (Easing)</span>
              <span>+100 bps (Hikes)</span>
            </div>
          </div>

          {/* Real Yield Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>10Y Real Yield:</span>
              <span className="font-bold text-amber-400">{realYieldDeltaBps > 0 ? `+${realYieldDeltaBps}` : realYieldDeltaBps} bps</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="5"
              value={realYieldDeltaBps}
              onChange={(e) => setRealYieldDeltaBps(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-100 bps (Bullish)</span>
              <span>+100 bps (Bearish)</span>
            </div>
          </div>

          {/* DXY Dollar Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>DXY Dollar Shift:</span>
              <span className="font-bold text-amber-400">{dxyDeltaPct > 0 ? `+${dxyDeltaPct.toFixed(1)}` : dxyDeltaPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={dxyDeltaPct}
              onChange={(e) => setDxyDeltaPct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-10% (USD Weaker)</span>
              <span>+10% (USD Surge)</span>
            </div>
          </div>

          {/* Inflation Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Inflation Rate Shift:</span>
              <span className="font-bold text-amber-400">{inflationDeltaPct > 0 ? `+${inflationDeltaPct.toFixed(1)}` : inflationDeltaPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={inflationDeltaPct}
              onChange={(e) => setInflationDeltaPct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-2.0% (Disinflation)</span>
              <span>+2.0% (Reflation)</span>
            </div>
          </div>

          {/* Growth Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>GDP Growth Delta:</span>
              <span className="font-bold text-amber-400">{growthDeltaPct > 0 ? `+${growthDeltaPct.toFixed(1)}` : growthDeltaPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.2"
              value={growthDeltaPct}
              onChange={(e) => setGrowthDeltaPct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-3.0% (Slowdown)</span>
              <span>+3.0% (Boom)</span>
            </div>
          </div>

          {/* Geopolitics Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Geopolitical Risk:</span>
              <span className="font-bold text-amber-400">{geoDeltaPts > 0 ? `+${geoDeltaPts}` : geoDeltaPts} pts</span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={geoDeltaPts}
              onChange={(e) => setGeoDeltaPts(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-30 (De-escalation)</span>
              <span>+50 (Acute Crisis)</span>
            </div>
          </div>

          {/* USD/INR Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>USD/INR Exchange:</span>
              <span className="font-bold text-amber-400">{inrDeltaPct > 0 ? `+${inrDeltaPct.toFixed(1)}` : inrDeltaPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="-8"
              max="10"
              step="0.5"
              value={inrDeltaPct}
              onChange={(e) => setInrDeltaPct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-8% (Rupee Rally)</span>
              <span>+10% (Rupee Drops)</span>
            </div>
          </div>

          {/* Central Bank Demand Delta */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Central Bank Accumulation:</span>
              <span className="font-bold text-amber-400">{cbDeltaPct > 0 ? `+${cbDeltaPct}` : cbDeltaPct}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="5"
              value={cbDeltaPct}
              onChange={(e) => setCbDeltaPct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-20% (Slowdown)</span>
              <span>+30% (Aggressive)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
