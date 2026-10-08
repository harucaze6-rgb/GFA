export type DataStatus = 
  | 'LIVE' 
  | 'DELAYED' 
  | 'HISTORICAL' 
  | 'ESTIMATED' 
  | 'MANUAL' 
  | 'UNAVAILABLE' 
  | 'SIMULATED';

export interface DataPoint<T = number> {
  value: T;
  timestamp: string;
  source: string;
  frequency: string;
  status: DataStatus;
  change1D?: number;
  change1W?: number;
  change1M?: number;
  percentile5Y?: number;
  notes?: string;
}

export type GoldUnit = '10g' | '1g' | '1kg' | 'tola' | 'oz';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface GoldPriceData {
  xauUsd: DataPoint;
  inr10g24k: DataPoint;
  inr10g22k: DataPoint;
  mcxGoldActive: DataPoint;
  usdInr: DataPoint;
  high52W: number;
  low52W: number;
  distanceFromHighPct: number;
  distanceFromLowPct: number;
  atr14: number;
  realizedVol30D: number;
  historicalVolAnnual: number;
  volume24h: number;
  openInterest?: number;
}

export interface FactorScoreItem {
  id: string;
  name: string;
  category: string;
  rawValue: number | string;
  unit: string;
  change1D: number;
  change5D?: number;
  change1M?: number;
  historicalPercentile: number; // 0 to 100
  score: number; // -100 to +100
  weight: number; // in percent (e.g. 20)
  weightedScore: number;
  direction: 'SUPPORTIVE' | 'PRESSURING' | 'NEUTRAL';
  confidence: number; // 0 to 100%
  dataQuality: DataStatus;
  lastUpdated: string;
  source: string;
  formula: string;
  explanation: string;
}

export interface RealYieldFactors {
  fedRate: DataPoint;
  fedFundsExpectation: DataPoint;
  us2yYield: DataPoint;
  us5yYield: DataPoint;
  us10yYield: DataPoint;
  us30yYield: DataPoint;
  us10yRealYield: DataPoint; // TIPS yield
  us5yRealYield: DataPoint;
  yieldCurve2s10s: DataPoint;
  rateCutProbNextFOMC: number;
  rateHikeProbNextFOMC: number;
  correlationWithGold60D: number;
  regimeNotes: string;
}

export interface USDFactors {
  dxy: DataPoint;
  eurUsd: DataPoint;
  usdJpy: DataPoint;
  gbpUsd: DataPoint;
  usdCnh: DataPoint;
  dxyTrend: 'BULLISH' | 'BEARISH' | 'RANGING';
  dxyMomentum14D: number;
  dxyVol30D: number;
  goldDxyRollingCorr: number;
  isDivergent: boolean;
  divergenceType?: string;
  divergenceNotes?: string;
}

export type InflationRegime = 
  | 'RISING_INFLATION_RISING_REAL_YIELDS'
  | 'RISING_INFLATION_FALLING_REAL_YIELDS'
  | 'FALLING_INFLATION_RISING_REAL_YIELDS'
  | 'FALLING_INFLATION_FALLING_REAL_YIELDS';

export interface InflationFactors {
  cpiYoY: DataPoint;
  coreCpiYoY: DataPoint;
  pceYoY: DataPoint;
  corePceYoY: DataPoint;
  breakeven10Y: DataPoint;
  regime: InflationRegime;
  regimeDescription: string;
  acceleration: 'ACCELERATING' | 'DECELERATING' | 'STABLE';
}

export interface LaborFactors {
  nfp: DataPoint;
  unemploymentRate: DataPoint;
  initialJoblessClaims: DataPoint;
  continuingClaims: DataPoint;
  avgHourlyEarningsYoY: DataPoint;
  laborDeteriorationScore: number; // 0 to 100
  momentum: 'EXPANDING' | 'STABILIZING' | 'COOLING';
}

