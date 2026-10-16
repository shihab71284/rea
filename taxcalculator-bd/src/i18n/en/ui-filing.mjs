export default {
  title: "Early-filing rebate and late-filing tax",
  tax: {
    label: "Your income tax liability",
    hint: "Use the tax shown in your e-Return. The rebate and additional tax are worked out on this amount.",
  },
  date: {
    label: "Filing date",
    hint: "The day you plan to submit your return, or the day you submitted it.",
  },
  firstTime: {
    label: "This is my first tax return",
    hint: "First-time individual filers have until 30 June after the income year.",
  },
  underNotice: {
    label: "I am filing after a reassessment notice",
    hint: "The delayed-return charge is higher: 15% or ৳10,000.",
  },
  result: {
    headline: {
      rebate: "Early-filing rebate",
      neutral: "No rebate or additional tax",
      additional: "Additional tax for late filing",
      delayed: "Additional tax for a delayed return",
      notOpen: "Filing has not opened for this year",
      firstTime: "No additional tax for a first-time filer",
    },
    sub: {
      rebate: "You pay {payable} instead of {tax}.",
      neutral: "You pay {payable}.",
      additional: "You pay {payable} instead of {tax}.",
      delayed: "You pay {payable} instead of {tax}.",
      notOpen:
        "The income year ends on 30 June {year}. You can file from 1 July.",
      firstTime: "Your return is due by {date}.",
    },
    kpi: {
      date: "Filing date",
      daysLeft: "Days left in this window",
      cost: "Cost if you wait",
      payable: "You pay",
      none: "\u2014",
    },
    timeline: {
      title: "The year-round filing schedule",
      rebate: "Early-filing rebate: 5%, up to ৳25,000",
      neutral: "No rebate or additional tax",
      additional2: "Additional tax: 2%, at least ৳3,000",
      additional5: "Additional tax: 5%, at least ৳5,000",
      delayed: "Delayed return",
      none: "No change",
      after: "After {date}",
    },
    notes: {
      base: "The rebate and the additional tax are worked out on the tax liability you enter. Enter the figure shown in your e-Return preview for the closest estimate.",
      first:
        "A first-time individual filer's return is due by {date}. Confirm in the e-Return whether the early-filing rebate also applies to you.",
      wait: "File by {date} to avoid at least {cost} of additional tax.",
      zero: "Even with no tax to pay, the minimum additional tax in the schedule may apply to a late return. Check the e-Return before you submit.",
      efile:
        "Most individuals now have to file through the NBR e-Return portal (mandatory since 28 June 2026).",
    },
  },
};
