import { html } from "../html.mjs";
import {
  badge,
  breadcrumbJsonLd,
  pageHead,
  sourcesList,
} from "../components.mjs";
import { renderBlocks } from "../blocks.mjs";
import {
  AY_RULES,
  COMPANY_TYPES,
  FILING,
  REBATE_INCOME_PERCENT,
  SOURCES,
  SURCHARGE_TIERS,
  TURNOVER_TAX,
  MIN_TAX_FLAT,
  MIN_TAX_NEW_TAXPAYER,
} from "../../core/rules.mjs";

const CATEGORIES = ["general", "womanSenior", "disabled", "freedomFighter"];

function thresholdTable(ctx) {
  const { t, fmt } = ctx;
  const sets = ["2025-26", "2026-27", "2028-29", "2030-31"];
  const head = [
    t("page.rates.individual.category"),
    ...sets.map((ay) => t(`page.rates.individual.ayHeads.${ay}`)),
  ];
  const rows = CATEGORIES.map((key) => [
    t(`ui.common.categories.${key}`),
    ...sets.map((ay) => fmt.taka(AY_RULES[ay].thresholds[key])),
  ]);
  return ["table", head, rows, [1, 2, 3, 4]];
}

function slabTable(ctx, ay) {
  const { t, fmt } = ctx;
  const I = "page.rates.individual.";
  const rows = [[t(`${I}firstBand`), fmt.percent(0)]];
  for (const slab of AY_RULES[ay].slabs) {
    const label = Number.isFinite(slab.width)
      ? t(`${I}nextBand`, { amount: fmt.taka(slab.width) })
      : t(`${I}rest`);
    rows.push([label, fmt.percent(slab.rate)]);
  }
  return ["table", [t(`${I}band`), t(`${I}rate`)], rows, [1]];
}

function surchargeTable(ctx) {
  const { t, fmt } = ctx;
  const I = "page.rates.individual.";
  const tiers = [...SURCHARGE_TIERS].sort((a, b) => a.above - b.above);
  const rows = [
    [
      t(`${I}surchargeNil`, { amount: fmt.taka(tiers[0].above) }),
      fmt.percent(0),
    ],
  ];
  for (const tier of tiers)
    rows.push([
      t(`${I}surchargeBand`, { amount: fmt.taka(tier.above) }),
      fmt.percent(tier.rate),
    ]);
  return ["table", t.get(`${I}surchargeHeads`), rows, [1]];
}

function individualBlocks(ctx) {
  const { t, fmt } = ctx;
  const I = "page.rates.individual.";
  const legacy = AY_RULES["2025-26"].minTaxByArea;
  const filingRows = [
    [
      "rebate",
      { rate: fmt.percent(FILING.rebateRate), cap: fmt.taka(FILING.rebateCap) },
    ],
    ["neutral", {}],
    [
      "additional2",
      {
        rate: fmt.percent(FILING.additional[0].rate),
        min: fmt.taka(FILING.additional[0].min),
      },
    ],
    [
      "additional5",
      {
        rate: fmt.percent(FILING.additional[1].rate),
        min: fmt.taka(FILING.additional[1].min),
      },
    ],
    [
      "delayed",
      {
        rate: fmt.percent(FILING.delayed.rate),
        min: fmt.taka(FILING.delayed.min),
      },
    ],
  ].map(([key, params]) => t(`${I}filingRows.${key}`, params));
  return [
    ["h2", t(`${I}title`), "individual"],
    ["h3", t(`${I}thresholdsTitle`)],
    thresholdTable(ctx),
    ["p", t(`${I}thresholdNote`)],
    ["h3", t(`${I}slabsTitle`)],
    ["details", t(`${I}slabSets.current`), [slabTable(ctx, "2026-27")], true],
    ["details", t(`${I}slabSets.previous`), [slabTable(ctx, "2025-26")]],
    ["details", t(`${I}slabSets.future1`), [slabTable(ctx, "2028-29")]],
    ["details", t(`${I}slabSets.future2`), [slabTable(ctx, "2030-31")]],
    ["p", t(`${I}slabNote`)],
    ["h3", t(`${I}minTitle`)],
    ["p", t(`${I}minBody`)],
    [
      "table",
      t.get(`${I}minHeads`),
      [
        [t(`${I}minCurrent`), fmt.taka(MIN_TAX_FLAT)],
        [t(`${I}minNew`), fmt.taka(MIN_TAX_NEW_TAXPAYER)],
        ...Object.keys(legacy).map((key) => [
          t(`${I}minLegacy.${key}`),
          fmt.taka(legacy[key]),
        ]),
      ],
      [1],
    ],
    ["h3", t(`${I}surchargeTitle`)],
    ["p", t(`${I}surchargeBody`)],
    surchargeTable(ctx),
    ["p", t(`${I}surchargeLifestyle`)],
    ["h3", t(`${I}salaryTitle`)],
    ["p", t(`${I}salaryBody`)],
    ["h3", t(`${I}rebateTitle`)],
    ["p", t(`${I}rebateBody`)],
    [
      "table",
      t.get(`${I}rebateHeads`),
      [
        [
          t(`${I}rebateRate`),
          fmt.percent(AY_RULES["2025-26"].rebate.rate),
          fmt.percent(AY_RULES["2026-27"].rebate.rate),
        ],
        [
          t(`${I}rebateIncome`),
          fmt.percent(REBATE_INCOME_PERCENT),
          fmt.percent(REBATE_INCOME_PERCENT),
        ],
        [
          t(`${I}rebateCap`),
          fmt.taka(AY_RULES["2025-26"].rebate.cap),
          fmt.taka(AY_RULES["2026-27"].rebate.cap),
        ],
      ],
      [1, 2],
    ],
    ["h3", t(`${I}filingTitle`)],
    ["p", t(`${I}filingBody`)],
    ["ul", filingRows],
  ];
}

