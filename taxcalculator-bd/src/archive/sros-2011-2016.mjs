/**
 * Income tax SROs listed by NBR for June 2016 back to October 2011,
 * transcribed from https://nbr.gov.bd/regulations/sros/income-tax-sros/eng
 * (pages 4 and 5). NBR's descriptions for these are often just a topic, which
 * is what the summaries below reflect; the PDF is the authoritative text.
 * NBR lists the June 2016 batch twice under different file names; each is kept
 * once.
 */

import { sro, text } from "./factory.mjs";

const TRAVEL_TAX = text(
  "A travel-tax notification that NBR lists with its income tax SROs.",
  "এটি ভ্রমণ কর-সংক্রান্ত প্রজ্ঞাপন, যা এনবিআর আয়কর এসআরওর তালিকায় রেখেছে।",
);

const batch = (year, date, entries) =>
  entries.map(([no, file, en, bn]) =>
    sro({ no, year, date, file, title: text(en, bn) }),
  );

const JUNE_2016 = batch(2016, "2016-06-29", [
  [
    "204",
    "662.pdf",
    "Revision of the Alternative Dispute Resolution (ADR) rules",
    "বিকল্প বিরোধ নিষ্পত্তি (এডিআর) বিধিমালার সংশোধন",
  ],
  [
    "205",
    "663.pdf",
    "Reduced tax rate on exports of jute goods",
    "পাটজাত পণ্য রপ্তানিতে হ্রাসকৃত করহার",
  ],
  [
    "207",
    "664.pdf",
    "Advance income tax (AIT) on exports of jute goods",
    "পাটজাত পণ্য রপ্তানিতে অগ্রিম আয়কর",
  ],
  [
    "208",
    "665.pdf",
    "Reduced tax rate for knitwear and woven garments",
    "নিটওয়্যার ও ওভেন গার্মেন্টসের জন্য হ্রাসকৃত করহার",
  ],
  [
    "209",
    "666.pdf",
    "Amendment of the Income Tax Rules, 1984",
    "আয়কর বিধিমালা, ১৯৮৪-এর সংশোধন",
  ],
]);

const JUNE_2015 = batch(2015, "2015-06-30", [
  [
    "192",
    "590.pdf",
    "Amendment of the Income Tax Rules (2015)",
    "আয়কর বিধিমালার সংশোধন (২০১৫)",
  ],
  ["193", "591.pdf", "Tax rate for the textile sector", "টেক্সটাইল খাতের করহার"],
  ["194", "592.pdf", "Tax rate for jute goods", "পাটজাত পণ্যের করহার"],
  [
    "195",
    "593.pdf",
    "Income-tax exemption for the Bangladesh Securities and Exchange Commission (listed by NBR as “SEC tax holiday”)",
    "বাংলাদেশ সিকিউরিটিজ অ্যান্ড এক্সচেঞ্জ কমিশনের আয়কর অব্যাহতি (এনবিআরের তালিকায় “এসইসি ট্যাক্স হলিডে”)",
  ],
  [
    "196",
    "594.pdf",
    "Tax rate on capital gains from shares",
    "শেয়ারের মূলধনী লাভের করহার",
  ],
  [
    "197",
    "595.pdf",
    "Amendment of the tax rate for autonomous bodies",
    "স্বায়ত্তশাসিত সংস্থার করহার সংশোধন",
  ],
  ["198", "596.pdf", "Tax on government employees", "সরকারি কর্মচারীদের কর"],
  ["199", "597.pdf", "Poultry feed, etc.", "পোল্ট্রি ফিড ইত্যাদি"],
]);

const JULY_2014 = batch(2014, "2014-07-01", [
  ["185", "508_bng.pdf", "Industrial tax rebate", "শিল্পের কর রেয়াত"],
  [
    "187",
    "509.pdf",
    "Pratibandhi Unnayan Foundation",
    "প্রতিবন্ধী উন্নয়ন ফাউন্ডেশন",
  ],
  [
    "186",
    "510.pdf",
    "Corporate social responsibility (CSR)",
    "কর্পোরেট সামাজিক দায়বদ্ধতা (সিএসআর) সম্পর্কিত",
  ],
  ["184", "511.pdf", "Rules notification", "বিধিমালা সংক্রান্ত প্রজ্ঞাপন"],
]);

const JUNE_2014 = batch(2014, "2014-06-26", [
  ["156", "512.pdf", "Cancellation of certain SROs", "কতিপয় এসআরও রহিতকরণ"],
  ["157", "513.pdf", "Stock exchange", "স্টক এক্সচেঞ্জ"],
  ["158", "514.pdf", "Autonomous authority", "স্বায়ত্তশাসিত কর্তৃপক্ষ"],
  ["160", "516.pdf", "Presumptive tax", "অনুমিত কর"],
  ["161", "517.pdf", "Transfer pricing", "ট্রান্সফার প্রাইসিং"],
  ["162", "518.pdf", "Launch, steamer, etc.", "লঞ্চ, স্টিমার ইত্যাদি"],
  ["163", "519.pdf", "Research institute", "গবেষণা প্রতিষ্ঠান"],
  ["164", "520.pdf", "Private cars", "ব্যক্তিগত গাড়ি"],
]);

