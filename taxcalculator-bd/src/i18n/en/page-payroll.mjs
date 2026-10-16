export default {
  lead: "Paste your payroll and get every employee's **annual tax and monthly TDS** in one go, with totals and a CSV export. Everything is calculated in your browser, so employee data never leaves your computer.",
  empty:
    "Paste one employee per line, or load the example, to see monthly TDS for the whole team.",
  explain: [
    ["h2", "How to use the bulk calculator"],
    [
      "ol",
      [
        "Paste or type one employee per line: name, then monthly gross salary, for example `Rahim Uddin, 85000`.",
        "Choose the assessment year and the taxpayer category that applies to your team.",
        "Read the total monthly TDS, check each person's figures, then download the CSV.",
      ],
    ],
    [
      "callout",
      "warn",
      "Each person is calculated as a taxpayer with salary income only: no bonuses, investment rebate or other income. Payroll TDS must follow each employee's declared position, so use the [salary calculator]({@salary}) for individual cases.",
    ],
    ["h2", "Depositing and reporting TDS"],
    [
      "p",
      "Tax deducted from salary must be deposited with the government and reported in your withholding-tax return, which is now filed **quarterly**, by the 25th of the month after the quarter. See the [tax calendar]({@calendar}) for the dates.",
    ],
  ],
  faq: [
    {
      q: "Is employee data uploaded anywhere?",
      a: "No. The calculation runs in your browser and nothing is sent to a server.",
    },
    {
      q: "Can I include bonuses and investments?",
      a: "Not in the bulk tool yet. Use the salary calculator for an individual with bonuses, investments or other income.",
    },
    {
      q: "What can I paste?",
      a: "Plain text with one employee per line. Rows copied from Excel or Google Sheets work too, because tabs are accepted as separators.",
    },
  ],
};
