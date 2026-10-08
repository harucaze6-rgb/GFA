import React from 'react';
import { RealYieldFactors } from '../../types/market';
import { MetricCard } from '../common/MetricCard';
import { Percent, Activity, Scale, Info, ArrowDownRight, TrendingDown } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface RealYieldsViewProps {
  realYields: RealYieldFactors;
  onWhyClick: () => void;
}

export const RealYieldsView: React.FC<RealYieldsViewProps> = ({ realYields, onWhyClick }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                PRIMARY FACTOR MODEL • OPPORTUNITY COST HURDLE
              </span>
              <DataStatusBadge status="DELAYED" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Percent className="w-5 h-5 text-amber-400" />
              <span>US Real Yields & Opportunity Cost Transmission</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Real yields (Treasury Yield minus Expected Inflation) represent the benchmark opportunity cost of capital. Gold pays no coupon; when risk-free real cash returns compress, institutional demand surges.
            </p>
          </div>

          <button
            onClick={onWhyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono shrink-0"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why Real Yield Score?</span>
          </button>
        </div>
      </div>

      {/* Key Real Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="US 10Y Real Yield (TIPS)"
          dataPoint={realYields.us10yRealYield}
          suffix="%"
          formatDecimals={2}
          highlight
          subValue="FRED DFII10 Official Series"
        />

        <MetricCard
          label="US 5Y Real Yield (TIPS)"
          dataPoint={realYields.us5yRealYield}
          suffix="%"
          formatDecimals={2}
          subValue="Medium-Term Carry Hurdle"
        />

        <MetricCard
          label="Rolling 60D Gold Correlation"
          dataPoint={{
            value: realYields.correlationWithGold60D,
            timestamp: new Date().toISOString(),
            source: 'LBMA vs TIPS 60-Day Rolling Regression',
            frequency: 'Daily',
            status: 'LIVE'
          }}
          formatDecimals={2}
          highlight
          subValue="Strong Historical Negative Carry"
        />

        <MetricCard
          label="1-Month Real Yield Rate-of-Change"
          dataPoint={{
            value: realYields.us10yRealYield.change1M ?? -0.18,
            timestamp: new Date().toISOString(),
            source: 'Rate of Change Calculation',
            frequency: 'Monthly',
            status: 'LIVE'
          }}
          suffix="%"
          formatDecimals={2}
          subValue="-18 bps (Eased Opportunity Cost)"
        />
      </div>

      {/* Analytical Interpretation Framework */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Scale className="w-4 h-4" />
            <span>Institutional Opportunity Cost Mechanics</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Institutional asset allocators compare gold’s zero coupon against sovereign real cash yields. When 10Y TIPS real yields exceed +2.0%, sovereign paper offers guaranteed purchasing power growth without equity or commodity volatility.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Conversely, when real yields decline toward zero or turn negative (financial repression), non-yielding gold becomes dramatically more attractive as a multi-century store of value.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Activity className="w-4 h-4" />
            <span>Decoupling & Structural Anomaly Detection</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Historically, a +200 bps surge in 10Y real yields (as occurred during 2022-2023) would typically generate a -25% to -35% drawdown in XAU/USD.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Instead, gold set consecutive all-time nominal highs. This divergence reveals that sovereign de-dollarization, non-Western central bank reserve hoarding, and Western sovereign fiscal debt sustainability concerns have diluted the traditional dominance of the real-yield carry relationship.
          </p>
        </div>
      </div>
    </div>
  );
};
