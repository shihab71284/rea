export default {
  title: "Tax rebate planner",
  groups: {
    profile: "About you",
    income: "Your income",
    invest: "Your investments",
  },
  investHint:
    "Enter what you have invested, or plan to invest, during the income year.",
  result: {
    headline: "Tax saved by investment rebate",
    sub: "Slab tax falls from {before} to {after}",
    eligible: "Eligible investment",
    max: "Maximum rebate",
    needed: "Invest for the maximum",
    extra: "Extra to invest",
    limits: {
      title: "Your rebate is the lowest of three limits",
      limit: "Limit",
      amount: "Amount",
      income: "3% of taxable income",
      investment: "{rate} of eligible investment",
      cap: "Maximum rebate allowed",
      status: "Result",
      lowest: "Applies",
    },
    chart: {
      title: "Rebate by amount invested",
      label:
        "The rebate rises with the amount invested until it reaches the maximum, then stays flat.",
    },
    instruments: {
      title: "What counts as eligible",
      item: "Investment or payment",
      limit: "Counts up to",
      upTo: "{amount} a year",
      dps: "Deposit pension scheme (DPS)",
      savings: "Sanchayapatra and government securities",
      life: "Life insurance premium",
      lifeLimit: "10% of the sum assured",
      pf: "Recognised provident fund",
      pfLimit: "Your contribution",
      funds: "Mutual funds, ETFs and new listed shares",
      fundsLimit: "Eligible. The ৳5 lakh cap on mutual funds was removed",
      donations: "Zakat fund and approved donations",
      donationsLimit: "Within the limits in the law",
    },
    notes: {
      open: "To count for AY {ay}, investments must be made by 30 June {year}.",
      closed:
        "The income year for AY {ay} has ended, so new investments will not count for it. Choose AY 2027-28 to plan ahead.",
      noTax:
        "Your income is within the tax-free threshold, so there is no tax to reduce.",
      more: "Invest {extra} more to reach the maximum rebate of {max}.",
      maxed: "You have reached the maximum rebate for your income.",
      minimum:
        "The minimum tax of {amount} still applies once your income is above the threshold.",
      advice:
        "A rebate is a tax saving, not a return on the investment. Choose instruments for their risk, return and lock-in period. This is not investment advice.",
    },
  },
};
