/**
 * The laws behind the archive years: the Income-tax Ordinance, 1984, its Rules,
 * and the Finance Acts, which amended the Ordinance and set each year's rates.
 *
 * Ordinance: Laws of Bangladesh, https://bdlaws.minlaw.gov.bd/act-672.html
 * Finance Acts: https://nbr.gov.bd/regulations/acts/finance-acts/eng
 * Rules: https://nbr.gov.bd/regulations/rules/income-tax-rules/eng
 */

import {
  bdlawsPage,
  financeAct,
  nbrPdf,
  standingLaw,
  text,
} from "./factory.mjs";

const STANDING = [
  standingLaw({
    id: "income-tax-ordinance-1984",
    title: text("The Income-tax Ordinance, 1984", "আয়কর অধ্যাদেশ, ১৯৮৪"),
    ref: { kind: "ordinance", roman: "XXXVI", no: 36, year: 1984 },
    date: "1984-06-04",
    note: text(
      "In force from 1 July 1984. Repealed by the Income Tax Act, 2023 (Act No. 12 of 2023). The Laws of Bangladesh text is consolidated, with amendment notes.",
      "১৯৮৪ সালের ১ জুলাই থেকে কার্যকর। আয়কর আইন, ২০২৩ (২০২৩ সনের ১২ নং আইন) দ্বারা রহিত। বাংলাদেশের আইন সাইটের পাঠটি সমন্বিত এবং সংশোধনী টীকাসহ।",
    ),
    links: [
      bdlawsPage("act-672.html"),
      nbrPdf(
        "acts",
        "25.pdf",
        text(
          "NBR copy, amended up to July 2015",
          "এনবিআরের কপি, জুলাই ২০১৫ পর্যন্ত সংশোধিত",
        ),
      ),
    ],
  }),
  standingLaw({
    id: "income-tax-rules-1984",
    title: text("The Income Tax Rules, 1984", "আয়কর বিধিমালা, ১৯৮৪"),
    note: text(
      "NBR's compilation, published as Income Tax Manual, Part II. Later amendments were made through SROs; see Notifications.",
      "এনবিআরের সংকলন, আয়কর ম্যানুয়াল পার্ট-২ হিসেবে প্রকাশিত। পরবর্তী সংশোধন এসআরওর মাধ্যমে হয়েছে; প্রজ্ঞাপন দেখুন।",
    ),
    links: [nbrPdf("rules", "15.pdf")],
  }),
];

const act = (year, file, extra = {}) =>
  financeAct({ year, links: [nbrPdf("acts", file)], ...extra });

export const LAWS = [
  ...STANDING,
  financeAct({
    year: 2022,
    number: 13,
    date: "2022-06-30",
    links: [
      nbrPdf("acts", "Finance_Act,_2022.pdf"),
      bdlawsPage(
        "act-details-1409.html",
        text("Laws of Bangladesh", "বাংলাদেশের আইন"),
      ),
    ],
  }),
  act(2021, "Finance_Act-2021_Gazette.pdf"),
  act(2020, "Finance_Act_2020.pdf"),
  act(2019, "Finance_Act_2019_BG_Press.pdf"),
  act(2018, "Financial_Act_(2018).pdf"),
  act(2017, "Finance_Act,_2017.pdf"),
  act(2016, "finance_27.pdf"),
  act(2015, "24.pdf"),
  act(2014, "20.pdf"),
  act(2013, "17.pdf"),
  act(2012, "16.pdf"),
  act(2011, "15.pdf"),
  act(2010, "14.pdf"),
  act(2009, "13.pdf"),
];
