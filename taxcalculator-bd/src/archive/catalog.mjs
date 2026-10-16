/**
 * The archive catalog: every document, sorted, with the lookups the pages use.
 * The data lives in circulars.mjs, laws.mjs and the sros-*.mjs files; the
 * constructors in factory.mjs decide each document's income year, so a
 * document can never be filed outside the archive's scope.
 */

import { CIRCULARS, DIRECTIVES } from "./circulars.mjs";
import { LAWS } from "./laws.mjs";
import { SROS_2011_2016 } from "./sros-2011-2016.mjs";
import { SROS_2016_2019 } from "./sros-2016-2019.mjs";
import { SROS_2020_2022 } from "./sros-2020-2022.mjs";
import { ALL, ARCHIVE_YEARS, BEFORE, isArchiveYear } from "./years.mjs";

/** The four kinds of document, in menu order. */
export const TYPES = ["circular", "directive", "sro", "law"];

/** Display order of the filing buckets: every-year laws, newest year first, then older. */
export const BUCKETS = [ALL, ...ARCHIVE_YEARS, BEFORE];

const rank = new Map(BUCKETS.map((bucket, index) => [bucket, index]));

/** Newest first within a bucket: by date, then SRO number, then Finance Act year, then id. */
function compare(a, b) {
  return (
    rank.get(a.incomeYear) - rank.get(b.incomeYear) ||
    (b.date ?? "").localeCompare(a.date ?? "") ||
    Number(b.ref?.no ?? 0) - Number(a.ref?.no ?? 0) ||
    (b.actYear ?? 0) - (a.actYear ?? 0) ||
    a.id.localeCompare(b.id)
  );
}

export const DOCUMENTS = [
  ...CIRCULARS,
  ...DIRECTIVES,
  ...SROS_2020_2022,
  ...SROS_2016_2019,
  ...SROS_2011_2016,
  ...LAWS,
].sort(compare);

export const documentsOfType = (type) =>
  DOCUMENTS.filter((doc) => doc.type === type);

export const documentsOfYear = (year) =>
  DOCUMENTS.filter((doc) => doc.incomeYear === year);

/** Documents that apply to every year (the Ordinance and its Rules). */
export const standingDocuments = () => documentsOfYear(ALL);

/** How many documents of each type one income year has (every-year laws excluded). */
export function countsOfYear(year) {
  const docs = documentsOfYear(year);
  return Object.fromEntries(
    TYPES.map((type) => [type, docs.filter((doc) => doc.type === type).length]),
  );
}

/** [{ bucket, docs }] in display order, skipping empty buckets. */
export function groupByBucket(docs) {
  return BUCKETS.map((bucket) => ({
    bucket,
    docs: docs.filter((doc) => doc.incomeYear === bucket),
  })).filter((group) => group.docs.length > 0);
}

/** The oldest income year that has a document of this type. */
export function firstYearOf(type) {
  const years = documentsOfType(type)
    .map((doc) => doc.incomeYear)
    .filter(isArchiveYear);
  return ARCHIVE_YEARS.findLast((year) => years.includes(year));
}

/** The first and last Finance Act years in the catalog. */
export function financeActRange() {
  const years = DOCUMENTS.filter((doc) => doc.actYear).map(
    (doc) => doc.actYear,
  );
  return { from: Math.min(...years), to: Math.max(...years) };
}
