/**
 * Income tax SROs listed by NBR for June 2019 back to July 2016, transcribed
 * from https://nbr.gov.bd/regulations/sros/income-tax-sros/eng (pages 3 and 4).
 * NBR lists some of these twice under different file names; each is kept once.
 */

import { sro, text } from "./factory.mjs";

const JUNE_2019 = [
  [
    "214",
    "SRO-2141.pdf",
    "Conditional income-tax exemption on the entire income from passenger vessels on inland waterways and from cargo vessels, containers, coasters and dump barges (replaces S.R.O. No. 224-Law/Income Tax/2012)",
    "অভ্যন্তরীণ নৌপথে যাত্রী পরিবহনের নৌযান এবং মালামাল পরিবহনের কার্গো, কন্টেইনার, কোস্টার বা ডাম্পবার্জ থেকে অর্জিত সম্পূর্ণ আয়ের ওপর শর্তসাপেক্ষে আয়কর অব্যাহতি (এস.আর.ও. নং ২২৪-আইন/আয়কর/২০১২ রহিতক্রমে)",
  ],
  [
    "215",
    "SRO-2151.pdf",
    "Conditional income-tax exemption on the entire income from buses, minibuses, coasters, taxicabs, prime movers, trucks, tank lorries, pick-ups, human haulers, maxis and goods auto-rickshaws (replaces S.R.O. No. 171-Law/Income Tax/2009)",
    "বাস, মিনিবাস, কোস্টার, ট্যাক্সিক্যাব, প্রাইমমুভার, ট্রাক, ট্যাংক-লরি, পিক-আপ, হিউম্যানহলার, ম্যাক্সি বা মালবাহী অটোরিকশা থেকে অর্জিত সম্পূর্ণ আয়ের ওপর শর্তসাপেক্ষে আয়কর অব্যাহতি (এস.আর.ও. নং ১৭১-আইন/আয়কর/২০০৯ রহিতক্রমে)",
  ],
  [
    "216",
    "SRO-216.pdf",
    "Cancellation of the notifications it lists",
    "উল্লিখিত প্রজ্ঞাপনসমূহ রহিতকরণ",
  ],
  [
    "217",
    "SRO-217.pdf",
    "Corporate tax rate for the ready-made garment sector",
    "তৈরি পোশাক খাতের কর্পোরেট করহার",
  ],
  [
    "218",
    "SRO-218.pdf",
    "Corporate tax rate for the textile sector",
    "টেক্সটাইল খাতের কর্পোরেট করহার",
  ],
].map(([no, file, en, bn]) =>
  sro({ no, year: 2019, date: "2019-06-23", file, title: text(en, bn) }),
);

