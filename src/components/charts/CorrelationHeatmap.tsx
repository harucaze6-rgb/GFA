import React, { useState } from 'react';
import { CorrelationMatrixItem } from '../../services/regimeEngine';
import { AlertCircle, ArrowRightLeft, Layers } from 'lucide-react';

interface CorrelationHeatmapProps {
  correlations: CorrelationMatrixItem[];
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ correlations }) => {
  const [selectedWindow, setSelectedWindow] = useState<'20D' | '60D' | '120D' | '1Y'>('60D');
  const [hoveredItem, setHoveredItem] = useState<CorrelationMatrixItem | null>(null);

  const getCorrValue = (item: CorrelationMatrixItem) => {
    switch (selectedWindow) {
      case '20D': return item.corr20D;
      case '60D': return item.corr60D;
      case '120D': return item.corr120D;
      case '1Y': return item.corr1Y;
    }
  };

  const getHeatmapBg = (val: number) => {
    if (val >= 0.6) return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40';
    if (val >= 0.25) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
    if (val > -0.25 && val < 0.25) return 'bg-slate-800/40 text-slate-400 border-slate-700/30';
    if (val <= -0.6) return 'bg-rose-500/30 text-rose-300 border-rose-500/40';
    return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-4 flex flex-col">
      {/* Header & Window Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Cross-Asset Rolling Correlation Matrix
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Statistical co-movement vs Gold. Detects correlation instability & decoupling.
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 font-mono text-xs">
          {(['20D', '60D', '120D', '1Y'] as const).map((win) => (
            <button
              key={win}
              onClick={() => setSelectedWindow(win)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedWindow === win
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {win} Window
            </button>
          ))}
        </div>
      </div>

      {/* Grid of correlation tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {correlations.map((item) => {
          const val = getCorrValue(item);
          const bgStyle = getHeatmapBg(val);
          const isSelected = hoveredItem?.assetB === item.assetB;

          return (
            <div
              key={item.assetB}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${bgStyle} ${
                isSelected ? 'ring-2 ring-amber-400 shadow-lg scale-[1.02]' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-semibold truncate text-slate-200" title={item.assetB}>
                  {item.assetB}
                </span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono uppercase ${
                  item.stability === 'STABLE' 
                    ? 'bg-slate-900/60 text-slate-400' 
                    : item.stability === 'DECOUPLING' 
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40' 
                    : 'bg-purple-950 text-purple-300'
                }`}>
                  {item.stability}
                </span>
              </div>

              <div className="text-xl font-bold font-mono tracking-tight">
                {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-700/30">
                <span>Gold vs Asset</span>
                <span>{selectedWindow}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Detail Inspector or Guidance */}
      <div className="mt-4 p-3 rounded-lg bg-[#141a27] border border-slate-800 text-xs font-mono flex items-center justify-between">
        {hoveredItem ? (
          <div className="flex flex-wrap items-center gap-4 w-full">
            <span className="text-slate-200 font-bold">
              Pair: Gold / {hoveredItem.assetB}
            </span>
            <span className="text-slate-400">
              20D: <b className="text-slate-200">{hoveredItem.corr20D > 0 ? `+${hoveredItem.corr20D}` : hoveredItem.corr20D}</b>
            </span>
            <span className="text-slate-400">
              60D: <b className="text-slate-200">{hoveredItem.corr60D > 0 ? `+${hoveredItem.corr60D}` : hoveredItem.corr60D}</b>
            </span>
            <span className="text-slate-400">
              120D: <b className="text-slate-200">{hoveredItem.corr120D > 0 ? `+${hoveredItem.corr120D}` : hoveredItem.corr120D}</b>
            </span>
            <span className="text-slate-400">
              1Y: <b className="text-slate-200">{hoveredItem.corr1Y > 0 ? `+${hoveredItem.corr1Y}` : hoveredItem.corr1Y}</b>
            </span>
            <span className="ml-auto text-amber-300 font-medium">
              State: {hoveredItem.stability}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Hover over any cross-asset pair to inspect full multi-window rolling stability. Green = co-movement, Red = inverse movement.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
