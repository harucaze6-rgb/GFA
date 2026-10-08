import { 
  DataPoint, 
  FactorScoreItem, 
  IndiaTransmissionCalc, 
  InflationRegime, 
  GoldUnit 
} from '../types/market';

/**
 * Normalizes any value to a -100 to +100 institutional factor score.
 * Positive = supportive for gold price
 * Negative = creates downward pressure on gold price
 */
export function normalizeFactorScore(
  value: number,
  min: number,
  max: number,
  invert: boolean = false
): number {
  if (max === min) return 0;
  const clamped = Math.max(min, Math.min(max, value));
  const normalized = ((clamped - min) / (max - min)) * 200 - 100;
  const score = invert ? -normalized : normalized;
  return Math.round(Math.max(-100, Math.min(100, score)));
}

/**
 * Calculates Real Yield Factor Score
 * Real Yields represent the opportunity cost of holding non-yielding gold.
 * Higher real yield -> pressure on gold (negative score)
 * Lower / negative real yield -> supports gold (positive score)
 */
export function calculateRealYieldScore(
  realYield10Y: number,
  change1D: number,
  change1M: number,
  percentile: number
): { score: number; explanation: string; formula: string } {
  // Baseline real yield score: historical 10Y real yield range: -1.2% to +2.5%
  // Inverted: higher yield = negative score for gold
  const levelScore = normalizeFactorScore(realYield10Y, -1.0, 2.5, true);
  
  // Rate of change component: if yields are rapidly dropping (negative change), supportive (+score)
  const rocScore = normalizeFactorScore(change1M, -0.6, 0.6, true);
  
  // Percentile component: high percentile (>80%) = very restrictive real rate
  const percentileScore = 100 - percentile * 2; // 0% -> +100, 100% -> -100
  
  const finalScore = Math.round(levelScore * 0.5 + rocScore * 0.3 + percentileScore * 0.2);
  
  const formula = `Score = (LevelScore[-1.0% to +2.5%] * 0.50) + (1M_Change[-60bps to +60bps] * 0.30) + ((100 - Percentile*2) * 0.20)`;
  const explanation = realYield10Y > 1.8 
    ? `10Y US Real Yield at ${realYield10Y.toFixed(2)}% is at the ${percentile}th percentile of the 10-year distribution. Elevated real yields raise the opportunity cost of holding zero-coupon bullion, but decelerating rate-of-change (${change1D > 0 ? '+' : ''}${(change1D * 100).toFixed(0)} bps 1D) provides conditional stabilization.`
    : `10Y US Real Yield at ${realYield10Y.toFixed(2)}% represents accommodating real monetary conditions. Negative or low real rates diminish hurdle rates for institutional gold allocation.`;

  return {
    score: Math.max(-100, Math.min(100, finalScore)),
    explanation,
    formula
  };
}

/**
 * Calculates US Dollar (DXY) Factor Score
 * Stronger USD usually pressures gold in USD terms, weaker USD supports gold.
 */
export function calculateUSDScore(
  dxy: number,
  change1D: number,
  change1M: number,
  momentum14D: number
): { score: number; explanation: string; formula: string } {
  // DXY baseline range 96.0 to 110.0 (inverted)
  const levelScore = normalizeFactorScore(dxy, 96.0, 108.0, true);
  const momScore = normalizeFactorScore(momentum14D, -3.5, 3.5, true);
  const finalScore = Math.round(levelScore * 0.4 + momScore * 0.6);

  const formula = `Score = (DXY_Level[96 to 108, inv] * 0.40) + (14D_Momentum[-3.5% to +3.5%, inv] * 0.60)`;
  const explanation = dxy > 103.5
    ? `DXY index trading at ${dxy.toFixed(2)} with 14-day momentum at ${momentum14D.toFixed(2)}%. USD resilience exerts currency-denominated mechanical friction on XAU/USD, though structural non-dollar central bank reserve diversification acts as a counterweight.`
    : `DXY trading subdued at ${dxy.toFixed(2)} with negative 14-day velocity. Broad trade-weighted dollar depreciation lowers the effective acquisition cost of gold for foreign central banks and sovereigns.`;

  return {
    score: Math.max(-100, Math.min(100, finalScore)),
    explanation,
    formula
  };
}

/**
 * Evaluates the 4 Inflation-Real Yield Regimes:
 * 1. Rising Inflation + Rising Real Yields (Fed tightening cycle / restrictive hawkish lag)
 * 2. Rising Inflation + Falling Real Yields (Gold sweet spot / negative real carry)
 * 3. Falling Inflation + Rising Real Yields (Disinflation with high terminal rate / gold pressure)
 * 4. Falling Inflation + Falling Real Yields (Growth scare / monetary easing / gold supported)
 */
