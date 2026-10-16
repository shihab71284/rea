export default {
  title: "Corporate tax calculator",
  groups: { company: "Your company", figures: "Figures for the year" },
  type: {
    label: "Company type",
    hint: "The Finance Act 2026 rate card applies from AY 2026-27 to AY 2030-31.",
  },
  types: {
    publicIpo10:
      "Listed company: at least 10% of capital offered to the public",
    publicIpoLess: "Listed company: less than 10% offered to the public",
    otherCompany: "Other company (including private limited)",
    bankListed: "Bank, insurer or financial institution: listed",
    bankUnlisted: "Bank, insurer or financial institution: not listed",
    tobacco: "Tobacco manufacturer",
    mno: "Mobile phone operator",
    firmAop: "Firm, trust or association of persons",
    cooperative: "Registered cooperative society",
    privateEdu: "Private university, medical, dental or engineering college",
  },
  bankTransfers: {
    label: "All transactions go through banking channels",
    hint: "Needed for the reduced rate. A single cash transaction can lose it for the whole year.",
  },
  taxableProfit: {
    label: "Taxable profit",
    hint: "Net profit after adding back disallowed expenses.",
  },
  grossReceipts: {
    label: "Gross receipts (turnover)",
    hint: "Sales and service receipts excluding VAT and SD. Used for the turnover-tax check.",
  },
  turnoverCategory: {
    label: "Business category for turnover tax",
    general: "General business",
    tobacco: "Tobacco manufacturer",
    beverage: "Carbonated or sweetened drinks",
    telecom: "Mobile operator or NTTN",
    newIndustry: "New manufacturing, first 3 years",
  },
  taxPaid: {
    label: "Tax already paid or deducted",
    hint: "Advance tax and tax deducted at source that you can credit.",
  },
  result: {
    headline: "Company income tax for AY {ay}",
    sub: "{rate} on taxable profit of {profit}",
    subTurnover:
      "Turnover tax of {tax} applies because it is higher than regular tax",
    regular: "Regular tax",
    turnover: "Turnover tax",
    after: "Profit after tax",
    effective: "Effective rate",
    payableLabel: "Payable after credits",
    refundLabel: "Refundable",
    steps: {
      profit: "Taxable profit",
      rate: "Tax rate",
      regular: "Regular tax on profit",
      turnover: "Turnover tax on receipts",
      total: "Tax liability (the higher of the two)",
      paid: "Less: tax already paid",
      payable: "Tax payable",
      refund: "Tax refundable",
    },
    stepNotes: {
      reduced: "Reduced rate for full bank-transfer compliance",
      standard: "Standard rate",
      turnover: "{rate} of {receipts}",
      none: "No gross receipts entered",
      higher: "Turnover tax is higher, so it applies",
    },
    notes: {
      reducedAvailable:
        "A lower rate of {rate} applies if all your transactions go through banking channels. Switch that on above to see the effect.",
      reducedConditions:
        "The reduced rate is strict: a single cash transaction can forfeit it for the whole year.",
      turnoverApplies:
        "Turnover tax applies even in a loss year. Any excess over regular tax can be carried forward against future regular tax.",
      bank: "Banks, insurers and financial institutions have no reduced rate.",
      opc: "One-person companies and special cases may be treated differently. Confirm the rate in the Finance Act 2026 schedule or with a tax professional.",
    },
  },
};
