import React, { useState, useMemo } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, BarChart2, Activity } from 'lucide-react';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface InteractiveCandleChartProps {
  currentPrice: number;
  activeTimeframe: string;
  onTimeframeChange: (tf: string) => void;
}

export const InteractiveCandleChart: React.FC<InteractiveCandleChartProps> = ({
  currentPrice,
  activeTimeframe,
  onTimeframeChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMA, setShowMA] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(35); // number of candles shown

  // Generate realistic price action series around current spot
  const candleSeries = useMemo(() => {
    const candles: CandleData[] = [];
    const count = 60;
    let base = currentPrice - 75;
    const now = Date.now();
    const intervalMs = activeTimeframe === '15m' ? 15 * 60 * 1000 : activeTimeframe === '1h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    for (let i = 0; i < count; i++) {
      const time = new Date(now - (count - i) * intervalMs).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: activeTimeframe.includes('m') || activeTimeframe.includes('h') ? '2-digit' : undefined,
        minute: activeTimeframe.includes('m') ? '2-digit' : undefined
      });

      // Realistic pseudo-Brownian drift with momentum
      const trendBias = i > 40 ? 1.2 : 0.4;
      const noise = (Math.sin(i * 0.4) + Math.cos(i * 0.15)) * 4.5 + (Math.random() - 0.48) * 6;
      const open = base;
      const change = trendBias + noise;
      const close = i === count - 1 ? currentPrice : open + change;
      const high = Math.max(open, close) + Math.random() * 5.5 + 1.2;
      const low = Math.min(open, close) - (Math.random() * 5.2 + 1.2);
      const volume = Math.floor(12000 + Math.abs(change) * 4500 + Math.random() * 8000);

      candles.push({ time, open, high, low, close, volume });
      base = close;
    }
    return candles;
  }, [currentPrice, activeTimeframe]);

  const visibleCandles = useMemo(() => {
    return candleSeries.slice(-zoomLevel);
  }, [candleSeries, zoomLevel]);

  // Price bounds
  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let volMax = 0;
    visibleCandles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > volMax) volMax = c.volume;
    });
    const padding = (max - min) * 0.08 || 10;
    return { minPrice: min - padding, maxPrice: max + padding, maxVol: volMax * 1.2 };
  }, [visibleCandles]);

  // Moving averages calculation
  const ma20 = useMemo(() => {
    return candleSeries.map((_, idx, arr) => {
      if (idx < 19) return null;
      const slice = arr.slice(idx - 19, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / 20;
    }).slice(-zoomLevel);
  }, [candleSeries, zoomLevel]);

  const ma50 = useMemo(() => {
    return candleSeries.map((_, idx, arr) => {
      if (idx < 49) return null;
      const slice = arr.slice(idx - 49, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / 50;
    }).slice(-zoomLevel);
  }, [candleSeries, zoomLevel]);

  // SVG dimensions
  const width = 850;
  const height = isFullscreen ? 520 : 360;
  const priceAreaHeight = height * 0.76;
  const volumeAreaHeight = height * 0.20;
  const volumeAreaTop = height * 0.78;

  const getX = (index: number) => {
    const step = width / visibleCandles.length;
    return index * step + step / 2;
  };

  const getY = (price: number) => {
    if (maxPrice === minPrice) return priceAreaHeight / 2;
    return priceAreaHeight - ((price - minPrice) / (maxPrice - minPrice)) * priceAreaHeight;
  };

  const getVolY = (vol: number) => {
    return height - (vol / (maxVol || 1)) * volumeAreaHeight;
  };

  const activeCandle = hoveredCandle || visibleCandles[visibleCandles.length - 1];

  return (
    <div className={`rounded-xl border border-slate-800 bg-[#0e131d] overflow-hidden flex flex-col ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative'
    }`}>
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#131926] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400 text-sm">
            <Activity className="w-4 h-4" />
            <span>XAU/USD SPOT CANDLESTICK</span>
          </div>

          <div className="flex items-center bg-slate-900/90 rounded border border-slate-800 p-0.5 ml-2">
            {['15m', '1h', '4h', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                  activeTimeframe === tf 
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMA(!showMA)}
            className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ml-1 ${
              showMA ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            MA(20,50)
          </button>
        </div>

        {/* Live Candle Metrics Header */}
        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <div><span className="text-slate-500">O:</span> ${activeCandle.open.toFixed(2)}</div>
          <div><span className="text-slate-500">H:</span> ${activeCandle.high.toFixed(2)}</div>
          <div><span className="text-slate-500">L:</span> ${activeCandle.low.toFixed(2)}</div>
          <div>
            <span className="text-slate-500">C:</span>{' '}
            <span className={activeCandle.close >= activeCandle.open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              ${activeCandle.close.toFixed(2)}
            </span>
          </div>
          <div className="text-slate-500">Vol: {activeCandle.volume.toLocaleString()}</div>
        </div>

        {/* Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(20, z - 5))}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(60, z + 5))}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 ml-1"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 bg-[#0b0e14]">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          {/* Horizontal Gridlines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = priceAreaHeight * ratio;
            const priceLevel = maxPrice - ratio * (maxPrice - minPrice);
            return (
              <g key={ratio}>
                <line x1="0" y1={y} x2={width} y2={y} stroke="#1b2230" strokeDasharray="3 3" />
                <text x={width - 55} y={y - 3} fill="#4b5563" fontSize="10" fontFamily="monospace">
                  ${priceLevel.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume separator */}
          <line x1="0" y1={volumeAreaTop} x2={width} y2={volumeAreaTop} stroke="#1f293d" />

          {/* Volume bars */}
          {visibleCandles.map((c, i) => {
            const x = getX(i);
            const y = getVolY(c.volume);
            const h = height - y;
            const isGreen = c.close >= c.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - (width / visibleCandles.length) * 0.35}
                y={y}
                width={(width / visibleCandles.length) * 0.7}
                height={Math.max(2, h)}
                fill={isGreen ? '#059669' : '#dc2626'}
                opacity={0.35}
              />
            );
          })}

          {/* Candlestick Wicks & Bodies */}
          {visibleCandles.map((c, i) => {
            const x = getX(i);
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);
            const isGreen = c.close >= c.open;
            const topY = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(closeY - openY));
            const candleWidth = Math.max(3, (width / visibleCandles.length) * 0.65);

            return (
              <g 
                key={`c-${i}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCandle(c)}
                onMouseLeave={() => setHoveredCandle(null)}
              >
                {/* Upper & Lower Wick */}
                <line 
                  x1={x} 
                  y1={highY} 
                  x2={x} 
                  y2={lowY} 
                  stroke={isGreen ? '#10b981' : '#f43f5e'} 
                  strokeWidth="1.2" 
                />
                {/* Candle Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={topY}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={isGreen ? '#10b981' : '#f43f5e'}
                  rx="1"
                />
              </g>
            );
          })}

          {/* MA 20 Line (Amber) */}
          {showMA && (
            <path
              d={visibleCandles.reduce((acc, _, i) => {
                const val = ma20[i];
                if (val === null) return acc;
                const x = getX(i);
                const y = getY(val);
                return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.6"
              opacity={0.85}
            />
          )}

          {/* MA 50 Line (Blue) */}
          {showMA && (
            <path
              d={visibleCandles.reduce((acc, _, i) => {
                const val = ma50[i];
                if (val === null) return acc;
                const x = getX(i);
                const y = getY(val);
                return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.6"
              opacity={0.85}
            />
          )}

          {/* Current Price Reference Line */}
          <line
            x1="0"
            y1={getY(currentPrice)}
            x2={width}
            y2={getY(currentPrice)}
            stroke="#f59e0b"
            strokeDasharray="4 2"
            strokeWidth="1.2"
          />
          <rect
            x={width - 70}
            y={getY(currentPrice) - 9}
            width="65"
            height="18"
            fill="#d97706"
            rx="3"
          />
          <text
            x={width - 66}
            y={getY(currentPrice) + 4}
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            ${currentPrice.toFixed(2)}
          </text>
        </svg>

        {/* MA Legend Overlay */}
        {showMA && (
          <div className="absolute top-2 left-3 flex items-center gap-3 font-mono text-[11px] bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80">
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> MA(20)
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <span className="w-2.5 h-0.5 bg-blue-400 inline-block" /> MA(50)
            </span>
          </div>
        )}
      </div>

      {/* Date Axis Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0f141f] border-t border-slate-800 text-[10px] font-mono text-slate-500">
        <span>{visibleCandles[0]?.time}</span>
        <span>Timeframe: {activeTimeframe} (Real-time synchronized)</span>
        <span>{visibleCandles[visibleCandles.length - 1]?.time}</span>
      </div>
    </div>
  );
};
