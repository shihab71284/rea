export default {
  lead: "Add VAT to a price, take it out of a VAT-inclusive price, price in supplementary duty, or build a multi-line invoice. The standard VAT rate is **15%**; reduced rates of 10%, 7.5% and 5% apply to specified goods and services.",
  empty: "Enter a price to see the VAT and supplementary duty.",
  explain: [
    ["h2", "How VAT and supplementary duty are calculated"],
    [
      "p",
      "VAT (value added tax) is charged under the VAT and Supplementary Duty Act 2012. The standard rate is **15%**. Some goods and services have reduced or fixed rates, and exports are zero-rated.",
    ],
    [
      "ol",
      [
        "Start with the price before tax.",
        "Add **supplementary duty** (SD) if the product carries it. SD rates differ by product.",
        "Charge **VAT** on the price plus SD.",
        "The customer pays the total.",
      ],
    ],
    [
      "table",
      ["Example", "Amount"],
      [
        ["Price before tax", "৳1,000"],
        ["Supplementary duty at 20%", "৳200"],
        ["Value on which VAT is charged", "৳1,200"],
        ["VAT at 15%", "৳180"],
        ["**Total price**", "**৳1,380**"],
      ],
      [1],
    ],
    ["h2", "What changed for VAT in 2026-27"],
    [
      "ul",
      [
        "VAT returns are now filed **quarterly** by default, due by the 15th day after the quarter ends. Monthly filing remains an option, due by the last day of the next month.",
        "**Imported services** are taxed at 15% by reverse charge, collected by the bank when the payment is remitted.",
        "Startups registered under the Income Tax Act 2023 are **exempt** from VAT on their supplies.",
        "A VAT registration number (BIN) is now needed for key business steps such as opening a bank account or renewing a trade licence.",
      ],
    ],
    ["h2", "Turnover tax for small businesses"],
    [
      "p",
      "Businesses with annual turnover between ৳30 lakh and ৳50 lakh enlist for turnover tax instead of charging VAT: **4% of turnover** with no input credit, until the government notifies fixed sector amounts (capped at ৳2,00,000).",
    ],
    [
      "callout",
      "info",
      "VAT rules are detailed and sector-specific. Check the applicable SRO, or ask a VAT professional, for truncated-base rates, fixed amounts and exemptions.",
    ],
  ],
  faq: [
    {
      q: "What is the standard VAT rate in Bangladesh?",
      a: "15%. Reduced rates of 10%, 7.5% and 5% apply to specified goods and services, and exports are zero-rated.",
    },
    {
      q: "Is VAT charged before or after supplementary duty?",
      a: "After. VAT is charged on the price plus supplementary duty.",
    },
    {
      q: "How often are VAT returns filed now?",
      a: "Quarterly by default from 1 July 2026, due by the 15th day after the quarter ends. Monthly filing is still available and is due by the last day of the following month.",
    },
    {
      q: "Who has to register for VAT?",
      a: "Businesses with annual turnover above ৳50 lakh need a BIN, and those between ৳30 lakh and ৳50 lakh enlist for turnover tax. Check the NBR for the current thresholds before you decide.",
    },
  ],
};
