export default {
  lead: "Individuals can now file all year, with a **5% rebate** for filing early and **additional tax** for filing late. Enter your tax liability and filing date to see exactly what it means for you.",
  empty: "Enter your tax liability to see the effect of your filing date.",
  explain: [
    ["h2", "The year-round filing schedule"],
    [
      "p",
      "For income earned in the year to 30 June, the filing window runs for twelve months from 1 July. What you pay depends on when you file:",
    ],
    [
      "table",
      ["Filing period", "Effect"],
      [
        ["1 July to 30 September", "Rebate of 5% of your tax, up to ৳25,000"],
        ["1 October to 31 December", "No rebate or additional tax"],
        ["1 January to 31 March", "Additional tax of 2% (at least ৳3,000)"],
        ["1 April to 30 June", "Additional tax of 5% (at least ৳5,000)"],
        [
          "After 30 June",
          "Delayed return: 10% of tax or ৳5,000, whichever is higher (15% or ৳10,000 after a reassessment notice)",
        ],
      ],
    ],
    ["h3", "Worked example"],
    [
      "p",
      "Tax liability ৳2,00,000. Filing in August earns a rebate of ৳10,000, so you pay **৳1,90,000**. Filing in February adds ৳4,000, so you pay **৳2,04,000**. Filing in May adds ৳10,000.",
    ],
    [
      "callout",
      "warn",
      "The NBR's power to extend the filing date by a month has been repealed, so plan around these dates instead of waiting for an extension.",
    ],
    [
      "callout",
      "info",
      "Most individuals now file through the NBR e-Return portal. Follow the [step-by-step filing guide]({@guide:fileReturn}).",
    ],
  ],
  faq: [
    {
      q: "What is the deadline to file my return?",
      a: "There is no single deadline any more. You can file all year, but filing after 31 December adds tax, and after 30 June it is a delayed return.",
    },
    {
      q: "Is the rebate worked out before or after TDS?",
      a: "Sources describe the base as your tax liability or tax payable. Enter the figure shown in your e-Return preview to get the closest estimate, and treat the result as a guide.",
    },
    {
      q: "What if I have no tax to pay?",
      a: "A late return can still carry the minimum additional tax of ৳3,000 or ৳5,000 in the schedule. Check the e-Return before you submit.",
    },
  ],
};
