import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, CheckCircle2, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { GoldPriceData, MarketRegimeState, FactorScoreItem, DivergenceEvent } from '../../types/market';

interface AIAnalystViewProps {
  priceData: GoldPriceData;
  regimeState: MarketRegimeState;
  factors: FactorScoreItem[];
  divergences: DivergenceEvent[];
}

export const AIAnalystView: React.FC<AIAnalystViewProps> = ({
  priceData,
  regimeState,
  factors,
  divergences
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### GFA Institutional Intelligence Briefing

**[FACT]**: International Spot Gold (XAU/USD) is currently trading at **$${priceData.xauUsd.value.toFixed(2)}** (${priceData.xauUsd.change1D! >= 0 ? '+' : ''}${priceData.xauUsd.change1D?.toFixed(2)}% 1D). Indian domestic landed 24K gold is at **₹${priceData.inr10g24k.value.toLocaleString()}/10g**.

**[CALCULATION]**: The multi-factor engine models the current market state as **"${regimeState.regime}"** with a Composite Macro Score of **${regimeState.macroScore > 0 ? `+${regimeState.macroScore}` : regimeState.macroScore}/100** (Confidence: ${regimeState.confidencePct}%).

**[INTERPRETATION]**: Macro support is led by central bank accumulation and decelerating 10-year TIPS real yields. However, USD resiliency (DXY: 103.85) and elevated speculative futures positioning (86th percentile) create tactical consolidation resistance.

**[UNCERTAINTY]**: Upcoming U.S. Nonfarm Payrolls and CPI releases remain the primary volatility catalysts for the 10-year Treasury curve.

*Select a pre-built institutional research query below or type your custom quantitative prompt.*`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const prebuiltQueries = [
    "Why is gold moving today?",
    "Why is Indian gold moving differently from XAU/USD?",
    "What changed in the macro environment?",
    "What factors currently support gold?",
    "What factors are creating pressure?",
    "Is the gold/DXY relationship currently normal?",
    "What is the current market regime?",
    "What are the major divergences?",
    "Which data releases matter next?"
  ];

  const handleAsk = async (queryText?: string) => {
    const textToSend = queryText || question;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = 'usr-' + Date.now();
    const newConvo = [
      ...conversation,
      {
        id: userMsgId,
        role: 'user' as const,
        content: textToSend,
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    setConversation(newConvo);
    setQuestion('');
    setIsLoading(true);

    try {
      const payloadContext = {
        spotPrice: priceData.xauUsd.value,
        inrGold10g: priceData.inr10g24k.value,
        usdInr: priceData.usdInr.value,
        regime: regimeState.regime,
        macroScore: regimeState.macroScore,
        confidence: regimeState.confidencePct,
        topFactors: factors.map((f) => ({
          name: f.name,
          score: f.score,
          weightedContribution: f.weightedScore,
          rawValue: f.rawValue,
          direction: f.direction
        })),
        divergences: divergences.map((d) => ({
          title: d.title,
          observed: d.observedRelationship,
          magnitude: d.magnitude
        }))
      };

      const res = await fetch('/api/ai-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          context: payloadContext
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          role: 'assistant',
          content: data.answer || 'No analysis text returned.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err: any) {
      setConversation((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: `**[ERROR]**: Quantitative analyst service encountered an issue: ${err.message}. Please verify server network connectivity and that the GEMINI_API_KEY secret is provisioned.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            SYNTHESIS ENGINE • GEMINI 3.8 FLASH SERVER-SIDE
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
            FACT / CALCULATION / INTERPRETATION / UNCERTAINTY
          </span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Institutional AI Macro & Bullion Market Analyst</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
          Strictly grounded in the live dashboard data payload. The model is instructed to avoid speculative assertions and explicitly segregate verifiable facts, mathematical calculations, economic interpretations, and forward uncertainties.
        </p>
      </div>

      {/* Pre-Built Institutional Prompts */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {prebuiltQueries.map((q) => (
          <button
            key={q}
            onClick={() => handleAsk(q)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-[#121824] hover:bg-[#1a2336] text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors disabled:opacity-50 text-left"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Chat Conversation Thread */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5 space-y-5 max-h-[550px] overflow-y-auto">
        {conversation.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 text-xs font-mono ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`p-4 rounded-xl max-w-3xl leading-relaxed ${
              msg.role === 'user'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'bg-[#121824] text-slate-200 border border-slate-800 whitespace-pre-wrap'
            }`}>
              {msg.content}
              <div className="text-[10px] text-slate-500 mt-2 text-right">
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs font-mono items-center text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>GFA AI is querying multi-factor model and formulating institutional synthesis...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask a quantitative gold market or currency transmission question..."
          disabled={isLoading}
          className="flex-1 bg-[#0e131d] border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 disabled:opacity-50"
        />
        <button
          onClick={() => handleAsk()}
          disabled={!question.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-2 shrink-0"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
