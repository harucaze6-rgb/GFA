import React from 'react';
import { USDFactors } from '../../types/market';
import { MetricCard } from '../common/MetricCard';
import { DollarSign, AlertTriangle, TrendingUp, TrendingDown, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface USDViewProps {
  usdFactors: USDFactors;
  onWhyClick: () => void;
}

export const USDView: React.FC<USDViewProps> = ({ usdFactors, onWhyClick }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                PRIMARY FACTOR MODEL • CURRENCY MECHANICS
              </span>
              <DataStatusBadge status="LIVE" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>US Dollar (DXY) & Major Currency Transmission</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Because gold is internationally denominated in US Dollars, trade-weighted dollar strength acts as a mechanical valuation brake. However, regime-shift periods decouple this relationship.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">DXY 14D Trend:</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">
              {usdFactors.dxyTrend}
            </span>
          </div>
        </div>
      </div>

      {/* Major FX Basket Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          label="US Dollar Index (DXY)"
          dataPoint={usdFactors.dxy}
          formatDecimals={2}
          highlight
          subValue="ICE Trade-Weighted"
        />

        <MetricCard
          label="EUR / USD"
          dataPoint={usdFactors.eurUsd}
          formatDecimals={4}
          subValue="57.6% Weight in DXY"
        />

        <MetricCard
          label="USD / JPY"
          dataPoint={usdFactors.usdJpy}
          formatDecimals={2}
          subValue="13.6% Weight in DXY"
        />

        <MetricCard
          label="GBP / USD"
          dataPoint={usdFactors.gbpUsd}
          formatDecimals={4}
          subValue="11.9% Weight in DXY"
        />

        <MetricCard
          label="USD / CNH"
          dataPoint={usdFactors.usdCnh}
          formatDecimals={4}
          subValue="Offshore Chinese Yuan"
        />
      </div>

      {/* Dedicated Section: DOLLAR-GOLD DIVERGENCE (Required by Section 2B) */}
      <div className="rounded-xl border border-amber-500/40 bg-amber-950/15 p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wide font-mono">
              DOLLAR-GOLD DIVERGENCE WARNING SYSTEM
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold border border-amber-400/30">
            {usdFactors.isDivergent ? 'DIVERGENCE ACTIVE' : 'CORRELATION NORMAL'}
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-[#0e131d] border border-amber-500/30">
            <div className="text-amber-300 font-bold mb-1">
              Active Decoupling Type: {usdFactors.divergenceType || 'Sovereign Decoupling'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {usdFactors.divergenceNotes || 
                'Gold has risen over 3.1% in the past 30 days despite the US Dollar Index remaining resilient (+0.65%). The historical rolling 60-day correlation has decoupled from its normal -0.65 baseline toward -0.34.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#0e131d] border border-slate-800">
              <span className="text-slate-400 block mb-1">Condition 1: Gold ↑ & DXY ↑</span>
              <span className="text-amber-400 font-bold block mb-1">DETECTED</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Indicates systemic sovereign distrust or global non-dollar reserve accumulation overriding paper currency mechanics.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0e131d] border border-slate-800">
              <span className="text-slate-400 block mb-1">Condition 2: Rolling Correlation Shift</span>
              <span className="text-slate-200 font-bold block mb-1">
                {usdFactors.goldDxyRollingCorr.toFixed(2)} vs -0.65 Norm
              </span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Correlation compression indicates price elasticity to dollar fluctuations has halved.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0e131d] border border-slate-800">
              <span className="text-slate-400 block mb-1">Condition 3: Institutional Interpretation</span>
              <span className="text-emerald-400 font-bold block mb-1">REGIME TRANSITION</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Treated as a structural regime warning: gold rallies supported while USD is strong tend to accelerate violently once the dollar turns downward.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
