/**
 * Income tax circulars (paripatra) and directives (nirdeshika).
 *
 * Circulars: https://nbr.gov.bd/taxtypes/income-tax/income-tax-paripatra/eng
 * Directives: the same NBR page (2020-21) and the NBR Central Taxes Survey Zone
 * list at https://taxsurvey.gov.bd/publications-forms/nirdeshika
 *
 * NBR names both after the tax year, so "2022-23" is filed under income year
 * 2021-22. Years for which the official lists carry no file are simply absent.
 */

import { circular, directive, nbrPdf, surveyPdf, text } from "./factory.mjs";

const paripatra = (file, label) => nbrPdf("paripatra", file, label);

export const CIRCULARS = [
  circular({
    taxYear: "2022-23",
    links: [
      paripatra("Paripatra_2022-2023_.pdf"),
      paripatra(
        "20.10_.2022_.pdf",
        text(
          "Later clarification: the definition of “person” in section 2(46) and tax at source on interest or profit under section 53F",
          "পরবর্তী স্পষ্টীকরণ: ধারা ২(৪৬)-এ প্রদত্ত “ব্যক্তি”-এর সংজ্ঞা এবং ধারা ৫৩এফ অনুযায়ী সুদ বা মুনাফা পরিশোধকালে উৎসে কর কর্তন",
        ),
      ),
      paripatra(
        "IMG_20230226_0002.pdf",
        text(
          "Later clarification: correction of printing errors in this circular and tax at source on public-auction sales or leases",
          "পরবর্তী স্পষ্টীকরণ: এই পরিপত্রের মুদ্রণজনিত ত্রুটি সংশোধন ও পাবলিক অকশনে বিক্রয় বা লিজে উৎসে কর",
        ),
      ),
    ],
  }),
  circular({
    taxYear: "2021-22",
    links: [paripatra("2021_Paripatra_draft_final.pdf")],
  }),
  circular({
    taxYear: "2020-21",
    links: [paripatra("2020_Paripatra_final_draft_dt._01_.09_.20_.pdf")],
  }),
  circular({
    taxYear: "2019-20",
    links: [paripatra("Paripatra_2019-20.pdf")],
  }),
  circular({
    taxYear: "2018-19",
    links: [paripatra("Income_Tax_Paripatra_2018-2019.pdf")],
  }),
  circular({
    taxYear: "2017-18",
    links: [paripatra("PARIPATRA_2017-18.pdf")],
  }),
  circular({ taxYear: "2016-17", links: [paripatra("16.pdf")] }),
  circular({ taxYear: "2015-16", links: [paripatra("14.pdf")] }),
  circular({ taxYear: "2014-15", links: [paripatra("13.pdf")] }),
  circular({
    id: "2013-14-a",
    taxYear: "2013-14",
    title: text(
      "Income Tax Circular No. 1 for 2013-14",
      "আয়কর পরিপত্র নং ১, ২০১৩-১৪",
    ),
    links: [paripatra("10.pdf")],
  }),
  circular({
    id: "2013-14-b",
    taxYear: "2013-14",
    title: text(
      "Irregularities of Grameen Bank (2013-14 circular)",
      "গ্রামীণ ব্যাংকের অনিয়ম (২০১৩-১৪ পরিপত্র)",
    ),
    links: [paripatra("9.pdf")],
  }),
  circular({
    id: "2013-14-c",
    taxYear: "2013-14",
    title: text("Income Tax Circular (2013-14)", "আয়কর পরিপত্র (২০১৩-১৪)"),
    links: [paripatra("8.pdf")],
  }),
  circular({
    id: "2012-13-a",
    taxYear: "2012-13",
    title: text(
      "Amendment of section 19 of the Income Tax Ordinance",
      "আয়কর অধ্যাদেশের ১৯ ধারায় সংশোধন",
    ),
    links: [paripatra("5.pdf")],
  }),
  circular({
    id: "2012-13-b",
    taxYear: "2012-13",
    title: text(
      "Amendment of some definitions in section 2 of the 1984 Ordinance",
      "১৯৮৪ সালের অধ্যাদেশের ২ ধারায় উল্লিখিত কতিপয় সংজ্ঞার সংশোধন",
    ),
    links: [paripatra("4.pdf")],
  }),
];

export const DIRECTIVES = [
  directive({
    taxYear: "2022-23",
    date: "2022-07-14",
    links: [surveyPdf("Nirdeshika_2022-2023.pdf")],
  }),
  directive({
    taxYear: "2021-22",
    date: "2021-07-06",
    links: [surveyPdf("Nirdeshika_2021-2022.pdf")],
  }),
  directive({
    taxYear: "2020-21",
    date: "2020-09-01",
    links: [
      paripatra("2020_Nirdeshika_dt._01_.09_.2020_.pdf"),
      surveyPdf(
        "2020_Nirdeshika.pdf",
        text("Copy on the Survey Zone site", "জরীপ অঞ্চলের সাইটে কপি"),
      ),
    ],
  }),
  directive({
    taxYear: "2019-20",
    date: "2019-07-28",
    links: [surveyPdf("combinepdf_compressed.pdf")],
  }),
  directive({
    taxYear: "2018-19",
    date: "2018-09-06",
    title: text(
      "Return filing and tax compliance guide for individual taxpayers, 2018-19",
      "ব্যক্তি শ্রেণির করদাতার রিটার্ন পূরণ ও কর পরিপালন নির্দেশিকা ২০১৮-১৯",
    ),
    links: [surveyPdf("Return_Fill_Up_Guideline_2018-2019-compressed.pdf")],
  }),
  directive({
    taxYear: "2017-18",
    title: text(
      "Return filing and tax compliance guide for individual taxpayers, 2017-18",
      "ব্যক্তি শ্রেণির করদাতার রিটার্ন পূরণ ও কর পরিপালন নির্দেশিকা ২০১৭-১৮",
    ),
    links: [surveyPdf("NIRDESHIKA_2017-18.pdf")],
  }),
  directive({
    taxYear: "2016-17",
    date: "2016-09-01",
    title: text("Return Filing Guideline 2016", "রিটার্ন দাখিল নির্দেশিকা ২০১৬"),
    links: [surveyPdf("274.pdf")],
  }),
];
