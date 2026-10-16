import site from "./site.mjs";
import home from "./home.mjs";
import ui from "./ui.mjs";
import income from "./page-income.mjs";
import salary from "./page-salary.mjs";
import rebate from "./page-rebate.mjs";
import vat from "./page-vat.mjs";
import corporate from "./page-corporate.mjs";
import filing from "./page-filing.mjs";
import payroll from "./page-payroll.mjs";
import tools from "./page-tools.mjs";
import rates from "./page-rates.mjs";
import company from "./page-company.mjs";
import archive from "./page-archive.mjs";
import guides from "./guides.mjs";
import faq from "./faq.mjs";

export default {
  site,
  home,
  ui,
  guides,
  faq,
  page: {
    income,
    salary,
    rebate,
    vat,
    corporate,
    filing,
    payroll,
    tools,
    rates,
    company,
    archive,
  },
};
