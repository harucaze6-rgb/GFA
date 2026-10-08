import React from 'react';
import { PositioningFlows } from '../../types/market';
import { MetricCard } from '../common/MetricCard';
import { Layers, AlertTriangle, TrendingUp, TrendingDown, ArrowDownRight, Compass } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface FlowsPositioningViewProps {
  positioning: PositioningFlows;
}

export const FlowsPositioningView: React.FC<FlowsPositioningViewProps> = ({ positioning }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                PRIMARY FACTOR MODEL • DERIVATIVES & ETF FLOWS
              </span>
              <DataStatusBadge status="DELAYED" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Investment Flows & CFTC Market Positioning</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Evaluates institutional liquidity through physical ETF tonnage holdings (GLD, IAU) alongside speculative hedge fund futures exposure from the CFTC Commitments of Traders (COT).
            </p>
          </div>

          {positioning.isPositioningExtreme && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Extreme Long Speculation Alert</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Global ETF Gold Holdings"
          dataPoint={positioning.goldEtfHoldingsTonnes}
          formatDecimals={1}
          suffix=" t"
          highlight
          subValue="Consolidated Physical Vaults"
        />

        <MetricCard
          label="Weekly ETF Net Flow"
          dataPoint={positioning.weeklyEtfFlowTonnes}
          formatDecimals={1}
          suffix=" t"
          subValue="Institutional Fund Shifts"
        />

        <MetricCard
          label="CFTC Speculative Net Longs"
          dataPoint={positioning.cftcNetSpeculativeContracts}
          formatDecimals={0}
          suffix=" ctr"
          highlight
          subValue={`${positioning.speculativePercentile5Y}th Percentile (Crowded)`}
        />

        <MetricCard
          label="Commercial Hedgers Net"
          dataPoint={positioning.cftcCommercialNetContracts}
          formatDecimals={0}
          suffix=" ctr"
          subValue="Producer / Swap Dealer Hedging"
        />
      </div>

      {/* Flow & Positioning Divergence Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>Positioning Divergence Intelligence</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {positioning.divergenceNotes ||
              'Speculative net long positions currently stand at the 86th percentile of the 5-year range. While momentum remains distinctly bullish, extreme consensus positioning elevates susceptibility to sharp liquidation flushes on hawkish macro surprises.'}
          </p>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            Rule: Extreme positioning is an informational risk filter, never an automatic contrarian sell trigger without technical breakdown.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>ETF Institutional Flow Regime</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Global physical gold ETFs have recorded net additions (+14.8 tonnes weekly). Following a prolonged 2022-2023 de-allocation period, Western retail and wealth managers have begun re-entering physical products as policy easing cycles crystallize.
          </p>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            Key Insight: When ETF flows align positively with central bank buying, structural bull market momentum is at its highest institutional velocity.
          </div>
        </div>
      </div>
    </div>
  );
};
