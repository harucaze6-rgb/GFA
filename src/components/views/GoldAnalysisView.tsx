import React, { useState } from 'react';
import { GoldPriceData, TechnicalTimeframeAnalysis } from '../../types/market';
import { InteractiveCandleChart } from '../charts/InteractiveCandleChart';
import { MetricCard } from '../common/MetricCard';
import { getInitialTimeframeAnalysis } from '../../services/marketDataProvider';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart2, 
  ShieldAlert, 
  Compass, 
  Layers, 
  Sliders 
} from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface GoldAnalysisViewProps {
  priceData: GoldPriceData;
}

export const GoldAnalysisView: React.FC<GoldAnalysisViewProps> = ({ priceData }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1D');
  const timeframeData = getInitialTimeframeAnalysis(priceData.xauUsd.value);
  const currentTfData = timeframeData[activeTimeframe] || timeframeData['1D'];

  return (
    <div className="space-y-6">
      {/* Top Technical Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="ATR (14-Day)"
          dataPoint={{
            value: priceData.atr14,
            timestamp: new Date().toISOString(),
            source: 'Average True Range (14 Periods)',
            frequency: 'Daily',
            status: 'LIVE'
          }}
          prefix="$"
          formatDecimals={2}
          subValue="Expected Daily Range"
        />

        <MetricCard
          label="30D Realized Vol"
          dataPoint={{
            value: priceData.realizedVol30D,
            timestamp: new Date().toISOString(),
            source: 'Annualized 30-Day Volatility',
            frequency: 'Daily',
            status: 'LIVE',
            percentile5Y: 48
          }}
          suffix="%"
          formatDecimals={1}
          subValue="Historical Norm: 15.2%"
        />

        <MetricCard
          label="Distance from 52W High"
          dataPoint={{
            value: priceData.distanceFromHighPct,
            timestamp: new Date().toISOString(),
            source: `ATH: $${priceData.high52W.toFixed(0)}`,
            frequency: 'Continuous',
            status: 'LIVE'
          }}
          suffix="%"
          formatDecimals={2}
          subValue={`52W High: $${priceData.high52W.toFixed(0)}`}
        />

        <MetricCard
          label="Distance from 52W Low"
          dataPoint={{
            value: priceData.distanceFromLowPct,
            timestamp: new Date().toISOString(),
            source: `52W Low: $${priceData.low52W.toFixed(0)}`,
            frequency: 'Continuous',
            status: 'LIVE'
          }}
          prefix="+"
          suffix="%"
          formatDecimals={2}
          subValue={`52W Low: $${priceData.low52W.toFixed(0)}`}
        />

        <MetricCard
          label="24h Estimated Volume"
          dataPoint={{
            value: priceData.volume24h,
            timestamp: new Date().toISOString(),
            source: 'Consolidated Global Bullion Flow',
            frequency: 'Continuous',
            status: 'ESTIMATED'
          }}
          formatDecimals={0}
          suffix=" oz"
          subValue="Institutional Liquidity"
        />

        <MetricCard
          label="COMEX Open Interest"
          dataPoint={{
            value: priceData.openInterest ?? 482100,
            timestamp: new Date().toISOString(),
            source: 'CME COMEX Gold Futures',
            frequency: 'Daily End of Day',
            status: 'DELAYED'
          }}
          formatDecimals={0}
          suffix=" ctr"
          subValue="Derivatives Exposure"
        />
      </div>

      {/* Main Interactive Candlestick Chart */}
      <InteractiveCandleChart
        currentPrice={priceData.xauUsd.value}
        activeTimeframe={activeTimeframe}
        onTimeframeChange={setActiveTimeframe}
      />

      {/* Multi-Timeframe Structural Analysis Matrix */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                Multi-Timeframe Market Structure & Momentum Matrix
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Deconstructed across Trend, Momentum, Volatility State, and Key Support/Resistance swing pivots.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Active Focus: <b className="text-amber-400">{activeTimeframe}</b>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">Timeframe</th>
                <th className="pb-2 font-semibold">Trend</th>
                <th className="pb-2 font-semibold">Momentum</th>
                <th className="pb-2 font-semibold">RSI(14)</th>
                <th className="pb-2 font-semibold">MACD Signal</th>
                <th className="pb-2 font-semibold">Structure</th>
                <th className="pb-2 font-semibold">Key Support</th>
                <th className="pb-2 font-semibold">Key Resistance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(timeframeData).map(([tf, d]) => {
                const isSelected = activeTimeframe === tf;
                return (
                  <tr 
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-500/10 text-slate-100' : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 font-bold text-amber-400 flex items-center gap-1.5">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      <span>{tf}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        d.trend.includes('BULLISH') 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {d.trend}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={d.momentum === 'OVERBOUGHT' ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                        {d.momentum}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold">
                      <span className={d.rsi14 > 70 ? 'text-amber-400' : d.rsi14 < 30 ? 'text-blue-400' : 'text-slate-300'}>
                        {d.rsi14.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">
                      {d.macd.hist > 0 ? `+${d.macd.hist.toFixed(2)}` : d.macd.hist.toFixed(2)} (Hist)
                    </td>
                    <td className="py-2.5">
                      <span className="text-slate-300">{d.marketStructure}</span>
                    </td>
                    <td className="py-2.5 text-emerald-400 font-bold">
                      ${d.keySupport}
                    </td>
                    <td className="py-2.5 text-rose-400 font-bold">
                      ${d.keyResistance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