export interface GrowthFactors {
  usGdpQoQAnnualized: DataPoint;
  ismManufacturingPmi: DataPoint;
  ismServicesPmi: DataPoint;
  retailSalesMoM: DataPoint;
  recessionRiskProxyPct: number; // 0 to 100%
  growthMomentum: 'STRONG' | 'MODERATE' | 'SLOWING' | 'CONTRACTION';
}

export interface CentralBankDemand {
  quarterlyPurchasesTonnes: DataPoint;
  annualNetDemandTonnes: DataPoint;
  rolling3mAverageTonnes: number;
  rolling12mAverageTonnes: number;
  topBuyers: { country: string; purchasesTonnes: number; sharePct: number }[];
  topSellers: { country: string; salesTonnes: number }[];
  officialReservesGlobalTonnes: number;
  historicalPercentile: number;
  structuralDemandContribution: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
}

export interface PhysicalMarketBalance {
  mineProductionTonnes: DataPoint;
  recyclingTonnes: DataPoint;
  totalSupplyTonnes: DataPoint;
  jewelleryDemandTonnes: DataPoint;
  barsAndCoinsTonnes: DataPoint;
  technologyDemandTonnes: DataPoint;
  etfDemandTonnes: DataPoint;
  totalDemandTonnes: DataPoint;
  netBalanceTonnes: DataPoint; // totalDemand - totalSupply
  trend: 'DEFICIT' | 'SURPLUS' | 'BALANCED';
}

export interface GeopoliticalEvent {
  id: string;
  date: string;
  region: string;
  category: 'CONFLICT' | 'SANCTIONS' | 'TRADE_DISRUPTION' | 'ENERGY_SHOCK' | 'FINANCIAL_STABILITY' | 'POLITICAL';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SYSTEMIC';
  headline: string;
  marketRelevance: string;
  source: string;
  timestamp: string;
}

export interface GeopoliticalIndex {
  gprScore: number; // 0 to 100
  trend: 'ESCALATING' | 'STABLE' | 'DE_ESCALATING';
  severityBreakdown: { low: number; moderate: number; high: number; systemic: number };
  events: GeopoliticalEvent[];
}

export interface PositioningFlows {
  goldEtfHoldingsTonnes: DataPoint;
  weeklyEtfFlowTonnes: DataPoint;
  cftcNetSpeculativeContracts: DataPoint;
  cftcCommercialNetContracts: DataPoint;
  speculativePercentile5Y: number;
  isPositioningExtreme: boolean;
  extremeCondition?: 'EXTREME_LONG' | 'EXTREME_SHORT' | 'NORMAL';
  flowPriceDivergence: boolean;
  divergenceNotes?: string;
}

export interface IndiaTransmissionCalc {
  xauUsd: number;
  usdInr: number;
  ounceToGram: number; // 31.1034768
  customsDutyPct: number; // e.g. 6.0% basic customs duty
  aidcPct: number; // e.g. 5.35% Agriculture Infrastructure Development Cess
  gstPct: number; // e.g. 3.0%
  localPremiumDiscountInrPer10g: number; // e.g. +150 or -200
  selectedUnit: GoldUnit;
  // Computed outputs
  landedCostUsdPerOz: number;
  landedCostInrPerGramBase: number;
  dutyAmountInrPer10g: number;
  gstAmountInrPer10g: number;
  finalInrPer10g: number;
  finalInrPerUnit: number;
  // Attribution breakdown
  attribution: {
    globalGoldEffectPct: number;
    globalGoldEffectInr: number;
    currencyEffectPct: number;
    currencyEffectInr: number;
    domesticDutyPremiumPct: number;
    domesticDutyPremiumInr: number;
    dominantDriver: 'GLOBAL_GOLD' | 'RUPEE_DEPRECIATION' | 'DOMESTIC_PREMIUM' | 'BALANCED';
  };
}

export type MarketRegimeType = 
  | 'Risk-On / Gold Pressure' 
  | 'Neutral' 
  | 'Defensive' 
  | 'Gold Supportive Macro' 
  | 'Strong Defensive Demand' 
  | 'Transitional Regime';