export function classifyInflationRegime(
  cpiYoY: number,
  cpiChange1M: number,
  realYield10Y: number,
  realYieldChange1M: number
): { regime: InflationRegime; score: number; description: string } {
  const isInflationRising = cpiChange1M >= 0;
  const areRealYieldsRising = realYieldChange1M >= 0;

  if (isInflationRising && !areRealYieldsRising) {
    return {
      regime: 'RISING_INFLATION_FALLING_REAL_YIELDS',
      score: 85,
      description: 'Regime 2: Rising Inflation with Falling Real Yields. Historically the most bullish macro backdrop for gold due to financial repression and negative real carry.'
    };
  } else if (!isInflationRising && !areRealYieldsRising) {
    return {
      regime: 'FALLING_INFLATION_FALLING_REAL_YIELDS',
      score: 60,
      description: 'Regime 4: Disinflation with Falling Real Yields. Accommodative easing environment; policy cuts lower cash rates, maintaining strong investment demand for gold.'
    };
  } else if (isInflationRising && areRealYieldsRising) {
    return {
      regime: 'RISING_INFLATION_RISING_REAL_YIELDS',
      score: -20,
      description: 'Regime 1: Rising Inflation with Aggressive Real Yield Expansion. Hawkish central bank policy offsets inflation-hedge attributes; volatile consolidation typical.'
    };
  } else {
    return {
      regime: 'FALLING_INFLATION_RISING_REAL_YIELDS',
      score: -65,
      description: 'Regime 3: Disinflation with Rising Real Yields. Maximum headwinds for non-yielding assets as positive real cash yields attract liquidity away from gold.'
    };
  }
}

/**
 * USD/INR Transmission Engine:
 * Converts global spot gold (XAU/USD) into Indian domestic gold price
 * factoring in currency exchange, customs duty, AIDC cess, GST (3%), and local market premium/discount.
 * Also calculates exact attribution (Global gold effect, Currency effect, Domestic friction).
 */
export function calculateIndianGoldTransmission(
  xauUsd: number,
  usdInr: number,
  customsDutyPct: number = 6.0,
  aidcPct: number = 5.35,
  gstPct: number = 3.0,
  localPremiumDiscountInrPer10g: number = 180,
  selectedUnit: GoldUnit = '10g',
  benchmarkXauUsd: number = 2650,
  benchmarkUsdInr: number = 83.50
): IndiaTransmissionCalc {
  const ounceToGram = 31.1034768; // exact troy ounce conversion

  // Base international price in INR per gram before taxes
  const priceInrPerGramBase = (xauUsd * usdInr) / ounceToGram;
  const priceInrPer10gBase = priceInrPerGramBase * 10;

  // Import Duties (Basic Customs Duty + AIDC)
  const totalImportDutyPct = customsDutyPct + aidcPct; // e.g. 6.0% + 5.35% = 11.35% (or updated budget rate)
  const dutyAmountInrPer10g = priceInrPer10gBase * (totalImportDutyPct / 100);

  // Price landed before GST
  const landedPreGstInrPer10g = priceInrPer10gBase + dutyAmountInrPer10g + localPremiumDiscountInrPer10g;

  // GST 3% applied on landed price + premium
  const gstAmountInrPer10g = landedPreGstInrPer10g * (gstPct / 100);

  // Final domestic Indian gold price for 10 grams (24 Karat, 999 fine)
  const finalInrPer10g = landedPreGstInrPer10g + gstAmountInrPer10g;

  // Unit conversions
  let unitMultiplier = 1;
  switch (selectedUnit) {
    case '1g':
      unitMultiplier = 0.1;
      break;
    case '10g':
      unitMultiplier = 1;
      break;
    case '1kg':
      unitMultiplier = 100;
      break;
    case 'tola':
      unitMultiplier = 1.16638; // 1 tola = 11.6638 grams = 1.16638 * 10g
      break;
    case 'oz':
      unitMultiplier = 3.11035; // 1 oz = 31.1035 grams = 3.11035 * 10g
      break;
  }
  const finalInrPerUnit = finalInrPer10g * unitMultiplier;

  // Attribution calculation vs historical benchmark
  const globalMovePct = ((xauUsd - benchmarkXauUsd) / benchmarkXauUsd) * 100;
  const currencyMovePct = ((usdInr - benchmarkUsdInr) / benchmarkUsdInr) * 100;

  const benchmarkBase10g = (benchmarkXauUsd * benchmarkUsdInr * 10) / ounceToGram;
  const globalGoldEffectInr = ((xauUsd - benchmarkXauUsd) * benchmarkUsdInr * 10) / ounceToGram;
  const currencyEffectInr = (benchmarkXauUsd * (usdInr - benchmarkUsdInr) * 10) / ounceToGram;
  const domesticDutyPremiumInr = dutyAmountInrPer10g + localPremiumDiscountInrPer10g + gstAmountInrPer10g;

  let dominantDriver: 'GLOBAL_GOLD' | 'RUPEE_DEPRECIATION' | 'DOMESTIC_PREMIUM' | 'BALANCED' = 'GLOBAL_GOLD';
  if (Math.abs(currencyEffectInr) > Math.abs(globalGoldEffectInr) * 1.5) {
    dominantDriver = 'RUPEE_DEPRECIATION';
  } else if (Math.abs(globalGoldEffectInr) > Math.abs(currencyEffectInr) * 1.5) {
    dominantDriver = 'GLOBAL_GOLD';
  } else {
    dominantDriver = 'BALANCED';
  }

  return {
    xauUsd,
    usdInr,
    ounceToGram,
    customsDutyPct,
    aidcPct,
    gstPct,
    localPremiumDiscountInrPer10g,
    selectedUnit,
    landedCostUsdPerOz: xauUsd * (1 + totalImportDutyPct / 100),
    landedCostInrPerGramBase: priceInrPerGramBase,
    dutyAmountInrPer10g,
    gstAmountInrPer10g,
    finalInrPer10g,
    finalInrPerUnit,
    attribution: {
      globalGoldEffectPct: globalMovePct,
      globalGoldEffectInr,
      currencyEffectPct: currencyMovePct,
      currencyEffectInr,
      domesticDutyPremiumPct: (dutyAmountInrPer10g / priceInrPer10gBase) * 100,
      domesticDutyPremiumInr,
      dominantDriver
    }
  };
}
