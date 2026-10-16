export default {
  title: "Salary tax calculator",
  mode: {
    label: "What do you want to find?",
    gross: "Tax from gross salary",
    net: "Salary from take-home pay",
  },
  monthlyGross: {
    label: "Monthly gross salary",
    hint: "Basic, house rent, medical, conveyance and every other allowance, before tax.",
  },
  targetNet: {
    label: "Monthly take-home pay you want",
    hint: "We find the smallest gross salary that leaves you this much after monthly TDS.",
  },
  bonusCount: {
    label: "Festival bonuses a year",
    hint: "For example 2 for Eid-ul-Fitr and Eid-ul-Adha.",
  },
  bonusAmount: {
    label: "Amount of each bonus",
    hint: "Often one month's basic salary.",
  },
  otherIncome: {
    label: "Other taxable income for the year",
    hint: "Rent, interest or business income after allowed expenses.",
  },
  groups: { profile: "About you", pay: "Your pay", more: "More options" },
  result: {
    headlineGross: "Monthly income tax (TDS)",
    headlineNet: "Monthly gross salary needed",
    subGross: "Annual tax {tax} · effective rate {rate}",
    subNet: "to take home {net} after {tds} TDS each month",
    takeHome: "Take-home per month",
    gross: "Monthly gross",
    taxableYear: "Taxable salary (year)",
    annualTax: "Annual tax",
    monthlyTds: "Monthly TDS",
    rate: "Effective rate",
    monthly: {
      title: "Pay and tax at a glance",
      item: "Item",
      perMonth: "Per month",
      perYear: "Per year",
      gross: "Gross salary",
      bonus: "Festival bonuses",
      tds: "Income tax (TDS)",
      net: "Take-home pay",
    },
    notes: {
      spread:
        "Employers usually deduct the annual tax in 12 equal monthly instalments. Bonus months are not taxed separately.",
      below:
        "At this salary you stay within the tax-free threshold, so no TDS is due.",
    },
  },
};
