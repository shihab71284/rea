import home from "./home.mjs";
import income from "./income.mjs";
import salary from "./salary.mjs";
import rebate from "./rebate.mjs";
import vat from "./vat.mjs";
import corporate from "./corporate.mjs";
import filing from "./filing.mjs";
import payroll from "./payroll.mjs";
import calendar from "./calendar.mjs";
import dashboard from "./dashboard.mjs";
import rates from "./rates.mjs";
import hub from "./hub.mjs";
import faq from "./faq.mjs";
import contact from "./contact.mjs";
import { about, disclaimer, notFound, privacy } from "./info.mjs";
import { guidePage, guidesIndex } from "./guides.mjs";
import { GUIDES } from "../registry.mjs";

/** Every page that is rendered in each language. */
export const PAGES = [
  { id: "home", render: home },
  { id: "hub", render: hub },
  { id: "income", render: income },
  { id: "salary", render: salary },
  { id: "rebate", render: rebate },
  { id: "vat", render: vat },
  { id: "corporate", render: corporate },
  { id: "filing", render: filing },
  { id: "payroll", render: payroll },
  { id: "rates", render: rates },
  { id: "calendar", render: calendar },
  { id: "dashboard", render: dashboard },
  { id: "guides", render: guidesIndex },
  ...GUIDES.map((guide) => ({
    id: `guide:${guide.id}`,
    render: guidePage(guide),
  })),
  { id: "faq", render: faq },
  { id: "about", render: about },
  { id: "contact", render: contact },
  { id: "privacy", render: privacy },
  { id: "disclaimer", render: disclaimer },
  { id: "notFound", render: notFound },
];
