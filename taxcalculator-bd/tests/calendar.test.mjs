import { test } from "node:test";
import assert from "node:assert/strict";
import { TAX_EVENTS, nextEvents, timeline } from "../src/core/calendar.mjs";
import { buildIcs, foldLine } from "../src/core/ics.mjs";

test("timeline is sorted and marks past/soon/upcoming relative to today", () => {
  const items = timeline("2026-10-16");
  const dates = items.map((e) => e.date);
  assert.deepEqual(dates, [...dates].sort());
  const byId = Object.fromEntries(items.map((e) => [e.id, e]));
  assert.equal(byId["ind-rebate-end"].status, "past");
  assert.equal(byId["vat-2026-q3"].status, "past");
  assert.equal(byId["wht-2026-q3"].status, "soon");
  assert.equal(byId["ind-neutral-end"].daysLeft, 76);
  assert.equal(byId["ind-neutral-end"].status, "upcoming");
});

test("event ids are unique and dates are valid", () => {
  const ids = new Set(TAX_EVENTS.map((e) => e.id));
  assert.equal(ids.size, TAX_EVENTS.length);
  for (const event of TAX_EVENTS) {
    assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(event.date)), event.id);
  }
});

test("nextEvents skips past dates", () => {
  const next = nextEvents("2026-10-16", 3);
  assert.equal(next.length, 3);
  assert.ok(next.every((e) => e.daysLeft >= 0));
  assert.equal(next[0].id, "wht-2026-q3");
});

test("ICS output is a well-formed calendar", () => {
  const ics = buildIcs(
    [
      {
        uid: "a@x",
        date: "2026-12-31",
        summary: "File return, now; today",
        description: "Line one\nLine two",
      },
      { uid: "b@x", date: "2027-01-15", summary: "VAT return" },
    ],
    { now: new Date("2026-10-16T00:00:00Z"), name: "Tax calendar" },
  );
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, 2);
  assert.match(ics, /DTSTART;VALUE=DATE:20261231\r\n/);
  assert.match(
    ics,
    /DTEND;VALUE=DATE:20270101\r\n/,
    "all-day events end on the next day",
  );
  assert.match(ics, /DTSTAMP:20261016T000000Z\r\n/);
  assert.match(ics, /SUMMARY:File return\\, now\\; today\r\n/);
  assert.match(ics, /DESCRIPTION:Line one\\nLine two\r\n/);
  for (const line of ics.split("\r\n")) {
    assert.ok(
      new TextEncoder().encode(line).length <= 75,
      `line too long: ${line}`,
    );
  }
});

test("long lines fold at 75 octets without breaking multi-byte characters", () => {
  const text = `SUMMARY:${"আয়কর রিটার্ন ".repeat(12)}`;
  const folded = foldLine(text);
  const lines = folded.split("\r\n");
  assert.ok(lines.length > 1);
  assert.ok(lines.slice(1).every((l) => l.startsWith(" ")));
  const unfolded = lines.map((l, i) => (i === 0 ? l : l.slice(1))).join("");
  assert.equal(unfolded, text);
  for (const line of lines)
    assert.ok(new TextEncoder().encode(line).length <= 75);
});
