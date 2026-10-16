export default {
  lead: "Work out your Bangladesh income tax for **AY 2026-27** in a minute. The result follows the e-Return order, step by step: taxable income, slabs, investment rebate, minimum tax, surcharge and tax already paid.",
  empty: "Enter your income on the left to see your tax, step by step.",
  explain: [
    ["h2", "How your income tax is worked out"],
    [
      "p",
      "Bangladesh taxes individuals on a progressive scale. A first slice of income is tax-free and each slice above it is taxed at a higher rate. The Finance Act 2026 set the same scale for **AY 2026-27 and AY 2027-28**.",
    ],
    [
      "table",
      ["Taxpayer category", "Tax-free income"],
      [
        ["General taxpayer", "৳4,00,000"],
        ["Woman, or aged 65 or more", "৳4,50,000"],
        ["Person with disability, or third gender", "৳5,25,000"],
        ["Gazetted war-wounded freedom fighter or July warrior", "৳5,50,000"],
        ["Parent or guardian of a person with disability", "+৳50,000 for each"],
      ],
      [1],
    ],
    [
      "table",
      ["Income above the threshold", "Rate"],
      [
        ["Next ৳3,00,000", "10%"],
        ["Next ৳4,00,000", "15%"],
        ["Next ৳5,00,000", "20%"],
        ["Next ৳20,00,000", "25%"],
        ["Balance", "30%"],
      ],
      [1],
    ],
    ["h3", "Worked example"],
    ["p", "A general taxpayer with taxable income of ৳12,00,000 pays:"],
    ["slabExample", { ay: "2026-27", income: 1200000 }],
    ["h2", "From gross tax to the amount you pay"],
    [
      "ol",
      [
        "**Taxable income.** For salaried people, one-third of employment income (up to ৳5,00,000) is exempt. Add any other taxable income.",
        "**Slab tax.** Apply the slabs above to the income over your tax-free threshold.",
        "**Investment rebate.** Subtract the lowest of 3% of taxable income, 10% of eligible investment and ৳7,50,000.",
        "**Minimum tax.** Once income is above the threshold you pay at least ৳5,000 (৳1,000 for new taxpayers).",
        "**Surcharge.** 10% to 35% of your tax if net wealth is above ৳4 crore, or 10% if you own more than one car or a house above 8,000 sq ft.",
        "**Credits.** Subtract tax already deducted at source or paid in advance. A positive balance is payable; a negative one is refundable.",
      ],
    ],
    [
      "callout",
      "info",
      "These rates apply to resident individuals and non-resident Bangladeshis. A non-resident who is not a Bangladeshi citizen is generally taxed at 30%. See [all rates and assessment years]({@rates}).",
    ],
  ],
  faq: [
    {
      q: "What is the tax-free income limit for AY 2026-27?",
      a: "For a general taxpayer it is ৳4,00,000. It is ৳4,50,000 for women and people aged 65 or more, ৳5,25,000 for persons with disabilities and third-gender taxpayers, and ৳5,50,000 for gazetted war-wounded freedom fighters and July warriors.",
    },
    {
      q: "Do I have to file a return if my income is below the limit?",
      a: "No income tax is due, but you may still have to file, for example if you are a government employee, a company director, a partner in a firm, or were assessed in any of the last three years.",
    },
    {
      q: "Which assessment year should I choose?",
      a: "Income earned from 1 July 2025 to 30 June 2026 is assessed in AY 2026-27, the return season that is open now. Choose AY 2027-28 to plan for income you are earning from 1 July 2026 to 30 June 2027.",
    },
    {
      q: "Is this the same as the NBR e-Return?",
      a: "It follows the same order of steps, but it is an independent estimate. Always check the figures in the e-Return before you submit.",
    },
  ],
};
