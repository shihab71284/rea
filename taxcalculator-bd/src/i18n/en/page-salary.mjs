export default {
  lead: "Enter your monthly salary and festival bonuses to see your **annual income tax**, the **monthly TDS** your employer deducts and your take-home pay. Or enter the take-home pay you want and find the gross salary that delivers it.",
  empty:
    "Enter your monthly salary on the left to see your tax and take-home pay.",
  explain: [
    ["h2", "How salary tax works in Bangladesh"],
    [
      "p",
      "Your employer estimates your tax for the year and deducts it from your pay as **tax deducted at source (TDS)**, usually in 12 equal monthly instalments. When you file your return, the TDS is credited against your final tax.",
    ],
    [
      "ol",
      [
        "**Add up the year.** Twelve months of salary, festival bonuses and any other pay from your employer.",
        "**Take the exemption.** One-third of employment income, up to ৳5,00,000, is exempt from tax.",
        "**Apply the slabs** to the rest, above your tax-free threshold (৳4,00,000 for a general taxpayer).",
        "**Subtract any investment rebate**, and apply the ৳5,000 minimum tax if it is higher.",
        "**Divide by 12** to get the monthly TDS.",
      ],
    ],
    ["h3", "Worked example: ৳1,00,000 a month"],
    [
      "p",
      "Annual salary ৳12,00,000. Exempt amount ৳4,00,000 (one-third). Taxable income ৳8,00,000. Tax ৳45,000 a year, which is **৳3,750 a month**, leaving ৳96,250 take-home.",
    ],
    [
      "callout",
      "info",
      "Your employer's payroll may round differently or adjust for mid-year joiners and raises. Treat this as a close estimate and compare it with your payslip.",
    ],
    ["h2", "Using the take-home mode"],
    [
      "p",
      "Negotiating an offer or planning a raise? Choose **Salary from take-home pay** and enter what you want to receive each month. The calculator finds the smallest gross salary that leaves you that amount after monthly TDS.",
    ],
  ],
  faq: [
    {
      q: "Is the festival bonus taxed separately?",
      a: "No. Bonuses are added to your annual employment income and taxed together with your salary. Employers normally spread the resulting annual tax evenly over 12 months.",
    },
    {
      q: "Why is the TDS on my payslip different?",
      a: "Payroll teams may use different assumptions, such as expected bonuses, investment declarations, other income or mid-year changes. Ask HR for the annual tax computation and compare each step.",
    },
    {
      q: "Do house rent and medical allowances count as income?",
      a: "Yes. All allowances and perquisites are part of employment income, and one combined exemption applies: one-third of employment income, up to ৳5,00,000.",
    },
  ],
};
