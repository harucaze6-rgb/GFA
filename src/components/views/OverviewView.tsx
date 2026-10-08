import React from 'react';
import { 
  GoldPriceData, 
  MarketRegimeState, 
  FactorScoreItem, 
  DivergenceEvent, 
  EconomicCalendarEvent, 
  DataSourceHealth, 
  GoldUnit, 
  Currency 
} from '../../types/market';
import { MetricCard } from '../common/MetricCard';
import { WaterfallFactorChart } from '../charts/WaterfallFactorChart';
import { DataStatusBadge } from '../common/DataStatusBadge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Compass, 
  ArrowUpRight, 
  Layers, 
  Info,
  Scale
} from 'lucide-react';

interface OverviewViewProps {
  priceData: GoldPriceData;
  regimeState: MarketRegimeState;
  factors: FactorScoreItem[];
  divergences: DivergenceEvent[];
  upcomingEvents: EconomicCalendarEvent[];
  dataHealthList: DataSourceHealth[];
  selectedUnit: GoldUnit;
  selectedCurrency: Currency;
  onWhyClick: (factor: FactorScoreItem) => void;
  onNavigateToView: (view: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  priceData,
  regimeState,
  factors,
  divergences,
  upcomingEvents,
  dataHealthList,
  selectedUnit,
  selectedCurrency,
  onWhyClick,
  onNavigateToView
}) => {
  const healthyCount = dataHealthList.filter(
    (s) => s.status === 'LIVE' || s.status === 'DELAYED' || s.status === 'HISTORICAL'
  ).length;

  return (
    <div className="space-y-5">
      {/* Top Layer 1: Core Ticker Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="XAU/USD Spot"
          dataPoint={priceData.xauUsd}
          prefix="$"
          formatDecimals={2}
          highlight
          subValue={`52W: $${priceData.low52W.toFixed(0)} - $${priceData.high52W.toFixed(0)}`}
        />

        <MetricCard
          label={`Indian Gold (${selectedUnit})`}
          dataPoint={priceData.inr10g24k}
          prefix="₹"
          formatDecimals={0}
          highlight
          subValue="IBJA 24K 999 Benchmark"
        />

        <MetricCard
          label="USD / INR FX"
          dataPoint={priceData.usdInr}
          prefix="₹"
          formatDecimals={2}
          subValue="RBI Reference Corridor"
        />

        <MetricCard
          label="US 10Y Real Yield"
          dataPoint={{
            value: 1.94,
            timestamp: new Date().toISOString(),
            source: 'FRED DFII10 (TIPS)',
            frequency: 'Daily',
            status: 'DELAYED',
            change1D: -0.03,
            percentile5Y: 84
          }}
          suffix="%"
          formatDecimals={2}
          subValue="TIPS Hurdle Rate"
        />

        <MetricCard
          label="US Dollar (DXY)"
          dataPoint={{
            value: 103.85,
            timestamp: new Date().toISOString(),
            source: 'ICE DXY Benchmark',
            frequency: 'Continuous',
            status: 'DELAYED',
            change1D: -0.15,
            percentile5Y: 71
          }}
          formatDecimals={2}
          subValue="Trade Weighted Index"
        />

        <MetricCard
          label="VIX Volatility"
          dataPoint={{
            value: 15.40,
            timestamp: new Date().toISOString(),
            source: 'CBOE Volatility Index',
            frequency: 'Continuous',
            status: 'LIVE',
            change1D: -1.2,
            percentile5Y: 38
          }}
          formatDecimals={2}
          subValue="Equity Options Variance"
        />
      </div>

      {/* Central Major Panel: Gold Market Regime */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5 shadow-xl relative overflow-hidden">
        {/* Subtle ambient accent based on regime */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none ${
          regimeState.macroScore > 20 ? 'bg-amber-400' : regimeState.macroScore < -20 ? 'bg-rose-500' : 'bg-blue-500'
        }`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                CENTRAL FACTOR ENGINE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                Updated {new Date(regimeState.lastUpdated).toLocaleTimeString()}
              </span>
              <DataStatusBadge status="ESTIMATED" />
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold font-mono text-slate-100 flex items-center gap-3">
              <span>REGIME: {regimeState.regime}</span>
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {regimeState.description}
            </p>
          </div>

          {/* Tri-Score Pill Array */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Global Macro Score */}
            <div className="p-3 rounded-lg bg-[#141a27] border border-slate-800 min-w-[130px]">
              <div className="text-[11px] text-slate-400 font-mono">Composite Macro</div>
              <div className={`text-2xl font-bold font-mono mt-0.5 ${
                regimeState.macroScore > 0 ? 'text-emerald-400' : regimeState.macroScore < 0 ? 'text-rose-400' : 'text-slate-200'
              }`}>
                {regimeState.macroScore > 0 ? `+${regimeState.macroScore}` : regimeState.macroScore}
                <span className="text-xs text-slate-500 font-normal"> / 100</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Confidence: <b className="text-slate-300">{regimeState.confidencePct}%</b>
              </div>
            </div>

            {/* Global Gold Score */}
            <div className="p-3 rounded-lg bg-[#141a27] border border-slate-800 min-w-[130px]">
              <div className="text-[11px] text-slate-400 font-mono">Global Gold Score</div>
              <div className={`text-2xl font-bold font-mono mt-0.5 ${
                regimeState.globalGoldScore > 0 ? 'text-emerald-400' : regimeState.globalGoldScore < 0 ? 'text-rose-400' : 'text-slate-200'
              }`}>
                {regimeState.globalGoldScore > 0 ? `+${regimeState.globalGoldScore}` : regimeState.globalGoldScore}
                <span className="text-xs text-slate-500 font-normal"> / 100</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Excl. Domestic FX
              </div>
            </div>

            {/* India Gold Score */}
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 min-w-[130px]">
              <div className="text-[11px] text-amber-300/80 font-mono">India Gold Score</div>
              <div className={`text-2xl font-bold font-mono mt-0.5 ${
                regimeState.indiaGoldScore > 0 ? 'text-amber-300' : 'text-rose-400'
              }`}>
                {regimeState.indiaGoldScore > 0 ? `+${regimeState.indiaGoldScore}` : regimeState.indiaGoldScore}
                <span className="text-xs text-amber-500/70 font-normal"> / 100</span>
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">
                Compounded with INR
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Implications Strip */}
        <div className="mt-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="font-semibold text-amber-400 font-mono uppercase block mb-1">
              Tactical Positioning Implications:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {regimeState.implicationsForTraders}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
            <span className="font-semibold text-blue-400 font-mono uppercase block mb-1">
              Strategic Portfolio Allocation:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {regimeState.implicationsForInvestors}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Factor Attribution Waterfall & Market Divergences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Factor Attribution Waterfall (7 cols) */}
        <div className="lg:col-span-7">
          <WaterfallFactorChart
            factors={factors}
            totalScore={regimeState.macroScore}
            onWhyClick={onWhyClick}
          />
        </div>

        {/* Market Divergences & Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-4 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Active Market Divergences ({divergences.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateToView('usd')}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
              >
                Inspect All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
              {divergences.map((div) => (
                <div 
                  key={div.id}
                  className="p-3 rounded-lg bg-[#121824] border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-xs text-slate-100">{div.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                      div.magnitude === 'SIGNIFICANT' || div.magnitude === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {div.magnitude}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {div.interpretation}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
                    <span>Observed: {div.observedRelationship}</span>
                    <span className="text-amber-400 font-semibold">{div.confidence}% Conf</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Upcoming Catalysts & Data Quality Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Upcoming Economic Events (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Upcoming High-Impact Catalysts
                </h3>
              </div>
              <button
                onClick={() => onNavigateToView('calendar')}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
              >
                Full Calendar <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div 
                  key={event.id}
                  className="p-2.5 rounded-lg bg-[#121824] border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400 shrink-0">{event.date}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 uppercase">
                      {event.country}
                    </span>
                    <span className="font-semibold text-slate-200">{event.event}</span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                    <div className="text-slate-400">
                      Cons: <b className="text-slate-200">{event.consensus}</b>
                    </div>
                    <div className="text-slate-400">
                      Prev: <b className="text-slate-300">{event.previous}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Data Health & Provenance (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                    Data Lineage & Status
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToView('data-health')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                >
                  Sources <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {dataHealthList.slice(0, 4).map((src) => (
                  <div key={src.id} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-[#121824] border border-slate-800/80">
                    <span className="text-slate-300 truncate max-w-[220px]" title={src.name}>
                      {src.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{src.latencyMs}ms</span>
                      <DataStatusBadge status={src.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Operational: {healthyCount}/{dataHealthList.length} Connected</span>
              <span className="text-emerald-400">99.8% Reliability SLA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
