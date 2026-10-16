/**
 * Bangladesh tax rules used by every calculator on TaxCalculator.bd.
 *
 * This file is the single source of truth. When a new Finance Act is passed,
 * update the figures here and the golden values in tests/.
 *
 * Primary references (checked on `rulesVerifiedOn` in site.config.mjs):
 *  - Finance Act 2026 (effective 1 July 2026) amending the Income Tax Act 2023
 *  - PwC Bangladesh, "Finance Act, 2026: Key Amendments" (June 2026)
 *  - PwC Worldwide Tax Summaries - Bangladesh (individual: taxes on personal
 *    income, deductions, tax administration)
 *  - NBR (nbr.gov.bd) Finance Acts / Income Tax Act 2023 portals
 *
 * All money is in BDT (taka). Rates are percentages (10 means 10%).
 */

export const LAKH = 100_000;
export const CRORE = 10_000_000;

/** Assessment years offered in the calculators (newest first). */
export const CALCULATOR_AYS = ["2027-28", "2026-27", "2025-26"];
export const DEFAULT_AY = "2026-27";

/** Taxpayer categories (tax-free threshold differs by category). */
export const CATEGORIES = [
  "general",
  "womanSenior",
  "disabled",
  "thirdGender",
  "freedomFighter",
];

/** Extra tax-free amount for a parent/guardian of each disabled person. */
export const DISABLED_DEPENDANT_EXTRA = 50_000;

const SLABS_AY_2025_26 = [
  { width: 100_000, rate: 5 },
  { width: 400_000, rate: 10 },
  { width: 500_000, rate: 15 },
  { width: 500_000, rate: 20 },
  { width: 2_000_000, rate: 25 },
  { width: Infinity, rate: 30 },
];

const SLABS_FA_2026 = [
  { width: 300_000, rate: 10 },
  { width: 400_000, rate: 15 },
  { width: 500_000, rate: 20 },
  { width: 2_000_000, rate: 25 },
  { width: Infinity, rate: 30 },
];

/** From AY 2028-29 a 35% band applies to income above BDT 3 crore. */
const withTopBand = (band30) => [
  ...SLABS_FA_2026.slice(0, 4),
  { width: band30, rate: 30 },
  { width: Infinity, rate: 35 },
];

const THRESHOLDS_AY_2025_26 = {
  general: 350_000,
  womanSenior: 400_000,
  disabled: 475_000,
  thirdGender: 475_000,
  freedomFighter: 500_000,
};

const THRESHOLDS_AY_2026_27 = {
  general: 400_000,
  womanSenior: 450_000,
  disabled: 525_000,
  thirdGender: 525_000,
  freedomFighter: 550_000,
};

const THRESHOLDS_AY_2028_29 = {
  general: 450_000,
  womanSenior: 500_000,
  disabled: 575_000,
  thirdGender: 575_000,
  freedomFighter: 600_000,
};

const THRESHOLDS_AY_2030_31 = {
  general: 500_000,
  womanSenior: 550_000,
  disabled: 625_000,
  thirdGender: 625_000,
  freedomFighter: 650_000,
};

/** Investment-rebate parameters. Finance Act 2026 cut 15% -> 10% and 10 -> 7.5 lakh. */
const REBATE_LEGACY = { rate: 15, cap: 1_000_000 };
const REBATE_FA_2026 = { rate: 10, cap: 750_000 };

/** Minimum tax. Until AY 2025-26 it depended on where the taxpayer lives. */
const MIN_TAX_BY_AREA = { dhakaCtg: 5_000, otherCity: 4_000, outside: 3_000 };

export const MIN_TAX_FLAT = 5_000;
export const MIN_TAX_NEW_TAXPAYER = 1_000;

export const AREAS = ["dhakaCtg", "otherCity", "outside"];

export const AY_RULES = {
  "2025-26": {
    slabs: SLABS_AY_2025_26,
    thresholds: THRESHOLDS_AY_2025_26,
    rebate: REBATE_LEGACY,
    minTaxByArea: MIN_TAX_BY_AREA,
  },
  "2026-27": {
    slabs: SLABS_FA_2026,
    thresholds: THRESHOLDS_AY_2026_27,
    rebate: REBATE_FA_2026,
    minTaxFlat: MIN_TAX_FLAT,
  },
  "2027-28": {
    slabs: SLABS_FA_2026,
    thresholds: THRESHOLDS_AY_2026_27,
    rebate: REBATE_FA_2026,
    minTaxFlat: MIN_TAX_FLAT,
  },
  "2028-29": {
    slabs: withTopBand(26_350_000),
    thresholds: THRESHOLDS_AY_2028_29,
    rebate: REBATE_FA_2026,
    minTaxFlat: MIN_TAX_FLAT,
  },
  "2029-30": {
    slabs: withTopBand(26_350_000),
    thresholds: THRESHOLDS_AY_2028_29,
    rebate: REBATE_FA_2026,
    minTaxFlat: MIN_TAX_FLAT,
  },
  "2030-31": {
    slabs: withTopBand(26_300_000),
    thresholds: THRESHOLDS_AY_2030_31,
    rebate: REBATE_FA_2026,
    minTaxFlat: MIN_TAX_FLAT,
  },
};

/** Years shown on the rates page (calculators only accept CALCULATOR_AYS). */
export const RATE_TABLE_AYS = [
  "2025-26",
  "2026-27",
  "2027-28",
  "2028-29",
  "2029-30",
  "2030-31",
];

