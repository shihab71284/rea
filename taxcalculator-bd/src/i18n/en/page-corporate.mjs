export default {
  lead: "Estimate company income tax from the **Finance Act 2026 rate card** and see whether turnover tax applies instead. Choose your company type, switch on bank-transfer compliance if it applies, and enter your taxable profit and gross receipts.",
  empty: "Enter your taxable profit or gross receipts to see the tax.",
  explain: [
    ["h2", "Company tax rates, AY 2026-27 to AY 2030-31"],
    [
      "p",
      "The Finance Act 2026 fixed company tax rates for five assessment years. Several categories get a **lower rate if every transaction goes through banking channels**.",
    ],
    [
      "table",
      ["Company type", "Rate", "With full bank-transfer compliance"],
      [
        [
          "Listed company, at least 10% of capital offered to the public",
          "22.5%",
          "20%",
        ],
        ["Listed company, less than 10% offered", "25%", "22.5%"],
        ["Other company", "27.5%", "25%"],
        ["Bank, insurer or financial institution, listed", "37.5%", "None"],
        ["Bank, insurer or financial institution, not listed", "40%", "None"],
        ["Tobacco manufacturer", "45%", "None"],
        ["Mobile phone operator", "45%", "None"],
        ["Firm, trust or association of persons", "27.5%", "None"],
        ["Registered cooperative society", "20%", "None"],
        [
          "Private university, medical, dental or engineering college",
          "5%",
          "None",
        ],
      ],
      [1, 2],
    ],
    ["h2", "Turnover tax"],
    [
      "p",
      "Turnover tax is a minimum tax on gross receipts. If it is **higher than your regular tax**, it applies, even in a loss year. Any excess over regular tax can be carried forward against future regular tax.",
    ],
    [
      "table",
      ["Business category", "Rate on gross receipts"],
      [
        ["General business", "1%"],
        ["Tobacco manufacturer", "3%"],
        ["Carbonated or sweetened drinks", "2.5%"],
        ["Mobile operator or NTTN", "1.5%"],
        ["New manufacturing, first three years of production", "0.2%"],
      ],
      [1],
    ],
    [
      "callout",
      "warn",
      "The bank-transfer condition is strict. A single cash transaction can forfeit the reduced rate for the whole year, so confirm your records before relying on it.",
    ],
  ],
  faq: [
    {
      q: "What is the corporate tax rate in Bangladesh for 2026-27?",
      a: "Most unlisted companies pay 27.5%, or 25% if every transaction goes through banking channels. Listed companies pay 20% to 25%, depending on how much capital was offered to the public.",
    },
    {
      q: "What is turnover tax?",
      a: "A minimum tax on gross receipts, 1% for most businesses. If it is higher than your regular tax it applies instead, even if you made a loss.",
    },
    {
      q: "Are these rates fixed?",
      a: "The Finance Act 2026 fixed them from AY 2026-27 to AY 2030-31, although a later Finance Act can still change them.",
    },
  ],
};
