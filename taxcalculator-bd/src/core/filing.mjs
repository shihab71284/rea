import { FILING, ayInfo } from "./rules.mjs";
import { daysBetween, roundTaka } from "./format.mjs";

const nonNeg = (n) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Filing windows for the return of an assessment year (income year ends 30 June). */
export function filingWindows(ay) {
  const { startYear: y } = ayInfo(ay);
  return [
    { id: "rebate", kind: "rebate", from: `${y}-07-01`, to: `${y}-09-30` },
    { id: "neutral", kind: "neutral", from: `${y}-10-01`, to: `${y}-12-31` },
    {
      id: "additional2",
      kind: "additional",
      from: `${y + 1}-01-01`,
      to: `${y + 1}-03-31`,
      ...FILING.additional[0],
    },
    {
      id: "additional5",
      kind: "additional",
      from: `${y + 1}-04-01`,
      to: `${y + 1}-06-30`,
      ...FILING.additional[1],
    },
  ];
}

const cost = (tax, rate, min) => Math.max(roundTaka((tax * rate) / 100), min);

/** Effect of an early/late filing date on a tax liability (net of nothing else). */
export function filingAdjustment({
  ay,
  tax,
  date,
  firstTime = false,
  underNotice = false,
}) {
  const liability = roundTaka(nonNeg(tax));
  const windows = filingWindows(ay);
  const yearEnd = windows[3].to;
  const before = { kind: "notOpen", amount: 0, window: null };

  let outcome;
  if (date < windows[0].from) outcome = before;
  else if (date > yearEnd) outcome = delayed(liability, underNotice);
  else if (firstTime)
    outcome = { kind: "firstTime", amount: 0, window: null, dueDate: yearEnd };
  else outcome = withinYear(windows, liability, date);

  const signed = outcome.kind === "rebate" ? -outcome.amount : outcome.amount;
  const current = outcome.window;
  return {
    ay,
    liability,
    ...outcome,
    payable: liability + signed,
    daysLeftInWindow: current ? daysBetween(date, current.to) : null,
    nextWindow: current
      ? (windows[windows.indexOf(current) + 1] ?? null)
      : null,
    nextCost: nextCost(windows, current, liability),
  };
}

function delayed(liability, underNotice) {
  const rule = underNotice ? FILING.reassessment : FILING.delayed;
  return {
    kind: "delayed",
    amount: cost(liability, rule.rate, rule.min),
    rate: rule.rate,
    min: rule.min,
    underNotice,
    window: null,
  };
}

function withinYear(windows, liability, date) {
  const window = windows.find((w) => date >= w.from && date <= w.to);
  if (window.kind === "rebate") {
    const raw = roundTaka((liability * FILING.rebateRate) / 100);
    return {
      kind: "rebate",
      amount: Math.min(raw, FILING.rebateCap),
      rate: FILING.rebateRate,
      cap: FILING.rebateCap,
      window,
    };
  }
  if (window.kind === "additional") {
    return {
      kind: "additional",
      amount: cost(liability, window.rate, window.min),
      rate: window.rate,
      min: window.min,
      window,
    };
  }
  return { kind: "neutral", amount: 0, window };
}

/** What the next window (after the current one) would cost, for "file before..." hints. */
function nextCost(windows, current, liability) {
  const next = current ? windows[windows.indexOf(current) + 1] : null;
  if (!next || next.kind !== "additional") return null;
  return cost(liability, next.rate, next.min);
}