const JUNE_2017 = [
  [
    "205",
    "%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A8%E0%A7%A6%E0%A7%AB-_Income_Tax_Rules-1984",
    "Amendment of the Income Tax Rules, 1984",
    "আয়কর বিধিমালা, ১৯৮৪-এর সংশোধন",
  ],
  [
    "206",
    "%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A8%E0%A7%A6%E0%A7%AC-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AD%E0%A5%A4--%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A7%E0%A7%AF%E0%A7%AB-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AB_%E0%A6%B0%E0%A6%B9%E0%A6%BF%E0%A6%A4_%E0%A6%95%E0%A6%B0%E0%A6%BE_%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%B8%E0%A6%99%E0%A7%8D%E0%A6%97%E0%A7%87%E0%A5%A4",
    "Cancellation of the SRO on graduated income-tax exemption for the Bangladesh Securities and Exchange Commission",
    "বাংলাদেশ সিকিউরিটিজ অ্যান্ড এক্সচেঞ্জ কমিশনের গ্র্যাজুয়েটেড আয়কর অব্যাহতি সংক্রান্ত এসআরও রহিতকরণ",
  ],
  [
    "207",
    "%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A8%E0%A7%A6%E0%A7%AD-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AD_%E0%A5%A4--%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A7%E0%A7%AB%E0%A7%AE-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AA_%E0%A6%8F%E0%A6%B0_%E0%A6%B8%E0%A6%82%E0%A6%B6%E0%A7%8B%E0%A6%A7%E0%A6%A8_%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%B8%E0%A6%99%E0%A7%8D%E0%A6%97%E0%A7%87%E0%A5%A4",
    "Reduced 25 percent income-tax rate for the Bangladesh Economic Zones Authority (BEZA)",
    "বাংলাদেশ অর্থনৈতিক অঞ্চল কর্তৃপক্ষের (বেজা) জন্য হ্রাসকৃত ২৫ শতাংশ আয়করের হার",
  ],
  [
    "208",
    "%E0%A6%8F%E0%A6%B8,%E0%A6%86%E0%A6%B0,%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A8%E0%A7%A6%E0%A7%AE-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AD%E0%A5%A4",
    "Income-tax exemption on the business income of a PPP project company",
    "পিপিপি প্রকল্প কোম্পানির ব্যবসা থেকে আয়ের ওপর আয়কর অব্যাহতি",
  ],
  [
    "209",
    "%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A8%E0%A7%A6%E0%A7%AF-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AD%E0%A5%A4",
    "Income-tax exemption on capital gains from transferring the share capital of a PPP project company, and on royalty, know-how and technical assistance fees it pays",
    "পিপিপি প্রকল্প কোম্পানির শেয়ার মূলধন হস্তান্তরজনিত মূলধনী লাভ এবং উক্ত কোম্পানি কর্তৃক প্রদত্ত রয়্যালটি, কারিগরি জ্ঞান ও কারিগরি সহায়তা ফি-এর ওপর আয়কর অব্যাহতি",
  ],
  [
    "210",
    "%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A8%E0%A7%A7%E0%A7%A6-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AD%E0%A5%A4_1",
    "Income-tax exemption for expatriate technicians employed by a PPP project company",
    "পিপিপি প্রকল্প কোম্পানিতে নিয়োজিত বিদেশি কারিগরি কর্মীদের আয়কর অব্যাহতি",
  ],
  [
    "211",
    "%E0%A6%8F%E0%A6%B8,_%E0%A6%86%E0%A6%B0,_%E0%A6%93_%E0%A6%A8%E0%A6%82_%E0%A7%A8%E0%A7%A7%E0%A7%A7-%E0%A6%86%E0%A6%87%E0%A6%A8%E0%A6%86%E0%A6%AF%E0%A6%BC%E0%A6%95%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AD%E0%A5%A4_2",
    "Income tax on the salary income of employees paid under Government pay orders",
    "সরকারি বেতন আদেশের আওতায় বেতন-ভাতা প্রাপ্ত কর্মচারীদের বেতন আয়ের ওপর আয়কর",
  ],
].map(([no, name, en, bn]) =>
  sro({
    no,
    year: 2017,
    date: "2017-06-21",
    file: `${name}.pdf`,
    title: text(en, bn),
  }),
);

const AUGUST_2017 = [
  [
    "257",
    "sro_257_incometax_2017.pdf",
    "Further amendment of S.R.O. No. 205-Law/Income Tax/2017",
    "এস.আর.ও. নং ২০৫-আইন/আয়কর/২০১৭-এর অধিকতর সংশোধন",
  ],
  [
    "256",
    "sro_256_incometax_2017.pdf",
    "Tax at source on the export value of goods other than jute goods reduced to 0.70%",
    "পাটজাত দ্রব্য ব্যতীত রপ্তানি মূল্যের ওপর উৎসে আয়কর কমিয়ে ০.৭০% নির্ধারণ",
  ],
  [
    "255",
    "sro_255_incometax_2017.pdf",
    "Reduced income-tax rate for taxpayers manufacturing and exporting knitwear and woven garments",
    "নিটওয়্যার ও ওভেন গার্মেন্টস উৎপাদন ও রপ্তানিতে নিয়োজিত করদাতার আয়ের ওপর আয়করের হার হ্রাস",
  ],
].map(([no, file, en, bn]) =>
  sro({ no, year: 2017, date: "2017-08-01", file, title: text(en, bn) }),
);

