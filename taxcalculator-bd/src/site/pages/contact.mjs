import { html, inline } from "../html.mjs";
import { badge, breadcrumbJsonLd, pageHead } from "../components.mjs";

const C = "page.company.contact.";
const TOPICS = ["mistake", "feature", "question", "business"];

function emailCard(ctx) {
  const { t, config } = ctx;
  const email = config.contactEmail;
  return html`<div class="card contact-card">
    <span class="tile">${ctx.icon("mail")}</span>
    <h2>${t(`${C}emailTitle`)}</h2>
    <p>
      ${inline(t(`${C}emailText`, { email: `[${email}](mailto:${email})` }))}
    </p>
    <div class="cluster">
      <button
        class="btn btn-secondary btn-sm"
        type="button"
        data-copy-email="${email}"
        data-copied="${t(`${C}copied`)}"
      >
        ${ctx.icon("copy")}${t(`${C}copy`)}
      </button>
      ${
        config.whatsapp
          ? html`<a
              class="btn btn-secondary btn-sm"
              href="https://wa.me/${config.whatsapp}"
              target="_blank"
              rel="noopener noreferrer"
              >${ctx.icon("chat")}${t(`${C}whatsapp`)}</a
            >`
          : ""
      }
    </div>
    <hr class="divider" />
    <h3>${t(`${C}adviceTitle`)}</h3>
    <p>${t(`${C}adviceText`)}</p>
  </div>`;
}

function messageForm(ctx) {
  const { t, config } = ctx;
  return html`<form
    class="card contact-form"
    data-contact
    data-email="${config.contactEmail}"
    novalidate
  >
    <h2>${t(`${C}formTitle`)}</h2>
    <div class="field-row">
      <div class="field">
        <label for="c-name">${t(`${C}name`)}</label>
        <input
          class="control"
          id="c-name"
          name="name"
          type="text"
          autocomplete="name"
        />
      </div>
      <div class="field">
        <label for="c-email">${t(`${C}email`)}</label>
        <input
          class="control"
          id="c-email"
          name="email"
          type="email"
          autocomplete="email"
        />
      </div>
    </div>
    <div class="field">
      <label for="c-topic">${t(`${C}topic`)}</label>
      <select class="control" id="c-topic" name="topic">
        ${TOPICS.map(
          (key) =>
            html`<option value="${t(`${C}topics.${key}`)}">
              ${t(`${C}topics.${key}`)}
            </option>`,
        )}
      </select>
    </div>
    <div class="field">
      <label for="c-message">${t(`${C}message`)}</label>
      <textarea
        class="control"
        id="c-message"
        name="message"
        rows="6"
        required
      ></textarea>
    </div>
    <p class="hint">${t(`${C}formNote`)}</p>
    <button class="btn btn-primary" type="submit">
      ${ctx.icon("mail")}${t(`${C}send`)}
    </button>
  </form>`;
}

export default function contact(ctx) {
  const { t } = ctx;
  const trail = [{ label: t("site.nav.contact") }];
  const body = html`${pageHead(ctx, {
      trail,
      title: t("site.nav.contact"),
      lead: t(`${C}lead`),
      badges: [badge(t("site.common.free"), "blue", ctx.icon("mail"))],
    })}
    <section class="section section--tight">
      <div class="container grid grid--2">
        ${emailCard(ctx)}${messageForm(ctx)}
      </div>
    </section>`;
  return {
    id: "contact",
    title: t("site.meta.contact.title"),
    description: t("site.meta.contact.description"),
    body,
    entries: ["contact"],
    jsonld: [breadcrumbJsonLd(ctx, trail, "contact")],
  };
}
