export default {
  title: "Bulk payroll TDS",
  rows: {
    label: "Employees and monthly gross salary",
    hint: "One employee per line: name, then monthly gross salary. Commas, tabs and spreadsheet paste all work. Lines without a salary are skipped.",
    placeholder:
      "Rahim Uddin, 85000\nKarim Hossain, 120000\nSalma Akter, 65000",
  },
  sample: "Load example",
  clear: "Clear",
  csv: "Download CSV",
  example:
    "Rahim Uddin, 85000\nKarim Hossain, 120000\nSalma Akter, 65000\nNusrat Jahan, 250000\nTanvir Ahmed, 45000",
  result: {
    headline: "Total monthly TDS",
    sub: "{count} employees · total gross {gross}",
    count: "Employees",
    gross: "Monthly gross",
    net: "Monthly take-home",
    annual: "Annual tax",
    table: {
      title: "Per employee",
      name: "Employee",
      gross: "Monthly gross",
      annual: "Annual tax",
      tds: "Monthly TDS",
      net: "Take-home",
      total: "Total",
    },
    notes: {
      assumptions:
        "Each person is calculated as a taxpayer in the chosen category with salary income only: no bonuses, investment rebate or other income. Use the salary calculator for individual cases.",
      skipped: "{count} line(s) skipped because no valid salary was found.",
    },
  },
};
