export default {
  lead: "Quick answers to the questions we hear most about Bangladesh tax and about this website.",
  groups: [
    {
      title: "Tax basics",
      items: [
        {
          id: "tax-free",
          q: "What is the tax-free income limit for AY 2026-27?",
          a: "For a general taxpayer it is ৳4,00,000. It is ৳4,50,000 for women and people aged 65+, ৳5,25,000 for persons with disabilities and third-gender taxpayers, and ৳5,50,000 for gazetted war-wounded freedom fighters and July warriors. A parent or guardian of a person with a disability gets ৳50,000 more for each such person.",
        },
        {
          id: "years",
          q: "What is the difference between the income year and the assessment year?",
          a: "The income year is when you earn, from 1 July to 30 June. The assessment year is the one after, when you file and are assessed. Income from 1 July 2025 to 30 June 2026 is assessed in AY 2026-27.",
        },
        {
          id: "who-files",
          q: "Who must file an income tax return?",
          a: [
            "You must file if your taxable income is above the tax-free threshold, or you were assessed in any of the last three years, or you are a government employee, a company shareholder-director, a partner in a firm, or an executive or managerial employee, or you have exempt or reduced-rate income.",
            "You may need to file even when no tax is payable.",
          ],
        },
        {
          id: "minimum",
          q: "What is the minimum tax?",
          a: "Once your income is above the tax-free threshold you pay at least ৳5,000 (৳1,000 for a new taxpayer), even if rebates would bring your tax lower. From AY 2026-27 it is the same everywhere in Bangladesh.",
        },
        {
          id: "salary",
          q: "How is monthly salary TDS worked out?",
          a: "Your employer estimates your tax for the year (one-third of employment income, up to ৳5,00,000, is exempt) and divides it by 12. Use the [salary tax calculator]({@salary}) to see your figure.",
        },
      ],
    },
    {
      title: "Rebate and filing",
      items: [
        {
          id: "rebate",
          q: "How does the investment rebate work now?",
          a: "It is the lowest of 3% of your taxable income, 10% of your eligible investment and ৳7,50,000. The Finance Act 2026 cut it from 15% and ৳10 lakh. Plan it with the [rebate planner]({@rebate}).",
        },
        {
          id: "early",
          q: "What is the early-filing rebate?",
          a: "Individuals who file between 1 July and 30 September get a rebate of 5% of their tax, up to ৳25,000. Filing from 1 January adds 2% (at least ৳3,000), and from 1 April it adds 5% (at least ৳5,000). See the [filing-date calculator]({@filing}).",
        },
        {
          id: "etin",
          q: "How do I get an e-TIN?",
          a: "Register on the [NBR e-TIN portal](https://secure.incometax.gov.bd/) with your NID and mobile number. Our [filing guide]({@guide:fileReturn}) lists every step.",
        },
        {
          id: "where",
          q: "Where do I file my return?",
          a: "On the [NBR e-Return portal](https://etaxnbr.gov.bd/). Most individuals must file online.",
        },
      ],
    },
    {
      title: "VAT",
      items: [
        {
          id: "vat-rate",
          q: "What is the standard VAT rate?",
          a: "15%. Reduced rates of 10%, 7.5% and 5% apply to specified goods and services, and exports are zero-rated. Try the [VAT calculator]({@vat}).",
        },
        {
          id: "vat-returns",
          q: "How often do I file VAT returns?",
          a: "Quarterly by default since 1 July 2026, due by the 15th day after the quarter ends. Monthly filing is still allowed.",
        },
      ],
    },
    {
      title: "About this website",
      items: [
        {
          id: "privacy",
          q: "Are my numbers stored or sent anywhere?",
          a: "No. Calculations run in your browser. Saved results and settings stay in your browser's local storage. See the [privacy policy]({@privacy}).",
        },
        {
          id: "accuracy",
          q: "How accurate are these calculators?",
          a: "They follow the Finance Act 2026 and are tested against worked examples, but they are estimates. Confirm the figures in the NBR e-Return before you file. The [rates page]({@rates}) shows when the rules were last verified.",
        },
        {
          id: "official",
          q: "Is TaxCalculator.bd run by the NBR?",
          a: "No. It is an independent project and is not affiliated with the National Board of Revenue.",
        },
        {
          id: "mistake",
          q: "I think I found a mistake. What should I do?",
          a: "Please tell us through the [contact page]({@contact}), with the assessment year and the figures you entered.",
        },
      ],
    },
  ],
};
