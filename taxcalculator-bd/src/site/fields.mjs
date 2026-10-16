import { attrs, html } from "./html.mjs";

const hintId = (name) => `f-${name}-hint`;

function describedBy(name, hint) {
  return attrs({ "aria-describedby": hint ? hintId(name) : null });
}

const optionalTag = (ctx, optional) =>
  optional
    ? html`<span class="optional">${ctx.t("ui.common.optional")}</span>`
    : "";

export function amountField(
  ctx,
  {
    name,
    label,
    hint,
    optional = false,
    prefix = "\u09F3",
    suffix = "",
    showWords = true,
    attributes = {},
  },
) {
  const id = `f-${name}`;
  return html`<div class="field" data-field="${name}" ${attrs(attributes)}>
    <label for="${id}">${label}${optionalTag(ctx, optional)}</label>
    <div class="input-group">
      ${prefix ? html`<span class="input-prefix" aria-hidden="true">${prefix}</span>` : ""}
      <input
        id="${id}"
        name="${name}"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        data-type="amount"
        placeholder="${ctx.t("ui.common.placeholder")}"
        ${describedBy(name, hint)}
      />
      ${suffix ? html`<span class="input-suffix" aria-hidden="true">${suffix}</span>` : ""}
    </div>
    ${showWords ? html`<p class="words" data-words-for="${name}" aria-hidden="true"></p>` : ""}
    ${hint ? html`<p class="hint" id="${hintId(name)}">${hint}</p>` : ""}
  </div>`;
}

export function selectField(
  ctx,
  { name, label, options, hint, value, attributes = {} },
) {
  const id = `f-${name}`;
  return html`<div class="field" data-field="${name}" ${attrs(attributes)}>
    <label for="${id}">${label}</label>
    <select
      class="control"
      id="${id}"
      name="${name}"
      ${describedBy(name, hint)}
    >
      ${options.map(
        (option) =>
          html`<option
            value="${option.value}"
            ${attrs({ selected: option.value === value })}
          >
            ${option.label}
          </option>`,
      )}
    </select>
    ${hint ? html`<p class="hint" id="${hintId(name)}">${hint}</p>` : ""}
  </div>`;
}

export function choiceField(
  ctx,
  { name, legend, options, value, hint, attributes = {} },
) {
  return html`<fieldset class="field" data-field="${name}" ${attrs(attributes)}>
    <legend>${legend}</legend>
    <div class="choice-grid">
      ${options.map(
        (option) =>
          html`<label class="choice">
            <input
              type="radio"
              name="${name}"
              value="${option.value}"
              ${attrs({ checked: option.value === value })}
            />
            <span>${option.label}</span>
          </label>`,
      )}
    </div>
    ${hint ? html`<p class="hint">${hint}</p>` : ""}
  </fieldset>`;
}

export function segmentedField(
  ctx,
  { name, legend, options, value, attributes = {} },
) {
  return html`<fieldset class="field" data-field="${name}" ${attrs(attributes)}>
    ${legend ? html`<legend>${legend}</legend>` : ""}
    <div class="segmented">
      ${options.map(
        (option) =>
          html`<label>
            <input
              type="radio"
              name="${name}"
              value="${option.value}"
              ${attrs({ checked: option.value === value })}
            />
            <span>${option.label}</span>
          </label>`,
      )}
    </div>
  </fieldset>`;
}

export function switchField(
  ctx,
  { name, label, hint, checked = false, attributes = {} },
) {
  return html`<div class="field" data-field="${name}" ${attrs(attributes)}>
    <label class="switch">
      <input type="checkbox" name="${name}" ${attrs({ checked })} />
      <span class="switch-ui" aria-hidden="true"></span>
      <span class="switch-text"
        >${label}${hint ? html`<small>${hint}</small>` : ""}</span
      >
    </label>
  </div>`;
}

export function stepperField(
  ctx,
  { name, label, hint, min = 0, max = 10, value = 0 },
) {
  const id = `f-${name}`;
  return html`<div class="field" data-field="${name}">
    <label for="${id}">${label}</label>
    <div class="stepper">
      <button type="button" data-step="-1" data-target="${name}" aria-label="−">
        −
      </button>
      <input
        id="${id}"
        name="${name}"
        type="number"
        min="${min}"
        max="${max}"
        step="1"
        value="${value}"
        inputmode="numeric"
        data-type="int"
        ${describedBy(name, hint)}
      />
      <button type="button" data-step="1" data-target="${name}" aria-label="+">
        +
      </button>
    </div>
    ${hint ? html`<p class="hint" id="${hintId(name)}">${hint}</p>` : ""}
  </div>`;
}

export function dateField(ctx, { name, label, hint, value }) {
  const id = `f-${name}`;
  return html`<div class="field" data-field="${name}">
    <label for="${id}">${label}</label>
    <input
      class="control"
      id="${id}"
      name="${name}"
      type="date"
      data-type="date"
      ${attrs({ value })}
      ${describedBy(name, hint)}
    />
    ${hint ? html`<p class="hint" id="${hintId(name)}">${hint}</p>` : ""}
  </div>`;
}

export function group(ctx, { title, body, open = false }) {
  return html`<details class="group" ${attrs({ open })}>
    <summary>${title}${ctx.icon("chevronDown")}</summary>
    <div class="group-body">${body}</div>
  </details>`;
}

export function section(title, body) {
  return html`<div class="form-section">
    <h3>${title}</h3>
    ${body}
  </div>`;
}

/** Assessment-year select. `ays` is a list such as ["2027-28", "2026-27"]. */
export function ayField(ctx, { ays, value, name = "ay", help = true }) {
  const options = ays.map((ay) => {
    const startYear = Number(ay.slice(0, 4));
    const incomeYear = `${startYear - 1}-${String(startYear).slice(2)}`;
    return {
      value: ay,
      label: ctx.t("ui.common.ayOption", {
        ay: ctx.fmt.digits(ay),
        iy: ctx.fmt.digits(incomeYear),
      }),
    };
  });
  return selectField(ctx, {
    name,
    label: ctx.t("ui.common.ay"),
    options,
    value,
    hint: help ? ctx.t("ui.common.ayHelp") : undefined,
  });
}

export function categoryField(
  ctx,
  { name = "category", value = "general" } = {},
) {
  const keys = [
    "general",
    "womanSenior",
    "disabled",
    "thirdGender",
    "freedomFighter",
  ];
  return choiceField(ctx, {
    name,
    legend: ctx.t("ui.common.category"),
    value,
    options: keys.map((key) => ({
      value: key,
      label: ctx.t(`ui.common.categories.${key}`),
    })),
  });
}

export function areaField(
  ctx,
  { name = "area", value = "dhakaCtg", showWhen = "ay=2025-26" } = {},
) {
  const keys = ["dhakaCtg", "otherCity", "outside"];
  return selectField(ctx, {
    name,
    label: ctx.t("ui.common.area"),
    value,
    options: keys.map((key) => ({
      value: key,
      label: ctx.t(`ui.common.areas.${key}`),
    })),
    attributes: { "data-show-when": showWhen, hidden: true },
  });
}
