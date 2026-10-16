export default {
  title:
    "Archive: older tax-year circulars, directives, notifications and laws",
  lead: "Official documents for income years up to {last}, linked from NBR and other government sources: yearly circulars, directives, SRO notifications and the laws.",
  badges: {
    years: "Income years {first} to {last}",
    era: "Income-tax Ordinance, 1984",
    official: "Links to official sources",
    checked: "Official lists checked {date}",
    count: "{count} documents",
  },
  scope:
    "Income year {last} (1 July {startYear} to 30 June {endYear}) is tax year {taxYear}, the last year assessed under the Income-tax Ordinance, 1984. The Income Tax Act, 2023 replaced the Ordinance and applies from income year {next}, so newer material is not in this archive. For current rules see [tax rates]({@rates}) and the [calculators]({@hub}).",
  menu: {
    title: "Documents up to income year {last}",
    byYear: "By income year",
    all: "Search the whole archive",
    allDesc: "Circulars, directives, notifications and laws in one list",
  },
  teaser: {
    title: "Need an older tax year?",
    text: "Circulars, directives, notifications and laws for income years up to {last}, each linked from its official source.",
    cta: "Open the archive",
  },
  types: {
    circular: {
      name: "Circulars",
      single: "Circular",
      native: "পরিপত্র",
      desc: "NBR's yearly circular explaining each year's tax changes",
      title: "Income tax circulars (Paripatra)",
      lead: "NBR's yearly circular after the budget, explaining what the Finance Act, the rules and the SROs changed for that tax year.",
      about: [
        "NBR issues an income tax circular (paripatra) each year after the budget. It explains what the Finance Act, the rules and the SROs changed for that tax year.",
        "Recent circulars give worked examples and cover the tax rates for the year, changes to exemptions and rebates, amendments to the Ordinance and the withholding (TDS) rate schedule.",
      ],
      note: "NBR names each circular after the tax year. “Circular {taxYear}” covers tax year {taxYear}, so it is filed under income year {last}. A later clarification appears as an extra link on the circular it corrects.",
    },
    directive: {
      name: "Directives",
      single: "Directive",
      native: "নির্দেশিকা",
      desc: "Yearly guide to filling in the return and complying",
      title: "Income tax directives (Nirdeshika)",
      lead: "A yearly NBR guide for individual taxpayers on filling in the return and complying with the law.",
      about: [
        "The income tax directive (nirdeshika) is a yearly NBR guide for individual taxpayers on filling in the return and complying with the law.",
        "Recent directives cover general information, the individual return, how income under each head is worked out, how tax is calculated, worked examples, and the statements of assets, liabilities and lifestyle expenses.",
      ],
      note: "Like the circular, each directive is named after the tax year: “Directive {taxYear}” is filed under income year {last}. The official lists we use carry directives from income year {from} onward.",
    },
    sro: {
      name: "Notifications (SRO)",
      single: "Notification",
      native: "প্রজ্ঞাপন",
      desc: "SROs granting exemptions, setting rates, amending rules",
      title: "Income tax notifications (SRO)",
      lead: "The SROs NBR lists on its website under the Income-tax Ordinance, with the PDF of each.",
      about: [
        "A notification (SRO, in Bangla prozapon) is an order NBR publishes in the official gazette under the Income-tax Ordinance. Typical SROs grant income-tax exemptions, set reduced rates for a sector, change withholding rates, or amend the Income Tax Rules, 1984.",
        "How to read the number: “S.R.O. No. 167-Law/Income Tax/2021” is notification number 167 of 2021 in the Law series, for income tax.",
      ],
      note: "This is the list NBR publishes on its website, not every SRO ever issued, and some years have none. Dates are as NBR shows them and can be upload dates. Notifications are grouped by the income year (1 July to 30 June) of that date. If you cannot find one here, search NBR's own list.",
    },
    law: {
      name: "Laws",
      single: "Law",
      native: "আইন",
      desc: "The Ordinance, its Rules and the Finance Acts",
      title: "Income tax laws and rules",
      lead: "The Income-tax Ordinance, 1984, its Rules and the Finance Acts that amended it and set each year's rates.",
      about: [
        "The Income-tax Ordinance, 1984 was Bangladesh's income tax law until the Income Tax Act, 2023 (Act No. 12 of 2023) repealed it.",
        "Each year a Finance Act amended the Ordinance and set that year's tax rates. We file each Finance Act under the income year whose tax year it covers, so the Finance Act 2022 sits under income year 2021-22. The Income Tax Rules, 1984 were amended through SROs; see Notifications.",
      ],
      note: "Looking for the current law? NBR publishes the [Income Tax Act, 2023]({url}).",
    },
  },
  hub: {
    typesTitle: "Browse by document type",
    yearsTitle: "Browse by income year",
    yearsLead:
      "Each income year page gathers that year's circular, directive, notifications and laws in one place.",
    libraryTitle: "Search the whole archive",
    libraryLead:
      "Filter by type and income year, or search by title, SRO number or year.",
    faqTitle: "How to use the archive",
    listsTitle: "Official lists",
    listsLead:
      "The archive follows these official pages. Check them for anything newer or missing.",
    open: "Open",
    moreTitle: "More from the archive",
    counts: {
      circular: "Circulars",
      directive: "Directives",
      sro: "SROs",
      law: "Laws",
    },
  },
  library: {
    search: "Search",
    placeholder: "Title, SRO number or year, e.g. 167 or jute",
    type: "Document type",
    all: "All",
    year: "Income year",
    allYears: "All income years",
    yearOption: "{year} (tax year {taxYear})",
    before: "Before {first}",
    standing: "Every year",
    count: "Showing {shown} of {total} documents",
    empty: "No document matches. Try fewer words or clear the filters.",
    clear: "Clear filters",
  },
  doc: {
    openPdf: "Open PDF",
    openWeb: "View online",
    source: "Source: {name}",
    taxYear: "Tax year {taxYear}",
    standing: "Applies to every year",
    sources: {
      nbr: "NBR",
      survey: "NBR Central Taxes Survey Zone",
      bdlaws: "Laws of Bangladesh",
    },
    series: { income: "Income Tax", travel: "Travel" },
    refs: {
      sro: "S.R.O. No. {no}-Law/{series}/{year}",
      sroPlain: "S.R.O. No. {no}-Law/{year}",
      act: "Act No. {no} of {year}",
      ordinance: "Ordinance No. {no} of {year}",
    },
  },
  year: {
    title: "Income year {year}",
    lead: "Circulars, directives, notifications and laws for income year {year} ({from} to {to}), assessed as tax year {taxYear} under the Income-tax Ordinance, 1984.",
    badges: { taxYear: "Tax year {taxYear}", act: "Finance Act {actYear}" },
    facts: {
      incomeYear: "Income year",
      taxYear: "Tax year (assessment year)",
      financeAct: "Finance Act",
      nbrName: "NBR names its circular and directive",
      period: "{from} to {to}",
    },
    empty: {
      circular: "No circular for this income year is listed on NBR's website.",
      directive:
        "No directive for this income year is listed in the official lists.",
      sro: "NBR's list has no notification dated in this income year.",
      law: "No law is listed for this income year.",
    },
    standingTitle: "Laws that apply to every year",
    earlier: "Earlier year",
    later: "Later year",
    navLabel: "Other income years",
  },
  faq: [
    {
      q: "What is an income year, and what is a tax year?",
      a: [
        "The income year is the twelve months in which income is earned, usually 1 July to 30 June. The tax year, also called the assessment year, is the year after, in which that income is assessed and the return is filed.",
        "Income year 2021-22 (1 July 2021 to 30 June 2022) is tax year 2022-23.",
      ],
    },
    {
      q: "Why is “Circular 2022-23” listed under income year 2021-22?",
      a: "NBR names its yearly circular and directive after the tax year, which is one year after the income year. We file each under the income year it applies to and always show NBR's own title so you can match it.",
    },
    {
      q: "Why does the archive stop at income year 2021-22?",
      a: "The Income Tax Act, 2023 (Act No. 12 of 2023) repealed the Income-tax Ordinance, 1984 and has applied since 22 June 2023. Income year 2021-22 is the last one assessed under the Ordinance, so this archive covers the Ordinance era. For newer years use the [tax rates]({@rates}) page and the calculators.",
    },
    {
      q: "How do I read an SRO number?",
      a: "“S.R.O. No. 167-Law/Income Tax/2021” is notification number 167 of 2021 in the Law series for income tax. Search the library by the number, or by the year, to find it.",
    },
    {
      q: "Are these the official documents?",
      a: [
        "Every document links to the official PDF or page on an NBR or other government website. We do not host or change any file. The titles are our short summaries of NBR's descriptions and can be simplified, so open the document for the authoritative text.",
        "Dates are as shown in the official lists, which can be upload dates.",
      ],
    },
    {
      q: "A document is missing or a link is broken. What now?",
      a: "The archive follows NBR's published lists, and some years have no document of a given type there. If you know of one that is missing, or a link has moved, tell us on the [contact page]({@contact}). The official lists are linked below.",
    },
  ],
  lists: {
    nbrParipatra: "NBR: income tax circulars (Paripatra)",
    surveyNirdeshika: "NBR Central Taxes Survey Zone: directives (Nirdeshika)",
    nbrSros: "NBR: income tax SROs",
    nbrActs: "NBR: income tax Acts",
    nbrFinanceActs: "NBR: Finance Acts",
    bdlawsOrdinance: "Laws of Bangladesh: Income-tax Ordinance, 1984",
  },
};
