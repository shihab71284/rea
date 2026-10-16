import { AY_RULES, REBATE_INCOME_PERCENT, REBATE_LIMITS } from "./rules.mjs";
import { roundTaka } from "./format.mjs";

const nonNeg = (n) => (Number.isFinite(n) && n > 0 ? n : 0);

/**
 * Apply per-instrument limits to what the taxpayer invested during the income year.
 * Accepts the flat calculator input (dps, savingsCertificates, lifePremium,
 * lifeSumAssured, otherInvestment).
 */
export function eligibleInvestment(input = {}) {
  const dps = nonNeg(input.dps);
  const savings = nonNeg(input.savingsCertificates);
  const premium = nonNeg(input.lifePremium);
  const sum = nonNeg(input.lifeSumAssured);
  const other = nonNeg(input.otherInvestment);
  const lifeLimit =
    sum > 0 ? (sum * REBATE_LIMITS.lifeInsuranceMaxPercentOfSum) / 100 : null;
  const parts = [
    part("dps", dps, REBATE_LIMITS.dps),
    part("savingsCertificates", savings, REBATE_LIMITS.savingsCertificates),
    part("life", premium, lifeLimit),
    part("other", other, null),
  ];
  return {
    entered: parts.reduce((total, p) => total + p.entered, 0),
    total: parts.reduce((total, p) => total + p.allowed, 0),
    parts,
  };
}

function part(key, entered, limit) {
  const allowed = limit === null ? entered : Math.min(entered, limit);
  return { key, entered, allowed, limit };
}

/**
 * Investment rebate = lowest of
 *   3% of qualifying taxable income,
 *   10% of eligible investment (15% up to AY 2025-26),
 *   BDT 7.5 lakh (BDT 10 lakh up to AY 2025-26),
 * and never more than the tax itself.
 */
export function computeRebate({ ay, totalIncome, grossTax, ...investments }) {
  const rule = AY_RULES[ay].rebate;
  const eligible = eligibleInvestment(investments);
  const byIncome = roundTaka(
    (nonNeg(totalIncome) * REBATE_INCOME_PERCENT) / 100,
  );
  const byInvestment = roundTaka((eligible.total * rule.rate) / 100);
  const candidates = [
    ["income", byIncome],
    ["investment", byInvestment],
    ["cap", rule.cap],
  ];
  const [binding, lowest] = candidates.reduce((best, next) =>
    next[1] < best[1] ? next : best,
  );
  return {
    rate: rule.rate,
    cap: rule.cap,
    eligible,
    byIncome,
    byInvestment,
    binding,
    amount: Math.min(lowest, nonNeg(grossTax)),
    limitedByTax: lowest > nonNeg(grossTax),
  };
}

/** How much to invest to earn the largest possible rebate at a given taxable income. */
export function planRebate({ ay, totalIncome }) {
  const rule = AY_RULES[ay].rebate;
  const maxRebate = Math.min(
    roundTaka((nonNeg(totalIncome) * REBATE_INCOME_PERCENT) / 100),
    rule.cap,
  );
  return {
    rate: rule.rate,
    cap: rule.cap,
    maxRebate,
    investmentNeeded: Math.ceil((maxRebate * 100) / rule.rate),
  };
}
