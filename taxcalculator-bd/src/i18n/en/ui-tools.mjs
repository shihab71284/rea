export default {
  cal: {
    title: "Tax calendar",
    filters: {
      label: "Show dates for",
      all: "Everyone",
      individual: "Individuals",
      employer: "Employers",
      vat: "VAT businesses",
      business: "Companies and advance tax",
    },
    soon: { today: "Today", oneDay: "1 day left", days: "{n} days left" },
    status: {
      today: "Today",
      tomorrow: "Tomorrow",
      days: "{n} days left",
      passed: "Passed",
    },
    kind: { filing: "Filing", payment: "Payment", investment: "Investment" },
    audience: {
      individual: "Individuals",
      employer: "Employers",
      vat: "VAT",
      business: "Companies",
    },
    addOne: "Add to calendar",
    addAll: "Download all dates (.ics)",
    icsName: "Bangladesh tax calendar 2026-27",
    empty: "No dates match this filter.",
    events: {
      rebateEnd: {
        title: "Last day for the 5% early-filing rebate",
        desc: "File your individual return by today to earn a 5% rebate on your tax, up to ৳25,000.",
      },
      noPenaltyEnd: {
        title: "Last day to file without additional tax",
        desc: "From 1 January, filing your individual return adds at least 2% (minimum ৳3,000).",
      },
      additional2End: {
        title: "Additional tax rises to 5% from tomorrow",
        desc: "Returns filed from 1 April to 30 June carry additional tax of 5% (minimum ৳5,000).",
      },
      yearEnd: {
        title: "Last day to file before it is a delayed return",
        desc: "After today a late individual return is a delayed return: additional tax of 10% or ৳5,000, whichever is higher. A first-time filer's return is also due today.",
      },
      investDeadline: {
        title: "Last day for rebate-eligible investments",
        desc: "Investments must be made by 30 June to count for the income year that ends today (AY 2027-28).",
      },
      advanceTax: {
        title: "Advance tax instalment due ({period})",
        desc: "Pay the advance income tax instalment if it applies to you (estimated tax liability above ৳10 lakh).",
      },
      vatReturn: {
        title: "VAT return due ({period})",
        desc: "The quarterly VAT return (Mushak 9.1) is due by the 15th day after the quarter ends. Monthly filers: by the last day of the next month.",
      },
      whtReturn: {
        title: "Withholding tax return due ({period})",
        desc: "Deductors file the quarterly withholding tax return by the 25th of the month after the quarter.",
      },
      vatLegacy: {
        title: "Legacy VAT interest-waiver window closes",
        desc: "Old VAT demands (up to 30 June 2022) can be settled with capped interest only if paid by today.",
      },
    },
  },
  dash: {
    title: "My tax dashboard",
    kpi: {
      income: "Latest income tax",
      salary: "Latest monthly TDS",
      checklist: "Checklist progress",
      next: "Next deadline",
      none: "Not saved yet",
      done: "{done} of {total} done",
      days: "in {n} days",
      today: "today",
    },
    saved: {
      title: "Saved calculations",
      empty:
        "Nothing saved yet. Run a calculator and press \u201cSave to dashboard\u201d.",
      open: "Open",
      delete: "Delete",
      clear: "Clear all",
      confirmClear: "Delete all saved calculations from this browser?",
      savedOn: "Saved {date}",
      tools: {
        income: "Income tax",
        salary: "Salary tax",
        rebate: "Rebate planner",
        vat: "VAT",
        corporate: "Corporate tax",
        filing: "Filing date",
        payroll: "Payroll TDS",
        invoice: "Invoice",
      },
      line: {
        income: "Tax {amount} · balance {secondary}",
        salary: "Monthly TDS {amount} · annual tax {secondary}",
        rebate: "Rebate {amount} · invest {secondary} for the maximum",
        vat: "Amount {amount} · VAT {secondary}",
        corporate: "Tax {amount} · balance {secondary}",
        filing: "Adjustment {amount} · you pay {secondary}",
        payroll: "Monthly TDS {amount} · annual tax {secondary}",
        invoice: "Total {amount} · VAT {secondary}",
      },
    },
    checklist: {
      title: "Your filing checklist",
      progress: "{done} of {total} done",
      reset: "Reset checklist",
      items: [
        {
          id: "etin",
          title: "Get your e-TIN",
          text: "Register on the NBR e-TIN portal if you do not have one yet.",
        },
        {
          id: "docs",
          title: "Collect your income documents",
          text: "Salary certificate, bank interest and TDS certificates, business records.",
        },
        {
          id: "invest",
          title: "Collect investment proofs",
          text: "DPS, sanchayapatra, insurance premium and donation receipts.",
        },
        {
          id: "assets",
          title: "Prepare assets and liabilities",
          text: "List land, flats, vehicles, bank balances, loans and living expenses.",
        },
        {
          id: "estimate",
          title: "Estimate your tax",
          text: "Use the calculators so there are no surprises.",
        },
        {
          id: "file",
          title: "File on the e-Return portal",
          text: "Online filing is mandatory for most individuals.",
        },
        {
          id: "pay",
          title: "Pay any tax due with A-Challan",
          text: "Pay before you submit the return.",
        },
        {
          id: "save",
          title: "Keep your acknowledgement",
          text: "The proof of submission is needed by banks and for visas.",
        },
      ],
    },
    deadlines: { title: "Coming up" },
  },
};
