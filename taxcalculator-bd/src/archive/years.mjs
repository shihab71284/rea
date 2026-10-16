/**
 * Income-year helpers for the archive.
 *
 * Bangladesh names a year two ways. The income year is when the money was
 * earned (for most taxpayers 1 July to 30 June); the tax year, also called the
 * assessment year, is the year after, in which that income is assessed and the
 * return is filed. Income year 2021-22 is tax year 2022-23.
 *
 * The archive stops after income year 2021-22, the last one assessed under the
 * Income-tax Ordinance, 1984. The Income Tax Act, 2023 (Act No. 12 of 2023)
 * repealed the Ordinance and applies from income year 2022-23.
 */

/** The archive covers every income year up to and including this one. */
export const LAST_INCOME_YEAR = "2021-22";

/** The oldest income year that has its own page. */
export const FIRST_INCOME_YEAR = "2011-12";

/** Bucket for documents older than the first covered year (e.g. Finance Act 2009). */
export const BEFORE = "before";

/** Bucket for documents that apply to every year (e.g. the Ordinance itself). */
export const ALL = "all";

/** "2021-22" -> 2021 */
export const startYear = (label) => Number(label.slice(0, 4));

/** 2021 -> "2021-22" */
export function yearLabel(start) {
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/** Income year -> its tax (assessment) year: "2021-22" -> "2022-23". */
export const taxYearOf = (incomeYear) => yearLabel(startYear(incomeYear) + 1);

/** Tax (assessment) year -> its income year: "2022-23" -> "2021-22". */
export const incomeYearOfTaxYear = (taxYear) =>
  yearLabel(startYear(taxYear) - 1);

/** The income year (1 July to 30 June) that contains an ISO date. */
export function incomeYearOfDate(iso) {
  const [year, month] = iso.split("-").map(Number);
  return yearLabel(month >= 7 ? year : year - 1);
}

/** First and last day of an income year as ISO dates. */
export function incomeYearDates(incomeYear) {
  const start = startYear(incomeYear);
  return { from: `${start}-07-01`, to: `${start + 1}-06-30` };
}

/** Every covered income year, newest first. */
export const ARCHIVE_YEARS = (() => {
  const years = [];
  for (
    let start = startYear(LAST_INCOME_YEAR);
    start >= startYear(FIRST_INCOME_YEAR);
    start -= 1
  )
    years.push(yearLabel(start));
  return years;
})();

export const isArchiveYear = (label) => ARCHIVE_YEARS.includes(label);

/**
 * Where a document with this income year is filed: the year itself, or BEFORE
 * when it is older than the archive. Newer years are out of scope and throw,
 * so nothing outside the archive can slip into the catalog.
 */
export function bucketOf(incomeYear) {
  const start = startYear(incomeYear);
  if (start > startYear(LAST_INCOME_YEAR))
    throw new Error(`Outside the archive: income year ${incomeYear}`);
  return start < startYear(FIRST_INCOME_YEAR) ? BEFORE : incomeYear;
}
