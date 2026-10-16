/**
 * The searchable document library. The full, grouped list is plain HTML, so it
 * works without JavaScript; the controls only appear once the script runs
 * (see src/client/pages/archive.js) and then hide the rows that do not match.
 */

import { BUCKETS, TYPES } from "../archive/catalog.mjs";
import { isArchiveYear, taxYearOf } from "../archive/years.mjs";
import { bucketLabel, docGroups } from "./archive-ui.mjs";
import { html } from "./html.mjs";

function typeChips(ctx) {
  const { t } = ctx;
  const chip = (value, label, pressed) =>
    html`<button
      class="chip"
      type="button"
      aria-pressed="${pressed}"
      data-library-type="${value}"
    >
      ${label}
    </button>`;
  return html`<div class="field library-types">
    <span class="field-label" id="library-type-label"
      >${t("page.archive.library.type")}</span
    >
    <div class="chips" role="group" aria-labelledby="library-type-label">
      ${chip("", t("page.archive.library.all"), "true")}
      ${TYPES.map((type) =>
        chip(type, t(`page.archive.types.${type}.name`), "false"),
      )}
    </div>
  </div>`;
}

function yearOptionLabel(ctx, bucket) {
  if (!isArchiveYear(bucket)) return bucketLabel(ctx, bucket);
  return ctx.t("page.archive.library.yearOption", {
    year: ctx.fmt.digits(bucket),
    taxYear: ctx.fmt.digits(taxYearOf(bucket)),
  });
}

function yearSelect(ctx, buckets) {
  const { t } = ctx;
  return html`<div class="field library-year">
    <label for="library-year">${t("page.archive.library.year")}</label>
    <select class="control" id="library-year" data-library-year>
      <option value="">${t("page.archive.library.allYears")}</option>
      ${buckets.map(
        (bucket) =>
          html`<option value="${bucket}">
            ${yearOptionLabel(ctx, bucket)}
          </option>`,
      )}
    </select>
  </div>`;
}

/** The library for `docs`; `withTypes` adds the document-type filter (used when types are mixed). */
export function library(ctx, docs, { withTypes = false, level = 3 } = {}) {
  const { t, icon } = ctx;
  const buckets = BUCKETS.filter((bucket) =>
    docs.some((doc) => doc.incomeYear === bucket),
  );
  return html`<div class="library" data-library data-total="${docs.length}">
    <div
      class="library-controls"
      role="search"
      aria-label="${t("page.archive.hub.libraryTitle")}"
    >
      <div class="field library-q">
        <label for="library-q">${t("page.archive.library.search")}</label>
        <div class="input-group">
          <span class="input-prefix" aria-hidden="true">${icon("search")}</span>
          <input
            id="library-q"
            type="search"
            autocomplete="off"
            placeholder="${t("page.archive.library.placeholder")}"
            data-library-q
          />
        </div>
      </div>
      ${yearSelect(ctx, buckets)} ${withTypes ? typeChips(ctx) : ""}
      <button
        class="btn btn-ghost btn-sm"
        type="button"
        data-library-clear
        hidden
      >
        ${t("page.archive.library.clear")}
      </button>
    </div>
    <p
      class="library-count"
      role="status"
      aria-live="polite"
      data-library-count
      data-template="${t("page.archive.library.count")}"
    ></p>
    <div class="library-groups">
      ${docGroups(ctx, docs, { level, mixed: withTypes })}
    </div>
    <p class="library-empty" data-library-empty hidden>
      ${t("page.archive.library.empty")}
    </p>
  </div>`;
}
