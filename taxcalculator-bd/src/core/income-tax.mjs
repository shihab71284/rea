import {
  AY_RULES,
  DEFAULT_AY,
  DISABLED_DEPENDANT_EXTRA,
  EMPLOYMENT_EXEMPTION,
  MIN_TAX_NEW_TAXPAYER,
  SURCHARGE_LIFESTYLE_RATE,
  SURCHARGE_TIERS,
} from "./rules.mjs";
import { roundTaka } from "./format.mjs";
import { computeRebate } from "./rebate.mjs";

const nonNegWhole = (n) => (Number.isFinite(n) && n > 0 ? roundTaka(n) : 0);

/** Tax-free threshold for the category plus BDT 50,000 per disabled dependant. */
export function thresholdFor(ay, category = "general", dependants = 0) {
  const table = AY_RULES[ay].thresholds;
  const base = table[category] ?? table.general;
  const count = Math.max(0, Math.floor(Number(dependants) || 0));
  const extra = count * DISABLED_DEPENDANT_EXTRA;
  return { base, extra, total: base + extra, dependants: count };
}

/** Exempt part of employment income: lower of one-third or BDT 5 lakh. */
export function employmentExemption(employmentIncome) {
  const income = nonNegWhole(employmentIncome);
  return Math.min(
    roundTaka(income / EMPLOYMENT_EXEMPTION.divisor),
    EMPLOYMENT_EXEMPTION.cap,
  );
}

/** Progressive tax on `taxableIncome` above `threshold`, with a row per slab. */
export function slabTax(taxableIncome, threshold, ay) {
  const rows = [
    {
      from: 0,
      to: threshold,
      width: threshold,
      amount: Math.min(taxableIncome, threshold),
      rate: 0,
      tax: 0,
    },
  ];
  let remaining = Math.max(0, taxableIncome - threshold);
  let from = threshold;
  let total = 0;
  let marginalRate = 0;
  for (const slab of AY_RULES[ay].slabs) {
    const amount = Math.min(remaining, slab.width);
    const tax = roundTaka((amount * slab.rate) / 100);
    rows.push({
      from,
      to: from + slab.width,
      width: slab.width,
      amount,
      rate: slab.rate,
      tax,
    });
    if (amount > 0) marginalRate = slab.rate;
    total += tax;
    remaining -= amount;
    from += slab.width;
  }
  return { total, rows, marginalRate };
}

/** Surcharge rate (% of tax) from net wealth, plus the 10% car/house triggers. */
export function surchargeFor({
  netWealth = 0,
  multipleCars = false,
  largeHouse = false,
} = {}) {
  const tier = SURCHARGE_TIERS.find((candidate) => netWealth > candidate.above);
  const reasons = [];
  let rate = 0;
  if (tier) {
    rate = tier.rate;
    reasons.push({ kind: "wealth", rate: tier.rate });
  }
  if (multipleCars)
    reasons.push({ kind: "cars", rate: SURCHARGE_LIFESTYLE_RATE });
  if (largeHouse)
    reasons.push({ kind: "house", rate: SURCHARGE_LIFESTYLE_RATE });
  if ((multipleCars || largeHouse) && rate < SURCHARGE_LIFESTYLE_RATE) {
    rate = SURCHARGE_LIFESTYLE_RATE;
  }
  return { rate, reasons };
}

/** Minimum tax payable once income exceeds the tax-free threshold. */
export function minimumTaxFor({ ay, firstTime = false, area = "dhakaCtg" }) {
  if (firstTime) return MIN_TAX_NEW_TAXPAYER;
  const rule = AY_RULES[ay];
  return (
    rule.minTaxFlat ?? rule.minTaxByArea[area] ?? rule.minTaxByArea.dhakaCtg
  );
}

/**
 * Full individual income-tax computation (resident individual / Bangladeshi
 * citizen). Mirrors the e-Return order:
 *  1 taxable income, 2 tax-free threshold, 3 slab tax, 4 less rebate,
 *  5 net tax, 6 minimum tax, 7 add surcharge, 8 less tax already paid,
 *  9 payable (or refundable).
 */
export function computeIncomeTax(input = {}) {
  const ay = AY_RULES[input.ay] ? input.ay : DEFAULT_AY;
  const employment = nonNegWhole(input.employmentIncome);
  const other = nonNegWhole(input.otherIncome);
  const exempt = employmentExemption(employment);
  const totalTaxable = employment - exempt + other;

  const threshold = thresholdFor(ay, input.category, input.dependants);
  const slab = slabTax(totalTaxable, threshold.total, ay);
  const rebate = computeRebate({
    ay,
    totalIncome: totalTaxable,
    grossTax: slab.total,
    dps: input.dps,
    savingsCertificates: input.savingsCertificates,
    lifePremium: input.lifePremium,
    lifeSumAssured: input.lifeSumAssured,
    otherInvestment: input.otherInvestment,
  });

  const afterRebate = Math.max(0, slab.total - rebate.amount);
  const exceedsThreshold = totalTaxable > threshold.total;
  const minimumTax = exceedsThreshold
    ? minimumTaxFor({
        ay,
        firstTime: Boolean(input.firstTimeFiler),
        area: input.area,
      })
    : 0;
  const taxBeforeSurcharge = exceedsThreshold
    ? Math.max(afterRebate, minimumTax)
    : 0;
  const surcharge = surchargeFor({
    netWealth: nonNegWhole(input.netWealth),
    multipleCars: Boolean(input.multipleCars),
    largeHouse: Boolean(input.largeHouse),
  });
  const surchargeAmount = roundTaka(
    (taxBeforeSurcharge * surcharge.rate) / 100,
  );
  const totalTax = taxBeforeSurcharge + surchargeAmount;
  const taxPaid = nonNegWhole(input.taxPaid);
  const grossIncome = employment + other;

  return {
    ay,
    income: {
      employment,
      exempt,
      taxableEmployment: employment - exempt,
      other,
      totalTaxable,
      gross: grossIncome,
    },
    threshold,
    exceedsThreshold,
    slab,
    grossTax: slab.total,
    rebate,
    afterRebate,
    minimumTax,
    minimumApplied: exceedsThreshold && minimumTax > afterRebate,
    taxBeforeSurcharge,
    surcharge: { ...surcharge, amount: surchargeAmount },
    totalTax,
    taxPaid,
    payable: totalTax - taxPaid,
    monthlyTax: roundTaka(totalTax / 12),
    effectiveRate: grossIncome > 0 ? totalTax / grossIncome : 0,
    marginalRate: slab.marginalRate,
  };
}