const SINGLES = [
  {
    no: "132",
    year: 2019,
    date: "2019-06-18",
    file: "Gold_SRO.pdf",
    title: text(
      "Notification to declare undisclosed gold inventory, to implement the Gold Policy, 2019",
      "স্বর্ণ নীতিমালা, ২০১৯ বাস্তবায়নে অপ্রদর্শিত স্বর্ণের মজুত ঘোষণা সংক্রান্ত প্রজ্ঞাপন",
    ),
  },
  {
    no: "02",
    year: 2019,
    date: "2019-01-01",
    file: "IMG_20190109_0001.pdf",
    title: text(
      "Change of the rate of tax at source under section 53BBBB",
      "ধারা ৫৩BBBB-এর অধীন উৎসে করের হার পরিবর্তন",
    ),
  },
  {
    no: "319",
    year: 2018,
    date: "2018-11-11",
    file: "28498_53372.pdf",
    title: text(
      "Reduced tax rate on capital gains from transferring Dhaka Stock Exchange shares",
      "ঢাকা স্টক এক্সচেঞ্জের শেয়ার হস্তান্তরজনিত মূলধনী লাভের কর হার হ্রাস",
    ),
  },
  {
    no: "266",
    year: 2018,
    date: "2018-09-05",
    file: "SRO_No._266-AIN-Income_Tax-2018_.pdf",
    title: text(
      "Tax rate on business income from goods other than the jute goods named in sections 53BB and 53BBBB",
      "ধারা ৫৩BB ও ৫৩BBBB-তে উল্লিখিত পাটজাত দ্রব্য ব্যতীত অন্য সব পণ্যের ব্যবসা থেকে আয়ের ওপর করহার",
    ),
  },
  {
    no: "265",
    year: 2018,
    date: "2018-09-05",
    file: "SRO_No._265-AIN-Income_Tax-2018_.pdf",
    title: text(
      "Rate of tax at source on goods other than the jute goods named in sections 53BB and 53BBBB",
      "ধারা ৫৩BB ও ৫৩BBBB-তে উল্লিখিত পাটজাত দ্রব্য ব্যতীত অন্য সব পণ্যের ক্ষেত্রে উৎসে করহার",
    ),
  },
  {
    no: "191",
    year: 2018,
    date: "2018-06-25",
    file: "IMG_20180626_0004.pdf",
    title: text(
      "Amendment of the Income Tax Rules, 1984",
      "আয়কর বিধিমালা, ১৯৮৪-এর সংশোধন",
    ),
  },
  {
    no: "190",
    year: 2018,
    date: "2018-06-25",
    file: "IMG_20180626_0003.pdf",
    title: text(
      "Amendment of S.R.O. No. 224-Law/Income Tax/2012",
      "এস.আর.ও. নং ২২৪-আইন/আয়কর/২০১২-এর সংশোধন",
    ),
  },
  {
    no: "26",
    year: 2017,
    date: "2017-02-05",
    file: "ITP_Registration.pdf",
    title: text(
      "Change in the educational qualification conditions for Income Tax Practitioner (ITP) registration",
      "আয়কর প্র্যাকটিশনার (আইটিপি) নিবন্ধনের শিক্ষাগত যোগ্যতার শর্ত পরিবর্তন",
    ),
  },
  {
    no: "242",
    year: 2016,
    date: "2016-07-25",
    file: "684.pdf",
    title: text(
      "Exemption on the consultancy income of Atomstroyexport Company for the Rooppur Nuclear Power Plant",
      "রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্রের জন্য অ্যাটমস্ট্রয়এক্সপোর্ট কোম্পানির পরামর্শক আয়ের ওপর অব্যাহতি",
    ),
  },
  {
    no: "241",
    year: 2016,
    date: "2016-07-25",
    file: "683.pdf",
    title: text(
      "Exemption on the contractor bills of Atomstroyexport Company for the Rooppur Nuclear Power Plant",
      "রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্রের জন্য অ্যাটমস্ট্রয়এক্সপোর্ট কোম্পানির ঠিকাদার বিলের ওপর অব্যাহতি",
    ),
  },
].map(sro);

export const SROS_2016_2019 = [
  ...JUNE_2019,
  ...SINGLES,
  ...AUGUST_2017,
  ...JUNE_2017,
];
