/**
 * Income tax SROs listed by NBR for June 2022 back to July 2020, transcribed
 * from https://nbr.gov.bd/regulations/sros/income-tax-sros/eng (pages 2 and 3).
 * Dates are the dates NBR's list shows. Titles are short bilingual summaries of
 * NBR's own description; the PDF is the authoritative text.
 */

import { sro, text } from "./factory.mjs";

const SAME_NUMBER = text(
  "NBR's list gives the number 104 to two different notifications. Check the PDF for the number it actually carries.",
  "এনবিআরের তালিকায় দুটি ভিন্ন প্রজ্ঞাপনকে একই ১০৪ নম্বর দেওয়া হয়েছে। প্রজ্ঞাপনে আসলে কোন নম্বর আছে, তা পিডিএফে দেখুন।",
);

const LISTED_LATE = text(
  "NBR lists this on 8 July 2020, but its number shows it was issued in 2019.",
  "এনবিআর এটি ২০২০ সালের ৮ জুলাই তালিকাভুক্ত করেছে, কিন্তু নম্বর অনুযায়ী এটি ২০১৯ সালে জারি হয়েছিল।",
);

const JUNE_2021 = [
  [
    "173",
    "SRO_on-173_Rule_SRO_2021.pdf",
    "Income Tax Rules notification, 2021",
    "আয়কর বিধিমালা সংক্রান্ত প্রজ্ঞাপন, ২০২১",
  ],
  [
    "172",
    "SRO_on-172_Marine_Vessels_SRO_amendment.pdf",
    "Marine vessels: amendment of an earlier SRO",
    "সামুদ্রিক জাহাজ (মেরিন ভেসেল): পূর্ববর্তী এসআরও সংশোধন",
  ],
  [
    "171",
    "SRO_on171_Fisheries_SRO_amendment.pdf",
    "Fisheries: amendment of an earlier SRO",
    "মৎস্য খাত: পূর্ববর্তী এসআরও সংশোধন",
  ],
  [
    "170",
    "SRO_on-170_Automobile-_Made_in_Bangladesh.pdf",
    "Automobiles made in Bangladesh",
    "বাংলাদেশে তৈরি অটোমোবাইল",
  ],
  ["169", "SRO_on-169_Hospitals.pdf", "Hospitals", "হাসপাতাল"],
  [
    "168",
    "SRO_on-168_Human_Resource_Developement.pdf",
    "Human resource development",
    "মানবসম্পদ উন্নয়ন",
  ],
  [
    "167",
    "SRO_on-167_Home_appliances.pdf",
    "Home appliances",
    "গৃহস্থালি সামগ্রী (হোম অ্যাপ্লায়েন্স)",
  ],
  [
    "166",
    "SRO_on-166_Light_Engineering.pdf",
    "Light engineering",
    "হালকা প্রকৌশল",
  ],
  [
    "165",
    "SRO_on-165_Commecial_Vehicle_sro_amendment.pdf",
    "Commercial vehicles: amendment of an earlier SRO",
    "বাণিজ্যিক যানবাহন: পূর্ববর্তী এসআরও সংশোধন",
  ],
  [
    "164",
    "SRO_on-164_Agro-based_Industry.pdf",
    "Agro-based industry",
    "কৃষিভিত্তিক শিল্প",
  ],
  ["163", "SRO_on-163_ICT_Products.pdf", "ICT products", "আইসিটি পণ্য"],
].map(([no, file, en, bn]) =>
  sro({ no, year: 2021, date: "2021-06-03", file, title: text(en, bn) }),
);

const JUNE_2022 = [
  [
    "160",
    "SRO-160(_Repeal)_.pdf",
    "Cancellation of six notifications",
    "ছয়টি প্রজ্ঞাপন রহিতকরণ",
  ],
  [
    "159",
    "SRO-159_(Textile).pdf",
    "Reduced income-tax rate, on conditions, for companies in yarn, dyeing, finishing, coning, fabric and printing businesses",
    "সুতা উৎপাদন, ডাইং, ফিনিশিং, কোনিং, কাপড় তৈরি ও প্রিন্টিং ব্যবসায় নিয়োজিত কোম্পানির জন্য শর্তসাপেক্ষে হ্রাসকৃত আয়করের হার",
  ],
  [
    "158",
    "SRO-158_(Export).pdf",
    "Conditional income-tax exemption or reduced rate on income earned from exports",
    "রপ্তানি থেকে অর্জিত আয়ের ওপর শর্তসাপেক্ষে আয়কর অব্যাহতি বা হ্রাসকৃত হার",
  ],
  [
    "157",
    "SRO-157_(Fisheries).pdf",
    "Reduced income tax, subject to compliance, on income from poultry farms, hatcheries and fish farming",
    "হাঁস-মুরগির খামার, হ্যাচারি ও মৎস্য চাষ থেকে অর্জিত আয়ের ওপর শর্ত পরিপালন সাপেক্ষে হ্রাসকৃত আয়কর",
  ],
  [
    "156",
    "SRO-156_(OIT_Rules).pdf",
    "The Offshore Indirect Transfer Rules, 2022",
    "অফশোর ইনডাইরেক্ট ট্রান্সফার বিধিমালা, ২০২২",
  ],
  [
    "155",
    "SRO-155_(_Rule_SRO_2022.extention)__.pdf",
    "Further amendment of the Income Tax Rules, 1984",
    "আয়কর বিধিমালা, ১৯৮৪-এর অধিকতর সংশোধন",
  ],
].map(([no, file, en, bn]) =>
  sro({ no, year: 2022, date: "2022-06-09", file, title: text(en, bn) }),
);