const JULY_2013 = batch(2013, "2013-07-01", [
  [
    "205",
    "374.pdf",
    "Amendment of the Income Tax Alternative Dispute Resolution (Procedure) Rules, 2012",
    "আয়কর বিকল্প বিরোধ নিষ্পত্তি (পদ্ধতি) বিধিমালা, ২০১২-এর সংশোধন",
  ],
  [
    "206",
    "375.pdf",
    "Amendment of S.R.O. No. 206-Law/Income Tax/2008",
    "এস.আর.ও. নং ২০৬-আইন/আয়কর/২০০৮-এর সংশোধন",
  ],
  [
    "207",
    "376.pdf",
    "Amendment of S.R.O. No. 207-Law/Income Tax/2008",
    "এস.আর.ও. নং ২০৭-আইন/আয়কর/২০০৮-এর সংশোধন",
  ],
  [
    "208",
    "377.pdf",
    "Reduced income tax for poultry-feed and fish-feed manufacturers",
    "হাঁস-মুরগি ও মাছের খাদ্য প্রস্তুতকারকের আয়কর হ্রাস",
  ],
  [
    "209",
    "378.pdf",
    "Amendment of S.R.O. No. 187-Law/2009",
    "এস.আর.ও. নং ১৮৭-আইন/২০০৯-এর সংশোধন",
  ],
  [
    "210",
    "379.pdf",
    "Tax exemption for business organisations",
    "ব্যবসায়িক প্রতিষ্ঠানের কর অব্যাহতি",
  ],
  [
    "211",
    "381.pdf",
    "Income-tax exemption for a private power generation plant",
    "বেসরকারি বিদ্যুৎ উৎপাদন কেন্দ্রের আয়কর অব্যাহতি",
  ],
  [
    "212",
    "382.pdf",
    "Income-tax exemption for a private power generation centre",
    "বেসরকারি বিদ্যুৎ উৎপাদন কেন্দ্রের আয়কর অব্যাহতি",
  ],
  [
    "213",
    "383.pdf",
    "Income-tax exemption for a private power generation plant",
    "বেসরকারি বিদ্যুৎ উৎপাদন কেন্দ্রের আয়কর অব্যাহতি",
  ],
]);

const SINGLES = [
  {
    no: "324",
    year: 2015,
    date: "2015-11-09",
    file: "6101.pdf",
    series: "travel",
    title: text(
      "Travel tax: residents of enclaves (chhitmahal) permanently moving to India",
      "ভ্রমণ কর: স্থায়ীভাবে ভারতে গমনকারী ছিটমহলবাসী",
    ),
    note: TRAVEL_TAX,
  },
  {
    no: "224",
    year: 2015,
    date: "2015-07-02",
    file: "5981.pdf",
    title: text("Tax on exports", "রপ্তানির ওপর কর"),
  },
  {
    no: "289",
    year: 2014,
    date: "2014-12-17",
    file: "527.pdf",
    title: text(
      "Coal: correction inserting serial 87A after serial 87 in clause (b) of 17(A)",
      "কয়লা: ১৭(ক)-এর দফা (খ)-তে ক্রমিক ৮৭-এর পর নতুন ক্রমিক ৮৭ক সংযোজনের সংশোধনী",
    ),
  },
  {
    no: "206",
    year: 2014,
    date: "2014-07-20",
    file: "525.pdf",
    title: text("Correction of S.R.O. 68", "এস.আর.ও. ৬৮-এর সংশোধনী"),
  },
  {
    no: "159",
    year: 2014,
    date: "2014-06-26",
    file: "515.pdf",
    series: null,
    title: text("Travel tax", "ভ্রমণ কর"),
    note: TRAVEL_TAX,
  },
  {
    no: "268",
    year: 2013,
    date: "2013-07-30",
    file: "380.pdf",
    title: text(
      "Amendment of the Income Tax Rules, 1984",
      "আয়কর বিধিমালা, ১৯৮৪-এর সংশোধন",
    ),
  },
  {
    no: "224",
    year: 2012,
    date: "2012-06-26",
    file: "10_bng.pdf",
    title: text(
      "Income-tax applicability and exemption for inland water transport",
      "অভ্যন্তরীণ নৌ-পরিবহনের ক্ষেত্রে আয়কর প্রযোজ্যতা ও অব্যাহতি",
    ),
  },
  {
    no: "334",
    year: 2011,
    date: "2011-10-26",
    file: "16.pdf",
    title: text(
      "Tax deduction at source on stock exchange members",
      "স্টক এক্সচেঞ্জ সদস্যদের ওপর উৎসে কর কর্তন",
    ),
  },
].map(sro);

export const SROS_2011_2016 = [
  ...JUNE_2016,
  ...JUNE_2015,
  ...JULY_2014,
  ...JUNE_2014,
  ...JULY_2013,
  ...SINGLES,
];