export interface MarketRegimeState {
  regime: MarketRegimeType;
  macroScore: number; // -100 to +100
  globalGoldScore: number; // -100 to +100
  indiaGoldScore: number; // -100 to +100
  confidencePct: number; // 0 to 100
  description: string;
  implicationsForTraders: string;
  implicationsForInvestors: string;
  lastUpdated: string;
  factorContributions: {
    category: string;
    weightPct: number;
    score: number;
    weightedContribution: number;
  }[];
}

export interface DivergenceEvent {
  id: string;
  title: string;
  assetA: string;
  assetB: string;
  expectedRelationship: string;
  observedRelationship: string;
  magnitude: 'MILD' | 'MODERATE' | 'HIGH' | 'SIGNIFICANT' | 'EXTREME';
  historicalFrequency: string;
  interpretation: string;
  confidence: number;
  dataSources: string[];
  detectedAt: string;
}

export interface EconomicCalendarEvent {
  id: string;
  date: string;
  time: string;
  country: string;
  event: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  previous: string;
  consensus: string;
  actual: string;
  surpriseBps?: number;
  surpriseDirection?: 'POSITIVE' | 'NEGATIVE' | 'IN_LINE' | 'N/A';
  goldHistoricalReaction: string;
  dxyHistoricalReaction: string;
  yieldReaction: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  category: 'MONETARY_POLICY' | 'INFLATION' | 'LABOR' | 'GROWTH' | 'GEOPOLITICS' | 'CENTRAL_BANKS' | 'GOLD_MARKET' | 'INDIA' | 'USD_INR';
  relevanceScore: number; // 0 to 100
  sentiment: number; // -1.0 to +1.0
  entities: string[];
  affectedFactor: string;
  url?: string;
}

export interface DataSourceHealth {
  id: string;
  name: string;
  category: string;
  provider: string;
  endpointUrl: string;
  frequency: string;
  status: DataStatus;
  lastSuccessTimestamp: string;
  latencyMs: number;
  errorCount24h: number;
  reliabilityPct: number;
  isOfficialSource: boolean;
}

export interface StressScenario {
  id: string;
  name: string;
  period: string;
  description: string;
  goldResponsePct: number;
  usdResponsePct: number;
  realYieldResponseBps: number;
  inrGoldResponsePct: number;
  maxDrawdownPct: number;
  realizedVolPct: number;
  recoveryPeriodMonths: number;
  keyDrivers: string[];
}

export interface TechnicalTimeframeAnalysis {
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D' | '1W' | '1M';
  trend: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  momentum: 'OVERBOUGHT' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'OVERSOLD';
  rsi14: number;
  macd: { macd: number; signal: number; hist: number };
  ma20: number;
  ma50: number;
  ma200: number;
  atr: number;
  volatilityState: 'HIGH' | 'NORMAL' | 'COMPRESSED';
  marketStructure: 'HIGHER_HIGHS' | 'LOWER_LOWS' | 'CONSOLIDATION' | 'BREAKOUT';
  keySupport: number;
  keyResistance: number;
}

export interface BacktestConfig {
  startDate: string;
  endDate: string;
  signalThreshold: number; // e.g. +25 for long, -25 for neutral/short
  rebalanceFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  weights: Record<string, number>;
}

export interface BacktestResult {
  totalReturnPct: number;
  annualizedReturnPct: number;
  benchmarkReturnPct: number;
  sharpeRatio: number;
  maxDrawdownPct: number;
  hitRatePct: number;
  totalTrades: number;
  winLossRatio: number;
  monthlyReturns: { month: string; returnPct: number }[];
}

export interface UserSettings {
  currency: Currency;
  goldUnit: GoldUnit;
  timezone: string;
  defaultTimeframe: string;
  customsDutyPct: number;
  aidcPct: number;
  gstPct: number;
  localPremiumInr: number;
  refreshIntervalSeconds: number;
  weights: {
    realYields: number;
    usd: number;
    inflation: number;
    growthLabor: number;
    centralBanks: number;
    physicalMarket: number;
    etfPositioning: number;
    geopoliticalRisk: number;
    indiaDomestic: number;
  };
}
