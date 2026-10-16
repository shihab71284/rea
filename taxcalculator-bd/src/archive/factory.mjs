/**
 * Constructors for archive documents. Every document points at an official
 * source (we never host the files) and carries its title in both languages, so
 * the English and Bangla pages always list exactly the same documents.
 *
 * Document shape:
 *   id, type ("circular" | "directive" | "sro" | "law"),
 *   incomeYear (an archive year, BEFORE or ALL), title { en, bn },
 *   ref? (the official reference: SRO number, Act number ...), date? (ISO),
 *   taxYear? (the label NBR uses for annual circulars and directives),
 *   note? { en, bn }, links [{ source, url, kind, label? }]
 */

import { toBnDigits } from "../core/format.mjs";
import {
  ALL,
  bucketOf,
  incomeYearOfDate,
  incomeYearOfTaxYear,
  yearLabel,
} from "./years.mjs";

const NBR_UPLOADS = "https://nbr.gov.bd/uploads";
const SURVEY_FILES = "https://taxsurvey.gov.bd/files/publications";
const BDLAWS = "http://bdlaws.minlaw.gov.bd";

/** A bilingual string. */
export const text = (en, bn) => ({ en, bn });

const compact = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );

const link = (source, url, kind, label) =>
  compact({ source, url, kind, label });

/** A PDF on nbr.gov.bd: `folder` under /uploads/, `file` exactly as NBR serves it. */
export const nbrPdf = (folder, file, label) =>
  link("nbr", `${NBR_UPLOADS}/${folder}/${file}`, "pdf", label);

/** A PDF on taxsurvey.gov.bd, the NBR's Central Taxes Survey Zone. */
export const surveyPdf = (file, label) =>
  link("survey", `${SURVEY_FILES}/${file}`, "pdf", label);

/** A page on the government's Laws of Bangladesh site. */
export const bdlawsPage = (path, label) =>
  link("bdlaws", `${BDLAWS}/${path}`, "web", label);

/** NBR's annual income tax circular, named after the tax year it covers. */
export function circular({ id, taxYear, title, links, note }) {
  return compact({
    id: `circular-${id ?? taxYear}`,
    type: "circular",
    incomeYear: bucketOf(incomeYearOfTaxYear(taxYear)),
    taxYear,
    title:
      title ??
      text(
        `Income Tax Circular (Paripatra) ${taxYear}`,
        `আয়কর পরিপত্র ${toBnDigits(taxYear)}`,
      ),
    links,
    note,
  });
}

/** NBR's annual income tax directive (nirdeshika), named after the tax year. */
export function directive({ taxYear, title, date, links }) {
  return compact({
    id: `directive-${taxYear}`,
    type: "directive",
    incomeYear: bucketOf(incomeYearOfTaxYear(taxYear)),
    taxYear,
    title:
      title ??
      text(
        `Income Tax Directive (Nirdeshika) ${taxYear}`,
        `আয়কর নির্দেশিকা ${toBnDigits(taxYear)}`,
      ),
    date,
    links,
  });
}

/**
 * An income tax SRO (notification) from NBR's own list. `no`/`year` come from
 * the SRO number, `date` is the date NBR's list shows; the income year follows
 * from that date. `series` is "income" unless the number says otherwise.
 */
export function sro({ no, year, date, title, file, series = "income", note }) {
  return compact({
    id: `sro-${date}-${no}`,
    type: "sro",
    incomeYear: bucketOf(incomeYearOfDate(date)),
    ref: { kind: "sro", no, year, series },
    date,
    title,
    links: [nbrPdf("sros", file)],
    note,
  });
}

/** A Finance Act, filed under the income year whose tax year it set rates for. */
export function financeAct({ year, links, number, date }) {
  return compact({
    id: `law-finance-act-${year}`,
    type: "law",
    incomeYear: bucketOf(yearLabel(year - 1)),
    actYear: year,
    title: text(`The Finance Act, ${year}`, `অর্থ আইন, ${toBnDigits(year)}`),
    ref: number ? { kind: "act", no: number, year } : undefined,
    date,
    links,
  });
}

/** A law that is not tied to one year (the Ordinance, the Rules). */
export function standingLaw({ id, title, ref, date, links, note }) {
  return compact({
    id: `law-${id}`,
    type: "law",
    incomeYear: ALL,
    title,
    ref,
    date,
    links,
    note,
  });
}
