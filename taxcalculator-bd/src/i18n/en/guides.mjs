export default {
  index: {
    lead: "Plain-language explainers for Bangladesh tax, written for people who are not accountants and linked to calculators so you can try the numbers yourself.",
    toc: "On this page",
    read: "Read the guide",
    minutes: "{n} min read",
    next: "Keep reading",
    tryTool: "Try the calculator",
  },
  items: {
    financeAct2026: {
      title: "The Finance Act 2026: what changed for taxpayers",
      description:
        "The changes that matter most to individuals, companies and VAT-registered businesses from 1 July 2026, in plain language.",
      minutes: 5,
      tool: "income",
      blocks: [
        [
          "p",
          "The Finance Act 2026 took effect on **1 July 2026**, the start of FY 2026-27. It amends the Income Tax Act 2023, the VAT and Supplementary Duty Act 2012 and the Customs Act 2023. Here is what matters most to ordinary taxpayers and small businesses.",
        ],
        ["h2", "Individuals"],
        [
          "ul",
          [
            "**Higher tax-free income.** ৳4,00,000 for a general taxpayer in AY 2026-27 and 2027-28, rising to ৳4,50,000 in AY 2028-29 and 2029-30 and ৳5,00,000 from AY 2030-31. Women and people aged 65+ get ৳50,000 more, persons with disabilities and third-gender taxpayers ৳1,25,000 more, and war-wounded freedom fighters and July warriors ৳1,50,000 more.",
            "**No 5% slab.** The first band above the threshold is now taxed at 10%. Slabs are 10%, 15%, 20%, 25% and 30%, with a 35% band on income above ৳3 crore from AY 2028-29.",
            "**Smaller investment rebate.** The rebate is now the lowest of 3% of taxable income, 10% of eligible investment (it was 15%) and ৳7.5 lakh (it was ৳10 lakh).",
            "**Flat minimum tax.** ৳5,000 for everyone above the threshold, wherever they live, and ৳1,000 for new taxpayers.",
            "**File all year.** A 5% rebate (up to ৳25,000) for filing from July to September, additional tax of 2% or 5% from January, and delayed-return charges after 30 June.",
            "**Mandatory e-filing.** Most individuals must file through the NBR e-Return portal.",
            "**Withholding is no longer final.** Tax withheld on sanchayapatra profit and some other income is credited when you file, instead of being the final tax.",
          ],
        ],
        ["h2", "Companies"],
        [
          "ul",
          [
            "**A fixed rate card for five years** (AY 2026-27 to AY 2030-31): 27.5% for most unlisted companies, or 25% with full bank-transfer compliance, and 20% to 25% for listed companies.",
            "**Banks, insurers and financial institutions:** 37.5% if listed and 40% if not.",
            "**Private universities and colleges:** 5%.",
            "**Turnover tax:** 2.5% for carbonated and sweetened drinks, 1.5% for NTTN operators and 0.2% for new manufacturers in their first three years.",
          ],
        ],
        ["h2", "VAT"],
        [
          "ul",
          [
            "**Quarterly returns** are the default. Monthly filing stays optional.",
            "**Imported services** attract 15% VAT by reverse charge.",
            "**A BIN** is needed for bank accounts, loans, trade-licence renewal and more.",
            "**Startups** registered under the Income Tax Act 2023 are exempt from VAT.",
            "**Old VAT disputes** can be settled with capped interest if paid by 31 December 2026.",
          ],
        ],
        ["h2", "Disputes"],
        [
          "p",
          "The deposit needed to appeal an income tax assessment fell sharply: 1% before the Commissioner of Taxes (Appeals), 3% at the Tribunal and 10% at the High Court Division.",
        ],
        [
          "callout",
          "info",
          "See every figure on the [rates page]({@rates}) and try your own numbers in the [calculators]({@hub}).",
        ],
      ],
    },
    calculateIncomeTax: {
      title: "How to calculate income tax in Bangladesh, step by step",
      description:
        "A worked example that takes you from salary and other income to the tax you actually pay for AY 2026-27.",
      minutes: 5,
      tool: "income",
      blocks: [
        [
          "p",
          "Income tax looks complicated until you see it as a short sequence of steps. This guide walks through the same order used by the NBR e-Return, with a worked example for **AY 2026-27**.",
        ],
        ["h2", "The steps"],
        [
          "ol",
          [
            "**Find your taxable income** for the income year (1 July to 30 June). For salary, one-third of employment income, up to ৳5,00,000, is exempt. Add any other taxable income.",
            "**Apply the slabs** to the part of your income above the tax-free threshold. A general taxpayer's threshold is ৳4,00,000.",
            "**Subtract the investment rebate** if you invested in approved instruments.",
            "**Check the minimum tax.** Above the threshold you pay at least ৳5,000 (৳1,000 for a new taxpayer).",
            "**Add any surcharge** if your net wealth is above ৳4 crore, or you own more than one car or a house above 8,000 sq ft.",
            "**Subtract tax already paid** (TDS and advance tax). What is left is payable, or refundable.",
          ],
        ],
        ["h2", "A worked example"],
        [
          "p",
          "A general taxpayer earns ৳15,00,000 in salary and ৳1,00,000 from other sources. They invested ৳1,20,000 in a DPS and ৳2,00,000 in other eligible instruments, and their employer deducted ৳50,000 of TDS.",
        ],
        [
          "ol",
          [
            "Exempt salary is one-third of ৳15,00,000, which is ৳5,00,000. Taxable income is ৳15,00,000 − ৳5,00,000 + ৳1,00,000 = **৳11,00,000**.",
            "Tax on the ৳7,00,000 above the threshold is ৳30,000 + ৳60,000 = **৳90,000**.",
            "The rebate is the lowest of 3% of ৳11,00,000 (৳33,000), 10% of ৳3,20,000 (৳32,000) and ৳7,50,000, so **৳32,000**.",
            "Tax after the rebate is ৳58,000, which is above the ৳5,000 minimum.",
            "After the ৳50,000 TDS, **৳8,000 is payable**.",
          ],
        ],
        ["slabExample", { ay: "2026-27", income: 1100000 }],
        [
          "callout",
          "info",
          "[Open this exact example in the calculator]({@income}?employmentIncome=1500000&otherIncome=100000&dps=120000&otherInvestment=200000&taxPaid=50000) and change the numbers to match yours.",
        ],
      ],
    },
    salaryTax: {
      title: "Salary income tax explained: exemption and TDS",
      description:
        "How the one-third exemption, monthly TDS and festival bonuses work, and what to check on your payslip.",
      minutes: 4,
      tool: "salary",
      blocks: [
        [
          "p",
          "If you earn a salary, your employer usually handles your income tax for you by deducting **tax at source (TDS)** every month. Understanding how that number is set helps you spot mistakes and plan your pay.",
        ],
        ["h2", "The one-third exemption"],
        [
          "p",
          "All pay from your employer, including basic salary, allowances, bonuses and the value of perks, counts as **employment income**. One-third of it, up to ৳5,00,000 a year, is exempt. Only the rest is taxed.",
        ],
        ["h2", "How monthly TDS is set"],
        [
          "p",
          "Your employer estimates your tax for the whole year and divides it by 12. For a salary of ৳1,00,000 a month: annual pay ৳12,00,000, exempt ৳4,00,000, taxable ৳8,00,000, tax ৳45,000, so **TDS of ৳3,750 a month**.",
        ],
        ["h2", "Festival bonuses"],
        [
          "p",
          "Bonuses are added to your annual employment income. They are not taxed separately, but they raise your annual tax and so your monthly TDS.",
        ],
        ["h2", "What to check on your payslip"],
        [
          "ul",
          [
            "Does the TDS match the annual tax computation HR can show you?",
            "Has HR counted your investments for the rebate? Submit proofs before the cut-off.",
            "Is your taxpayer category right (for example the higher threshold for women, people aged 65+ and persons with disabilities)?",
            "Are bonuses and other benefits included in the estimate?",
          ],
        ],
        ["h2", "Working back from take-home pay"],
        [
          "p",
          "Negotiating an offer? The salary calculator has a **take-home mode**: enter the monthly amount you want to receive and it finds the smallest gross salary that delivers it after TDS.",
        ],
        [
          "callout",
          "info",
          "Try the [salary tax calculator]({@salary}). For a whole team, use the [bulk payroll tool]({@payroll}).",
        ],
      ],
    },
    rebate: {
      title: "Investment tax rebate explained: how much to invest",
      description:
        "The 3% / 10% / ৳7.5 lakh rule, which investments count, and why there is a sweet spot beyond which investing more adds nothing.",
      minutes: 4,
      tool: "rebate",
      blocks: [
        [
          "p",
          "The investment rebate lets you subtract an amount from your tax if you put money into approved instruments during the income year. The Finance Act 2026 made it less generous, so it is worth understanding the rule.",
        ],
        ["h2", "The rule"],
        [
          "p",
          "Your rebate is the **lowest** of: 3% of your taxable income (leaving out exempt income and income taxed at special rates), 10% of your eligible investment, and ৳7,50,000. It can never exceed your tax.",
        ],
        ["h2", "The sweet spot"],
        [
          "p",
          "Because the rebate is capped at 3% of income and pays 10% of the investment, you reach the maximum when you invest about **30% of your taxable income**. With a taxable income of ৳12,00,000 the maximum rebate is ৳36,000, reached at ৳3,60,000 of investment. Investing more adds no rebate.",
        ],
        ["h2", "What counts"],
        [
          "ul",
          [
            "Deposit pension scheme (DPS): up to ৳1,20,000 a year.",
            "Sanchayapatra and government securities: up to ৳5,00,000.",
            "Life insurance premium: up to 10% of the sum assured.",
            "Contributions to a recognised provident fund.",
            "Mutual funds, ETFs and new listed shares (the ৳5 lakh mutual-fund cap was removed).",
            "Zakat fund and approved donations, within the limits in the law.",
          ],
        ],
        ["h2", "Timing and cautions"],
        [
          "ul",
          [
            "The investment must be made within the income year, which ends on **30 June**.",
            "Withdrawing some investments early can trigger additional tax.",
            "A rebate is a tax saving, not a return. Choose investments for their own merits.",
          ],
        ],
        [
          "callout",
          "info",
          "The [rebate planner]({@rebate}) shows exactly how much to invest at your income, and what you would save.",
        ],
      ],
    },
    fileReturn: {
      title: "How to file your income tax return online in Bangladesh",
      description:
        "From e-TIN to acknowledgement: the steps to file on the NBR e-Return portal, who must file and when to file for the best result.",
      minutes: 5,
      tool: "filing",
      blocks: [
        [
          "p",
          "Most individuals must now file their income tax return online through the NBR e-Return portal. Here is the path from nothing to a submitted return.",
        ],
        ["h2", "Before you start"],
        [
          "ul",
          [
            "A **TIN**. If you do not have one, register for an e-TIN on the [NBR e-TIN portal](https://secure.incometax.gov.bd/) using your NID and mobile number.",
            "Your income documents: salary certificate, TDS and bank interest certificates, business records.",
            "Investment and donation receipts for any rebate you want to claim.",
            "Details of your assets, liabilities and annual living expenses.",
          ],
        ],
        ["h2", "The steps"],
        [
          "steps",
          [
            {
              title: "Estimate your tax",
              text: "Use the [income tax calculator]({@income}) so you know what to expect.",
            },
            {
              title: "Log in to e-Return",
              text: "Go to the [e-Return portal](https://etaxnbr.gov.bd/) with your TIN and verify your identity.",
            },
            {
              title: "Choose the assessment year",
              text: "Income earned from 1 July 2025 to 30 June 2026 belongs to AY 2026-27.",
            },
            {
              title: "Fill in the sections",
              text: "Enter income, tax credits, investments, and your statement of assets, liabilities and expenses.",
            },
            {
              title: "Pay any tax due",
              text: "Pay through the [A-Challan portal](https://ibas.finance.gov.bd/acs) and record the challan details before you submit.",
            },
            {
              title: "Submit and keep the proof",
              text: "Download the acknowledgement. Banks, visa offices and tenders often ask for it.",
            },
          ],
        ],
        ["h2", "Who must file"],
        [
          "ul",
          [
            "Anyone whose taxable income is above the tax-free threshold.",
            "Anyone assessed to tax in any of the last three years.",
            "Government employees, company shareholder-directors and partners in a firm.",
            "Executive or managerial employees, and people with exempt or reduced-rate income.",
          ],
        ],
        ["h2", "When to file"],
        [
          "p",
          "Filing is open all year. Filing from 1 July to 30 September earns a **5% rebate** (up to ৳25,000), October to December has no change, and from January additional tax of 2% or 5% applies. Check the effect on your own numbers with the [filing-date calculator]({@filing}).",
        ],
        [
          "callout",
          "warn",
          "People aged 65+, persons with disabilities, Bangladeshis living abroad and a few other groups are not required to e-file, but they may still do so.",
        ],
      ],
    },
    vat: {
      title: "VAT in Bangladesh explained: rates and returns",
      description:
        "How 15% VAT, supplementary duty and turnover tax work, who must register, and how often to file.",
      minutes: 4,
      tool: "vat",
      blocks: [
        [
          "p",
          "VAT (value added tax) is charged on most goods and services under the VAT and Supplementary Duty Act 2012. This guide covers the basics for small businesses.",
        ],
        ["h2", "Rates"],
        [
          "ul",
          [
            "**15%** is the standard rate.",
            "**10%, 7.5% and 5%** apply to specified goods and services.",
            "**0%** applies to exports.",
            "Some goods and services have fixed amounts, truncated-base rates or exemptions set by SROs.",
          ],
        ],
        ["h2", "How the price is built up"],
        [
          "p",
          "Start with the price, add **supplementary duty** if the product has it, then charge **VAT on the price plus SD**. A ৳1,000 item with 20% SD and 15% VAT costs ৳1,000 + ৳200 + ৳180 = **৳1,380**.",
        ],
        ["h2", "Registration and turnover tax"],
        [
          "ul",
          [
            "A BIN (VAT registration number) is needed above ৳50 lakh annual turnover.",
            "Businesses with turnover from ৳30 lakh to ৳50 lakh enlist for **turnover tax** of 4% instead, with no input VAT credit.",
            "Since the Finance Act 2026, a BIN is also asked for when opening a bank account or renewing a trade licence.",
          ],
        ],
        ["h2", "Returns"],
        [
          "p",
          "VAT returns (Mushak 9.1) are now **quarterly** by default, due by the 15th day after the quarter ends. Monthly filing is still allowed and is due by the last day of the next month. Tax invoices use Mushak 6.3.",
        ],
        [
          "callout",
          "info",
          "Price a sale with the [VAT and SD calculator]({@vat}). VAT rules are sector-specific, so check the SRO for your product or ask a VAT professional.",
        ],
      ],
    },
  },
};