const JULY_2020 = [
  {
    no: "104",
    year: 2020,
    date: "2020-07-09",
    file: "IMG_20200709_0001.pdf",
    title: text(
      "Reduced income tax for jute-goods manufacturers, for tax years 2020-21, 2021-22 and 2022-23",
      "পাটজাত দ্রব্য উৎপাদনকারী শিল্প প্রতিষ্ঠানের হ্রাসকৃত আয়কর (২০২০-২১, ২০২১-২২ ও ২০২২-২৩ করবর্ষ)",
    ),
    note: SAME_NUMBER,
  },
  {
    no: "104",
    year: 2020,
    date: "2020-07-08",
    file: "IMG_20200708_0011.pdf",
    title: text(
      "Income-tax exemption, on various conditions and rates, on income from various goods and services (not edible oil, sugar, flour, maida, cement, iron or iron products)",
      "বিভিন্ন পণ্য ও সেবা (ভোজ্য তেল, চিনি, আটা, ময়দা, সিমেন্ট, লোহা ও লৌহজাত পণ্য ব্যতীত) থেকে উদ্ভূত আয়ের ওপর বিভিন্ন শর্ত ও হারে আয়কর অব্যাহতি",
    ),
    note: SAME_NUMBER,
  },
  {
    no: "02",
    year: 2020,
    date: "2020-07-08",
    file: "IMG_20200708_0008.pdf",
    title: text(
      "Tax deduction at source reduced from ten percent to five percent",
      "উৎসে কর কর্তনের হার দশ শতাংশ থেকে কমিয়ে পাঁচ শতাংশ",
    ),
  },
  {
    no: "05",
    year: 2020,
    date: "2020-07-08",
    file: "IMG_20200708_0007.pdf",
    title: text(
      "Tax exemption for private power generation companies, on specific conditions",
      "নির্দিষ্ট শর্তে বেসরকারি বিদ্যুৎ উৎপাদনকারী কোম্পানির কর অব্যাহতি",
    ),
  },
  {
    no: "04",
    year: 2020,
    date: "2020-07-08",
    file: "IMG_20200708_0006.pdf",
    title: text(
      "Further amendment of S.R.O. No. 212-Law/Income Tax/2013",
      "এস.আর.ও. নং ২১২-আইন/আয়কর/২০১৩-এর অধিকতর সংশোধন",
    ),
  },
  {
    no: "29",
    year: 2020,
    date: "2020-07-08",
    file: "IMG_20200708_0005.pdf",
    title: text(
      "Exemption of advance income tax on imports of chemical compounds (technical grade or pure) to promote APIs (active pharmaceutical ingredients)",
      "এপিআই (অ্যাক্টিভ ফার্মাসিউটিক্যাল ইনগ্রেডিয়েন্ট) উৎসাহিত করতে রাসায়নিক যৌগ (টেকনিক্যাল গ্রেড বা বিশুদ্ধ) আমদানিতে অগ্রিম আয়কর অব্যাহতি",
    ),
  },
  {
    no: "394",
    year: 2019,
    date: "2020-07-08",
    file: "IMG_20200708_0004.pdf",
    title: text(
      "Proposed further amendment of the Income Tax Rules, 1984",
      "আয়কর বিধিমালা, ১৯৮৪-এর অধিকতর সংশোধনের প্রস্তাব",
    ),
    note: LISTED_LATE,
  },
  {
    no: "259",
    year: 2019,
    date: "2020-07-08",
    file: "IMG_20200708_0003.pdf",
    title: text(
      "Proposed further amendment of the Income Tax Rules, 1984",
      "আয়কর বিধিমালা, ১৯৮৪-এর অধিকতর সংশোধনের প্রস্তাব",
    ),
    note: LISTED_LATE,
  },
  {
    no: "165",
    year: 2020,
    date: "2020-07-06",
    file: "IMG_20200706_0003.pdf",
    title: text(
      "Proposed amendment of the Income Tax Rules, 1984",
      "আয়কর বিধিমালা, ১৯৮৪-এর সংশোধনের প্রস্তাব",
    ),
  },
  {
    no: "164",
    year: 2020,
    date: "2020-07-06",
    file: "IMG_20200706_0002.pdf",
    title: text(
      "Amendment of S.R.O. No. 255-Law/Income Tax/2017",
      "এস.আর.ও. নং ২৫৫-আইন/আয়কর/২০১৭-এর সংশোধন",
    ),
  },
  {
    no: "163",
    year: 2020,
    date: "2020-07-06",
    file: "IMG_20200706_0001.pdf",
    title: text(
      "Amendment of S.R.O. No. 186-Law/2009",
      "এস.আর.ও. নং ১৮৬-আইন/২০০৯-এর সংশোধন",
    ),
  },
].map(sro);

export const SROS_2020_2022 = [...JUNE_2022, ...JUNE_2021, ...JULY_2020];