/** Exempt part of employment income: lower of one-third or BDT 5 lakh. */
export const EMPLOYMENT_EXEMPTION = { divisor: 3, cap: 500_000 };

/** Rebate base: percentage of qualifying taxable income. */
export const REBATE_INCOME_PERCENT = 3;

/** Per-instrument limits for rebate-eligible investments. */
export const REBATE_LIMITS = {
  dps: 120_000,
  savingsCertificates: 500_000,
  lifeInsuranceMaxPercentOfSum: 10,
};

/** Surcharge on income tax by net wealth (BDT). `above` is exclusive. */
export const SURCHARGE_TIERS = [
  { above: 500 * 10 * LAKH, rate: 35 },
  { above: 200 * 10 * LAKH, rate: 30 },
  { above: 100 * 10 * LAKH, rate: 20 },
  { above: 40 * 10 * LAKH, rate: 10 },
];

/** 10% surcharge is also triggered by owning >1 motor car or a >8,000 sq ft house. */
export const SURCHARGE_LIFESTYLE_RATE = 10;
export const LARGE_HOUSE_SQFT = 8_000;

/** Early-filing rebate and late-filing additional tax (individuals, from AY 2026-27). */
export const FILING = {
  rebateRate: 5,
  rebateCap: 25_000,
  additional: [
    { rate: 2, min: 3_000 },
    { rate: 5, min: 5_000 },
  ],
  delayed: { rate: 10, min: 5_000 },
  reassessment: { rate: 15, min: 10_000 },
};

/** Company income-tax rate card, AY 2026-27 to AY 2030-31. */
export const COMPANY_TYPES = [
  { id: "publicIpo10", rate: 22.5, reducedRate: 20 },
  { id: "publicIpoLess", rate: 25, reducedRate: 22.5 },
  { id: "otherCompany", rate: 27.5, reducedRate: 25 },
  { id: "bankListed", rate: 37.5 },
  { id: "bankUnlisted", rate: 40 },
  { id: "tobacco", rate: 45 },
  { id: "mno", rate: 45 },
  { id: "firmAop", rate: 27.5 },
  { id: "cooperative", rate: 20 },
  { id: "privateEdu", rate: 5 },
];

/** Turnover tax (minimum tax on gross receipts) by business category. */
export const TURNOVER_TAX = [
  { id: "general", rate: 1 },
  { id: "tobacco", rate: 3 },
  { id: "beverage", rate: 2.5 },
  { id: "telecom", rate: 1.5 },
  { id: "newIndustry", rate: 0.2 },
];

/** VAT presets (percent). Standard rate is 15%. */
export const VAT_STANDARD_RATE = 15;
export const VAT_PRESETS = [15, 10, 7.5, 5, 0];

/** Small-business turnover tax: BDT 30 lakh - 50 lakh turnover, 4% until sector amounts are notified. */
export const SMALL_BUSINESS_TURNOVER_TAX = {
  rate: 4,
  enlistmentFrom: 30 * LAKH,
  vatRegistrationAbove: 50 * LAKH,
};

/** Official portals referenced throughout the site. */
export const OFFICIAL_LINKS = {
  nbr: "https://nbr.gov.bd/",
  financeActs: "https://nbr.gov.bd/regulations/acts/finance-acts",
  incomeTaxActs: "https://nbr.gov.bd/regulations/acts/income-tax-acts",
  etin: "https://secure.incometax.gov.bd/",
  ereturn: "https://etaxnbr.gov.bd/",
  verifyReturn: "https://etaxnbr.gov.bd/#/submission-verification",
  achallan: "https://ibas.finance.gov.bd/acs",
  vat: "https://vat.gov.bd/",
};

/** Third-party references used to verify the rules (shown as "Sources"). */
export const SOURCES = {
  pwcFinanceAct: {
    title: "PwC Bangladesh - Finance Act, 2026: Key Amendments (June 2026)",
    url: "https://www.pwc.com/bd/en/assets/pdfs/budget/finance-act-2026-key-amendments.pdf",
  },
  pwcPersonal: {
    title: "PwC Worldwide Tax Summaries - Bangladesh: taxes on personal income",
    url: "https://taxsummaries.pwc.com/bangladesh/individual/taxes-on-personal-income",
  },
  pwcDeductions: {
    title: "PwC Worldwide Tax Summaries - Bangladesh: individual deductions",
    url: "https://taxsummaries.pwc.com/bangladesh/individual/deductions",
  },
  pwcAdmin: {
    title: "PwC Worldwide Tax Summaries - Bangladesh: tax administration",
    url: "https://taxsummaries.pwc.com/bangladesh/individual/tax-administration",
  },
  nbrFinanceActs: {
    title: "National Board of Revenue - Finance Acts",
    url: OFFICIAL_LINKS.financeActs,
  },
  nbrIncomeTaxAct: {
    title: "National Board of Revenue - Income Tax Act 2023",
    url: OFFICIAL_LINKS.incomeTaxActs,
  },
};

/** "2026-27" -> { ay, incomeYear: "2025-26", startYear: 2026 } */
export function ayInfo(ay) {
  const startYear = Number(ay.slice(0, 4));
  const prev = startYear - 1;
  const incomeYear = `${prev}-${String(startYear).slice(2)}`;
  return { ay, incomeYear, startYear };
}
