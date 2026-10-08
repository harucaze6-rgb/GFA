import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Landmark, 
  Percent, 
  DollarSign, 
  Flag, 
  Layers, 
  Globe2, 
  AlertTriangle, 
  Sliders, 
  Calendar, 
  Newspaper, 
  ShieldCheck, 
  Sparkles, 
  History, 
  Settings as SettingsIcon,
  Compass,
  ArrowRightLeft
} from 'lucide-react';

export type NavView = 
  | 'overview'
  | 'gold'
  | 'macro'
  | 'real-yields'
  | 'usd'
  | 'india'
  | 'flows'
  | 'physical'
  | 'geopolitics'
  | 'correlations'
  | 'scenarios'
  | 'stress-test'
  | 'calendar'
  | 'news'
  | 'data-health'
  | 'ai-analyst'
  | 'backtest'
  | 'settings';

interface NavigationProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  hasActiveDivergences?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onSelectView,
  hasActiveDivergences = false
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: '1. Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'gold', label: '2. Gold Analysis', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'macro', label: '3. Macro & Rates', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'real-yields', label: '4. Real Yields', icon: <Percent className="w-3.5 h-3.5" /> },
    { id: 'usd', label: '5. USD & Currencies', icon: <DollarSign className="w-3.5 h-3.5" />, badge: hasActiveDivergences ? 'ALERT' : undefined },
    { id: 'india', label: '6. India Transmission', icon: <Flag className="w-3.5 h-3.5" /> },
    { id: 'flows', label: '7. Flows & Positioning', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'physical', label: '8. Central Banks & Physical', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'geopolitics', label: '9. Geopolitics', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { id: 'correlations', label: '10. Correlations & Lead-Lag', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
    { id: 'scenarios', label: '11. Scenarios & What-If', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'stress-test', label: '12. Stress Testing', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'calendar', label: '13. Events Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'news', label: '14. News Intelligence', icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: 'data-health', label: '15. Data Health & Lineage', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'ai-analyst', label: '16. AI Market Analyst', icon: <Sparkles className="w-3.5 h-3.5" />, badge: 'AI' },
    { id: 'backtest', label: '17. Research / Backtest', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'settings', label: '18. Settings', icon: <SettingsIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="bg-[#0b0f17] border-b border-slate-800 px-3 py-1 overflow-x-auto select-none">
      <div className="flex items-center gap-1 min-w-max">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all relative ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                  item.badge === 'ALERT' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
