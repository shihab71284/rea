export default {
  archiveNote:
    "Looking for older years? Circulars, directives, notifications and laws for income years up to 2021-22 are in the [archive]({@archive}).",
  lead: "Every rate, slab and limit used by the calculators, taken from the Finance Act 2026. Individual rates apply to AY 2026-27 and AY 2027-28 unless a table says otherwise.",
  nav: {
    individual: "Individuals",
    company: "Companies",
    vat: "VAT and turnover tax",
    sources: "Sources",
  },
  individual: {
    title: "Individual income tax",
    thresholdsTitle: "Tax-free income by category",
    category: "Category",
    ayHeads: {
      "2025-26": "AY 2025-26",
      "2026-27": "AY 2026-27 and 2027-28",
      "2028-29": "AY 2028-29 and 2029-30",
      "2030-31": "AY 2030-31",
    },
    thresholdNote:
      "A parent or guardian of a person with a disability gets an extra ৳50,000 for each such person. The Finance Act 2026 already fixed the thresholds up to AY 2030-31.",
    slabsTitle: "Tax slabs",
    slabSets: {
      current: "AY 2026-27 and AY 2027-28 (current)",
      previous: "AY 2025-26 (previous)",
      future1: "AY 2028-29 and AY 2029-30 (legislated)",
      future2: "AY 2030-31 (legislated)",
    },
    band: "Income band",
    rate: "Rate",
    firstBand: "Up to the tax-free threshold",
    nextBand: "Next {amount}",
    rest: "Balance",
    slabNote:
      "Slabs apply to income above the tax-free threshold for your category.",
    minTitle: "Minimum tax",
    minBody:
      "Once total income is above the tax-free threshold, you pay at least the minimum tax, even if rebates would bring the tax lower.",
    minHeads: ["Case", "Minimum tax"],
    minCurrent: "AY 2026-27 onwards, everywhere in Bangladesh",
    minNew: "New taxpayer (all years)",
    minLegacy: {
      dhakaCtg: "AY 2025-26: Dhaka or Chattogram city corporation",
      otherCity: "AY 2025-26: other city corporation",
      outside: "AY 2025-26: outside a city corporation",
    },
    surchargeTitle: "Surcharge on income tax",
    surchargeBody:
      "The surcharge is a percentage of your income tax, based on net wealth.",
    surchargeHeads: ["Net wealth", "Surcharge"],
    surchargeNil: "Up to {amount}",
    surchargeBand: "Above {amount}",
    surchargeLifestyle:
      "Owning more than one motor car, or house property above 8,000 sq ft, also triggers 10%.",
    salaryTitle: "Salary exemption",
    salaryBody:
      "One-third of income from employment, up to ৳5,00,000, whichever is lower, is exempt from tax.",
    rebateTitle: "Investment rebate",
    rebateBody: "The rebate is the lowest of three amounts.",
    rebateHeads: ["Limit", "Up to AY 2025-26", "From AY 2026-27"],
    rebateRate: "Share of eligible investment",
    rebateCap: "Maximum rebate",
    rebateIncome: "Share of taxable income",
    filingTitle: "Filing: rebate and additional tax",
    filingBody:
      "Individuals can file all year. The date you file changes what you pay.",
    filingRows: {
      rebate: "1 July to 30 September: rebate of {rate} of tax, up to {cap}",
      neutral: "1 October to 31 December: no rebate or additional tax",
      additional2:
        "1 January to 31 March: additional tax of {rate}, at least {min}",
      additional5:
        "1 April to 30 June: additional tax of {rate}, at least {min}",
      delayed:
        "After 30 June: delayed return, {rate} of tax or {min}, whichever is higher",
    },
  },
  company: {
    title: "Company income tax",
    body: "Rates are fixed from AY 2026-27 to AY 2030-31. Several categories get a lower rate if every transaction goes through banking channels.",
    heads: ["Company type", "Rate", "With bank transfers"],
    none: "None",
    turnoverTitle: "Turnover tax",
    turnoverBody:
      "A minimum tax on gross receipts. It applies when it is higher than regular tax.",
    turnoverHeads: ["Business category", "Rate"],
  },
  vat: {
    title: "VAT and turnover tax",
    heads: ["Item", "Rule"],
    rows: [
      ["Standard VAT rate", "15% on most goods and services"],
      ["Reduced rates", "10%, 7.5% and 5% for specified goods and services"],
      ["Zero-rated", "Exports"],
      [
        "VAT returns",
        "Quarterly by default, due by the 15th day after the quarter; monthly filing remains optional",
      ],
      [
        "Turnover tax",
        "4% of turnover for enlisted businesses with turnover from ৳30 lakh to ৳50 lakh, until sector amounts (up to ৳2,00,000) are notified",
      ],
      ["VAT registration (BIN)", "Required above ৳50 lakh annual turnover"],
      ["Imported services", "15% by reverse charge"],
      [
        "Supplementary duty",
        "Product-specific; VAT is charged on price plus SD",
      ],
    ],
  },
};