function companyBlocks(ctx) {
  const { t, fmt } = ctx;
  const C = "page.rates.company.";
  return [
    ["h2", t(`${C}title`), "company"],
    ["p", t(`${C}body`)],
    [
      "table",
      t.get(`${C}heads`),
      COMPANY_TYPES.map((type) => [
        t(`ui.corp.types.${type.id}`),
        fmt.percent(type.rate),
        type.reducedRate === undefined
          ? t(`${C}none`)
          : fmt.percent(type.reducedRate),
      ]),
      [1, 2],
    ],
    ["h3", t(`${C}turnoverTitle`)],
    ["p", t(`${C}turnoverBody`)],
    [
      "table",
      t.get(`${C}turnoverHeads`),
      TURNOVER_TAX.map((entry) => [
        t(`ui.corp.turnoverCategory.${entry.id}`),
        fmt.percent(entry.rate),
      ]),
      [1],
    ],
  ];
}

function vatBlocks(ctx) {
  const V = "page.rates.vat.";
  return [
    ["h2", ctx.t(`${V}title`), "vat"],
    ["table", ctx.t.get(`${V}heads`), ctx.t.get(`${V}rows`)],
  ];
}

export default function rates(ctx) {
  const { t, config } = ctx;
  const trail = [{ label: t("site.tools.rates.name") }];
  const anchors = ["individual", "company", "vat"];
  const body = html`${pageHead(ctx, {
      trail,
      title: t("site.tools.rates.name"),
      lead: t("page.rates.lead"),
      badges: [
        badge(t("site.common.fyBadge"), "", ctx.icon("badgeCheck")),
        badge(
          t("site.common.verified", {
            date: ctx.fmt.date(config.rulesVerifiedOn),
          }),
          "outline",
        ),
      ],
    })}
    <section class="section section--tight">
      <div class="container">
        <nav
          class="chips anchor-chips"
          aria-label="${t("site.tools.rates.name")}"
        >
          ${anchors.map((id) => html`<a class="chip" href="#${id}">${t(`page.rates.nav.${id}`)}</a>`)}
        </nav>
        <article class="prose prose--wide">
          ${renderBlocks(ctx, [...individualBlocks(ctx), ...companyBlocks(ctx), ...vatBlocks(ctx), ["callout", "info", t("page.rates.archiveNote")]])}
          ${sourcesList(ctx, [SOURCES.pwcFinanceAct, SOURCES.pwcPersonal, SOURCES.pwcDeductions, SOURCES.pwcAdmin, SOURCES.nbrFinanceActs])}
        </article>
      </div>
    </section>`;
  return {
    id: "rates",
    title: t("site.meta.rates.title"),
    description: t("site.meta.rates.description"),
    body,
    entries: ["common"],
    jsonld: [breadcrumbJsonLd(ctx, trail, "rates")],
  };
}
