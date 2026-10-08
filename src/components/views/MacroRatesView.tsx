import React from 'react';
import { 
  RealYieldFactors, 
  InflationFactors, 
  LaborFactors, 
  GrowthFactors 
} from '../../types/market';
import { MetricCard } from '../common/MetricCard';
import { 
  Landmark, 
  Percent, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Briefcase, 
  BarChart3, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface MacroRatesViewProps {
  realYields: RealYieldFactors;
  inflation: InflationFactors;
  labor: LaborFactors;
  growth: GrowthFactors;
}

export const MacroRatesView: React.FC<MacroRatesViewProps> = ({
  realYields,
  inflation,
  labor,
  growth
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            PRIMARY FACTOR MODEL • MACRO & RATES
          </span>
          <DataStatusBadge status="DELAYED" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-400" />
          <span>Monetary Policy, Treasury Curve & Macro Fundamentals</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
          Tracks interest rate structures, 4-quadrant inflation regimes, labor market deterioration metrics, and economic growth surprise momentum.
        </p>
      </div>

      {/* Yield Curve Structure & Policy Expectations */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
              U.S. Treasury Term Structure & Yield Curve
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            2s10s Slope: <b className="text-emerald-400">+{((realYields.yieldCurve2s10s.value ?? 0.1) * 100).toFixed(0)} bps</b> (Dis-inverting)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            label="Fed Funds Upper"
            dataPoint={realYields.fedRate}
            suffix="%"
            formatDecimals={2}
            subValue="FOMC Target Rate"
          />

          <MetricCard
            label="US 2Y Yield"
            dataPoint={realYields.us2yYield}
            suffix="%"
            formatDecimals={2}
            subValue="Policy Expectation Proxy"
          />

          <MetricCard
            label="US 5Y Yield"
            dataPoint={realYields.us5yYield}
            suffix="%"
            formatDecimals={2}
            subValue="Medium-Term Duration"
          />

          <MetricCard
            label="US 10Y Nominal"
            dataPoint={realYields.us10yYield}
            suffix="%"
            formatDecimals={2}
            subValue="Global Risk-Free Rate"
          />

          <MetricCard
            label="US 30Y Bond"
            dataPoint={realYields.us30yYield}
            suffix="%"
            formatDecimals={2}
            subValue="Long-Term Fiscal Premium"
          />

          <MetricCard
            label="Next FOMC Cut Prob"
            dataPoint={{
              value: realYields.rateCutProbNextFOMC,
              timestamp: new Date().toISOString(),
              source: 'CME FedWatch Futures Tool',
              frequency: 'Continuous',
              status: 'LIVE'
            }}
            suffix="%"
            formatDecimals={1}
            highlight
            subValue="Pricing 25 bps Rate Cut"
          />
        </div>
      </div>

      {/* 4-Quadrant Inflation Regime Engine */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Inflation & Real Yield 4-Quadrant Regime
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-bold border border-amber-500/30">
            {inflation.regime}
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#141b2b] border border-slate-800 mb-4 text-xs font-mono">
          <div className="text-amber-400 font-bold mb-1">Active Macro Regime Assessment:</div>
          <p className="text-slate-300 leading-relaxed">
            {inflation.regimeDescription}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <MetricCard
            label="Headline CPI YoY"
            dataPoint={inflation.cpiYoY}
            suffix="%"
            formatDecimals={1}
            subValue="BLS Headline Print"
          />

          <MetricCard
            label="Core CPI YoY"
            dataPoint={inflation.coreCpiYoY}
            suffix="%"
            formatDecimals={1}
            subValue="Ex Food & Energy"
          />

          <MetricCard
            label="Headline PCE YoY"
            dataPoint={inflation.pceYoY}
            suffix="%"
            formatDecimals={1}
            subValue="Fed Official Target Metric"
          />

          <MetricCard
            label="Core PCE YoY"
            dataPoint={inflation.corePceYoY}
            suffix="%"
            formatDecimals={1}
            subValue="Sticky Consumption Basket"
          />

          <MetricCard
            label="10Y Breakeven Inflation"
            dataPoint={inflation.breakeven10Y}
            suffix="%"
            formatDecimals={2}
            highlight
            subValue="Market Implied Inflation"
          />
        </div>
      </div>

      {/* Labor & Economic Growth Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Labor Deterioration Index */}
        <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                U.S. Labor Market Pressure
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Momentum: {labor.momentum}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#121824] border border-slate-800 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Labor Deterioration Score:</span>
              <span className="font-bold text-amber-300 text-sm">
                {labor.laborDeteriorationScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Nonfarm Payrolls (MoM)"
                dataPoint={labor.nfp}
                formatDecimals={0}
                subValue="BLS Employment Situation"
              />

              <MetricCard
                label="Unemployment Rate"
                dataPoint={labor.unemploymentRate}
                suffix="%"
                formatDecimals={1}
                subValue="Sahm Rule Trigger Watch"
              />
            </div>
          </div>
        </div>

        {/* Growth & Recession Risk Proxy */}
        <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                Growth & Recession Probability
              </h3>
            </div>
            <span className="text-xs font-mono text-purple-400">
              State: {growth.growthMomentum}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#121824] border border-slate-800 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Recession-Risk Proxy:</span>
              <span className="font-bold text-slate-200 text-sm">
                {growth.recessionRiskProxyPct}% Prob
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="US Real GDP (Annualized)"
                dataPoint={growth.usGdpQoQAnnualized}
                suffix="%"
                formatDecimals={1}
                subValue="BEA Quarterly Print"
              />

              <MetricCard
                label="ISM Manufacturing PMI"
                dataPoint={growth.ismManufacturingPmi}
                formatDecimals={1}
                subValue="50 = Expansion Line"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
