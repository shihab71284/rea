export default {
  title: "Income tax calculator",
  groups: {
    profile: "About you",
    income: "Your income",
    wealth: "Net wealth (surcharge)",
    invest: "Investments for tax rebate",
    credits: "Tax already paid",
  },
  employmentIncome: {
    label: "Annual employment income",
    hint: "Salary, bonuses and allowances before exemption. One-third (max ৳5,00,000) is exempt automatically.",
  },
  otherIncome: {
    label: "Other taxable income",
    hint: "Business, rent, interest and so on, after allowed expenses.",
  },
  dependants: {
    label: "Disabled children or dependants",
    hint: "Adds ৳50,000 to your tax-free amount for each one. Only one parent may claim.",
  },
  netWealth: {
    label: "Net wealth (assets minus liabilities)",
    hint: "Only affects the surcharge. Leave blank if it is below ৳4 crore.",
  },
  multipleCars: "I own more than one motor car",
  largeHouse: "I own house property above 8,000 sq ft",
  surchargeHint: "Either of these adds a 10% surcharge on your tax.",
  dps: {
    label: "Deposit pension scheme (DPS)",
    hint: "Up to ৳1,20,000 a year counts.",
  },
  savingsCertificates: {
    label: "Sanchayapatra and government securities",
    hint: "Up to ৳5,00,000 counts.",
  },
  lifePremium: {
    label: "Life insurance premium paid",
    hint: "Counts up to 10% of the sum assured.",
  },
  lifeSumAssured: {
    label: "Sum assured (policy value)",
    hint: "Used to apply the 10% limit to the premium.",
  },
  otherInvestment: {
    label: "Other eligible investment",
    hint: "Provident fund, listed shares, mutual funds, approved donations. Apply each item's own limit first.",
  },
  taxPaid: {
    label: "Tax already deducted or paid (TDS / AIT)",
    hint: "Source tax, advance tax and other credits you can claim.",
  },
  firstTimeFiler: {
    label: "This is my first tax return",
    hint: "New taxpayers pay a minimum tax of ৳1,000.",
  },
  result: {
    title: "Your income tax",
    headline: "Income tax for AY {ay}",
    payableLabel: "Payable after credits",
    refundLabel: "Refundable",
    effective: "Effective rate",
    marginal: "Marginal rate",
    monthly: "Per month",
    taxable: "Taxable income",
    rebate: "Investment rebate",
    ofGross: "of gross income",
    steps: {
      taxable: "Total taxable income",
      threshold: "Tax-free threshold",
      slabTax: "Tax on slabs",
      rebate: "Less: investment rebate",
      afterRebate: "Tax after rebate",
      minimum: "Minimum tax",
      surcharge: "Add: surcharge",
      total: "Total income tax",
      paid: "Less: tax already paid",
      payable: "Tax payable",
      refund: "Tax refundable",
    },
    stepNotes: {
      taxable: "Employment income less exemption, plus other income",
      exempt: "Exempt employment income: {amount}",
      threshold: "{category}",
      minimumApplied: "Applied: the computed tax is below the minimum",
      minimumNotApplied: "Not applied: tax is above the minimum",
      surchargeRate: "{rate} of tax",
    },
    slabs: {
      title: "Slab-wise calculation",
      slab: "Income slab",
      rate: "Rate",
      amount: "Income in slab",
      tax: "Tax",
      first: "First {amount}",
      next: "Next {amount}",
      rest: "Balance",
      free: "tax-free",
    },
    notes: {
      belowThreshold:
        "Your taxable income is within the tax-free threshold, so no income tax is due. You may still have to file a return, for example if you are a government employee or were assessed in the last three years.",
      minimumApplied:
        "The calculated tax is below the minimum, so the minimum tax of {amount} applies.",
      rebateLimit: "Your rebate is limited by {reason}.",
      rebateReasons: {
        income: "3% of your taxable income",
        investment: "{rate} of your eligible investment",
        cap: "the {amount} cap",
        tax: "the tax itself",
      },
      surcharge: "A {rate} surcharge applies ({reasons}).",
      surchargeReasons: {
        wealth: "net wealth above ৳4 crore",
        cars: "more than one motor car",
        house: "house property above 8,000 sq ft",
      },
      refund:
        "You have paid more than your liability. {amount} can be refunded or adjusted against future tax.",
      legacy:
        "AY 2025-26 uses the older rules: a 5% first band, a 15% rebate and a minimum tax that depends on where you live.",
      planTip:
        "Tip: investing about {invest} more in rebate-eligible instruments before 30 June {year} could cut your tax by up to {saving}.",
      employment:
        "Employment income: one-third (max ৳5,00,000) is exempt, which is {amount} here.",
    },
  },
};
