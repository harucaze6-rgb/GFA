import React from 'react';
import { FactorScoreItem } from '../../types/market';
import { Info, HelpCircle } from 'lucide-react';

interface WaterfallFactorChartProps {
  factors: FactorScoreItem[];
  totalScore: number;
  onWhyClick: (factor: FactorScoreItem) => void;
}

export const WaterfallFactorChart: React.FC<WaterfallFactorChartProps> = ({
  factors,
  totalScore,
  onWhyClick
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-4 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
            Quantitative Factor Attribution Waterfall
          </h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Normalized contributions (-100 to +100) summing to the Composite Macro Score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Macro Score:</span>
            <span className={`text-base font-bold font-mono ${
              totalScore > 0 ? 'text-emerald-400' : totalScore < 0 ? 'text-rose-400' : 'text-slate-200'
            }`}>
              {totalScore > 0 ? `+${totalScore}` : totalScore}
            </span>
          </div>
        </div>
      </div>

      {/* Factor Bars */}
      <div className="space-y-2.5">
        {factors.map((factor) => {
          const isPositive = factor.weightedScore > 0;
          const isNeutral = Math.abs(factor.weightedScore) < 0.5;
          const barWidth = Math.min(100, (Math.abs(factor.weightedScore) / 25) * 100);

          return (
            <div 
              key={factor.id} 
              className="p-2.5 rounded-lg bg-[#121824] border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200">{factor.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({factor.weight}% wt)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold ${
                    isPositive ? 'text-emerald-400' : isNeutral ? 'text-slate-400' : 'text-rose-400'
                  }`}>
                    {isPositive ? `+${factor.weightedScore.toFixed(1)}` : factor.weightedScore.toFixed(1)} pts
                  </span>

                  <button
                    onClick={() => onWhyClick(factor)}
                    className="p-1 rounded text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
                    title="Inspect formula calculation"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dual-direction visual bar */}
              <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden flex">
                {/* Left half (negative) */}
                <div className="w-1/2 flex justify-end">
                  {!isPositive && !isNeutral && (
                    <div 
                      className="h-full bg-rose-500 rounded-l-full" 
                      style={{ width: `${barWidth}%` }}
                    />
                  )}
                </div>
                {/* Center marker */}
                <div className="w-0.5 h-full bg-slate-700 shrink-0 z-10" />
                {/* Right half (positive) */}
                <div className="w-1/2 flex justify-start">
                  {isPositive && !isNeutral && (
                    <div 
                      className="h-full bg-emerald-500 rounded-r-full" 
                      style={{ width: `${barWidth}%` }}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Raw: {typeof factor.rawValue === 'number' ? factor.rawValue.toFixed(2) : factor.rawValue} {factor.unit}</span>
                <span>Score: {factor.score > 0 ? `+${factor.score}` : factor.score}/100</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
