import { ARCHIVE_YEARS } from "../archive/years.mjs";

/** Every page of the site, with its path (English URL) and navigation role. */

export const TOOLS = [
  {
    id: "income",
    path: "/income-tax-calculator/",
    icon: "calculator",
    tile: "",
  },
  {
    id: "salary",
    path: "/salary-tax-calculator/",
    icon: "wallet",
    tile: "blue",
  },
  {
    id: "rebate",
    path: "/tax-rebate-calculator/",
    icon: "piggy",
    tile: "amber",
  },
  { id: "vat", path: "/vat-calculator/", icon: "receipt", tile: "rose" },
  {
    id: "corporate",
    path: "/corporate-tax-calculator/",
    icon: "building",
    tile: "blue",
  },
  {
    id: "filing",
    path: "/return-filing-calculator/",
    icon: "calendarCheck",
    tile: "",
  },
  {
    id: "payroll",
    path: "/payroll-tds-calculator/",
    icon: "users",
    tile: "amber",
  },
];

export const RESOURCES = [
  { id: "rates", path: "/tax-rates/", icon: "percent", tile: "blue" },
  {
    id: "calendar",
    path: "/tax-calendar/",
    icon: "calendarClock",
    tile: "amber",
  },
  { id: "dashboard", path: "/dashboard/", icon: "chartPie", tile: "" },
];

export const GUIDES = [
  { id: "financeAct2026", slug: "finance-act-2026-changes", icon: "landmark" },
  {
    id: "calculateIncomeTax",
    slug: "how-to-calculate-income-tax-bangladesh",
    icon: "calculator",
  },
  { id: "salaryTax", slug: "salary-income-tax-explained", icon: "wallet" },
  { id: "rebate", slug: "investment-tax-rebate-explained", icon: "piggy" },
  {
    id: "fileReturn",
    slug: "how-to-file-income-tax-return-online",
    icon: "fileText",
  },
  { id: "vat", slug: "vat-in-bangladesh-explained", icon: "receipt" },
];

/** The four kinds of archive document: menu order, page id, path and icon. */
export const ARCHIVE_SECTIONS = [
  {
    type: "circular",
    id: "archive:circular",
    path: "/archive/circulars/",
    icon: "fileText",
    tile: "",
  },
  {
    type: "directive",
    id: "archive:directive",
    path: "/archive/directives/",
    icon: "book",
    tile: "blue",
  },
  {
    type: "sro",
    id: "archive:sro",
    path: "/archive/notifications/",
    icon: "scrollText",
    tile: "amber",
  },
  {
    type: "law",
    id: "archive:law",
    path: "/archive/laws/",
    icon: "scale",
    tile: "rose",
  },
];

export const archiveYearId = (year) => `archive-year:${year}`;

export const archiveSection = (type) =>
  ARCHIVE_SECTIONS.find((section) => section.type === type);

export const isArchivePage = (id) =>
  id === "archive" ||
  id.startsWith("archive:") ||
  id.startsWith("archive-year:");

/** page id -> English path */
export const PATHS = {
  home: "/",
  hub: "/calculators/",
  guides: "/guides/",
  faq: "/faq/",
  about: "/about/",
  contact: "/contact/",
  privacy: "/privacy/",
  disclaimer: "/disclaimer/",
  archive: "/archive/",
  notFound: "/404.html",
  ...Object.fromEntries(TOOLS.map((tool) => [tool.id, tool.path])),
  ...Object.fromEntries(RESOURCES.map((item) => [item.id, item.path])),
  ...Object.fromEntries(
    GUIDES.map((guide) => [`guide:${guide.id}`, `/guides/${guide.slug}/`]),
  ),
  ...Object.fromEntries(
    ARCHIVE_SECTIONS.map((section) => [section.id, section.path]),
  ),
  ...Object.fromEntries(
    ARCHIVE_YEARS.map((year) => [
      archiveYearId(year),
      `/archive/income-year-${year}/`,
    ]),
  ),
};

export const toolById = (id) =>
  [...TOOLS, ...RESOURCES].find((item) => item.id === id);
