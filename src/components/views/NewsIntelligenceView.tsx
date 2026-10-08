import React, { useState } from 'react';
import { NewsItem } from '../../types/market';
import { Newspaper, Filter, TrendingUp, TrendingDown, Layers, ExternalLink } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface NewsIntelligenceViewProps {
  newsItems: NewsItem[];
}

export const NewsIntelligenceView: React.FC<NewsIntelligenceViewProps> = ({ newsItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredNews = selectedCategory === 'ALL'
    ? newsItems
    : newsItems.filter((n) => n.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                QUALITATIVE CONTEXT • NEWS INTELLIGENCE
              </span>
              <DataStatusBadge status="LIVE" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-amber-400" />
              <span>Categorized Financial Intelligence & Macro Headlines</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              News is categorized to identify quantitative factor impact (Central Banks, Real Rates, Currency, India Domestic) rather than relying on sentiment alone.
            </p>
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 max-w-xs shrink-0">
            <span className="text-amber-400 font-bold block mb-0.5">Terminal Rule:</span>
            News serves as qualitative narrative context; quantitative factor scores remain the primary analytical engine.
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
        {[
          'ALL',
          'CENTRAL_BANKS',
          'INDIA',
          'MONETARY_POLICY',
          'GEOPOLITICS',
          'GOLD_MARKET',
          'USD_INR'
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'bg-[#121824] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* News Feed Grid */}
      <div className="space-y-3 font-mono">
        {filteredNews.map((item) => (
          <div 
            key={item.id}
            className="p-4 rounded-xl bg-[#0e131d] border border-slate-800 hover:border-slate-700 transition-colors text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-bold text-[10px] border border-slate-800">
                  {item.category.replace('_', ' ')}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{item.timestamp}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">{item.source}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500">Relevance: <b className="text-slate-300">{item.relevanceScore}%</b></span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  item.sentiment > 0.3 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : item.sentiment < -0.3 
                    ? 'bg-rose-500/20 text-rose-300' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.sentiment > 0.3 ? 'BULLISH TONE' : item.sentiment < -0.3 ? 'BEARISH TONE' : 'NEUTRAL TONE'}
                </span>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-100 mb-2 leading-snug">
              {item.headline}
            </h4>

            {/* Entities & Factor Affected */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-slate-500">Entities:</span>
                {item.entities.map((e, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-[#121824] text-slate-300 border border-slate-800 text-[10px]">
                    {e}
                  </span>
                ))}
              </div>

              <div className="text-amber-400 font-semibold">
                Factor Impact: {item.affectedFactor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
