import { daysBetween } from "./format.mjs";

/**
 * Key dates for the 2026-27 tax year. `key` selects the wording in the
 * dictionaries (ui.cal.events.<key>), `period` is an optional yyyy-mm range
 * for quarterly items. Dates are the statutory/last-day dates, not holidays.
 */
export const TAX_EVENTS = [
  {
    id: "ind-rebate-end",
    date: "2026-09-30",
    audience: "individual",
    kind: "filing",
    key: "rebateEnd",
  },
  {
    id: "ind-neutral-end",
    date: "2026-12-31",
    audience: "individual",
    kind: "filing",
    key: "noPenaltyEnd",
  },
  {
    id: "ind-add2-end",
    date: "2027-03-31",
    audience: "individual",
    kind: "filing",
    key: "additional2End",
  },
  {
    id: "ind-year-end",
    date: "2027-06-30",
    audience: "individual",
    kind: "filing",
    key: "yearEnd",
  },
  {
    id: "ind-invest",
    date: "2027-06-30",
    audience: "individual",
    kind: "investment",
    key: "investDeadline",
  },
  {
    id: "adv-2026-09",
    date: "2026-09-15",
    audience: "business",
    kind: "payment",
    key: "advanceTax",
    period: ["2026-07", "2026-09"],
  },
  {
    id: "adv-2026-12",
    date: "2026-12-15",
    audience: "business",
    kind: "payment",
    key: "advanceTax",
    period: ["2026-10", "2026-12"],
  },
  {
    id: "adv-2027-03",
    date: "2027-03-15",
    audience: "business",
    kind: "payment",
    key: "advanceTax",
    period: ["2027-01", "2027-03"],
  },
  {
    id: "adv-2027-06",
    date: "2027-06-15",
    audience: "business",
    kind: "payment",
    key: "advanceTax",
    period: ["2027-04", "2027-06"],
  },
  {
    id: "vat-2026-q3",
    date: "2026-10-15",
    audience: "vat",
    kind: "filing",
    key: "vatReturn",
    period: ["2026-07", "2026-09"],
  },
  {
    id: "vat-2027-q4",
    date: "2027-01-15",
    audience: "vat",
    kind: "filing",
    key: "vatReturn",
    period: ["2026-10", "2026-12"],
  },
  {
    id: "vat-2027-q1",
    date: "2027-04-15",
    audience: "vat",
    kind: "filing",
    key: "vatReturn",
    period: ["2027-01", "2027-03"],
  },
  {
    id: "vat-2027-q2",
    date: "2027-07-15",
    audience: "vat",
    kind: "filing",
    key: "vatReturn",
    period: ["2027-04", "2027-06"],
  },
  {
    id: "vat-legacy",
    date: "2026-12-31",
    audience: "vat",
    kind: "payment",
    key: "vatLegacy",
  },
  {
    id: "wht-2026-q3",
    date: "2026-10-25",
    audience: "employer",
    kind: "filing",
    key: "whtReturn",
    period: ["2026-07", "2026-09"],
  },
  {
    id: "wht-2027-q4",
    date: "2027-01-25",
    audience: "employer",
    kind: "filing",
    key: "whtReturn",
    period: ["2026-10", "2026-12"],
  },
  {
    id: "wht-2027-q1",
    date: "2027-04-25",
    audience: "employer",
    kind: "filing",
    key: "whtReturn",
    period: ["2027-01", "2027-03"],
  },
  {
    id: "wht-2027-q2",
    date: "2027-07-25",
    audience: "employer",
    kind: "filing",
    key: "whtReturn",
    period: ["2027-04", "2027-06"],
  },
];

export const AUDIENCES = ["individual", "employer", "vat", "business"];

/** Events with `daysLeft` (negative = passed) and `status`, sorted by date. */
export function timeline(today, events = TAX_EVENTS) {
  return events
    .map((event) => {
      const daysLeft = daysBetween(today, event.date);
      let status = "upcoming";
      if (daysLeft < 0) status = "past";
      else if (daysLeft <= 30) status = "soon";
      return { ...event, daysLeft, status };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

/** The next `count` events that have not passed yet. */
export function nextEvents(today, count = 3, events = TAX_EVENTS) {
  return timeline(today, events)
    .filter((event) => event.daysLeft >= 0)
    .slice(0, count);
}
