import type { Category, Channel, Text } from "./types";

export const CATEGORY_INFO: Record<Category, { label: Text }> = {
  farming: { label: { en: "Farming", hi: "खेती" } },
  health: { label: { en: "Health & treatment", hi: "इलाज" } },
  pension: { label: { en: "Pension", hi: "पेंशन" } },
  insurance: { label: { en: "Insurance", hi: "बीमा" } },
  housing: { label: { en: "House", hi: "घर" } },
  education: { label: { en: "Education", hi: "पढ़ाई" } },
  jobs: { label: { en: "Jobs & skills", hi: "रोज़गार और हुनर" } },
  business: { label: { en: "Business & loans", hi: "व्यापार और लोन" } },
  women_child: { label: { en: "Women & children", hi: "महिला और बच्चे" } },
  food: { label: { en: "Food & ration", hi: "राशन" } },
  disability: { label: { en: "Disability", hi: "दिव्यांग" } },
  utilities: { label: { en: "Gas, power, toilet", hi: "गैस, बिजली, शौचालय" } },
  banking: { label: { en: "Bank & savings", hi: "बैंक और बचत" } },
};

export const CHANNEL_INFO: Record<Channel, { label: Text }> = {
  online: { label: { en: "Online, on the official website", hi: "सरकारी वेबसाइट पर ऑनलाइन" } },
  csc: { label: { en: "Nearest Common Service Centre (CSC / Jan Seva Kendra)", hi: "नज़दीकी जन सेवा केंद्र (CSC)" } },
  bank: { label: { en: "Your bank branch", hi: "अपने बैंक की शाखा" } },
  post_office: { label: { en: "Post office", hi: "डाकघर" } },
  gram_panchayat: { label: { en: "Gram Panchayat / Block office", hi: "ग्राम पंचायत / ब्लॉक कार्यालय" } },
  anganwadi: { label: { en: "Anganwadi centre", hi: "आंगनवाड़ी केंद्र" } },
  health_centre: { label: { en: "Government hospital / ASHA worker", hi: "सरकारी अस्पताल / आशा दीदी" } },
  school_college: { label: { en: "Through your school / college", hi: "अपने स्कूल / कॉलेज के ज़रिए" } },
  district_office: { label: { en: "District / Tehsil office", hi: "ज़िला / तहसील कार्यालय" } },
};

export const DOCUMENTS: Record<string, Text> = {
  aadhaar: { en: "Aadhaar card", hi: "आधार कार्ड" },
  bank_passbook: { en: "Bank passbook (account linked to Aadhaar)", hi: "बैंक पासबुक (आधार से जुड़ा खाता)" },
  mobile: { en: "Mobile number linked to Aadhaar", hi: "आधार से जुड़ा मोबाइल नंबर" },
  photo: { en: "Passport-size photo", hi: "पासपोर्ट साइज़ फोटो" },
  land_records: { en: "Land records (khatauni / jamabandi / 7-12)", hi: "ज़मीन के कागज़ (खतौनी / जमाबंदी)" },
  sowing_certificate: { en: "Sowing certificate / crop details", hi: "बुवाई प्रमाण पत्र / फसल का विवरण" },
  ration_card: { en: "Ration card", hi: "राशन कार्ड" },
  income_cert: { en: "Income certificate", hi: "आय प्रमाण पत्र" },
  caste_cert: { en: "Caste certificate", hi: "जाति प्रमाण पत्र" },
  residence_proof: { en: "Residence / domicile certificate", hi: "निवास प्रमाण पत्र" },
  age_proof: { en: "Age proof (birth certificate / school record)", hi: "उम्र का प्रमाण (जन्म प्रमाण पत्र / स्कूल रिकॉर्ड)" },
  birth_cert: { en: "Child's birth certificate", hi: "बच्चे का जन्म प्रमाण पत्र" },
  mcp_card: { en: "Mother & Child Protection (MCP) card", hi: "माँ-बच्चा सुरक्षा (MCP) कार्ड" },
  marksheet: { en: "Last exam marksheet", hi: "पिछली परीक्षा की मार्कशीट" },
  fee_receipt: { en: "Fee receipt / admission letter", hi: "फीस की रसीद / दाखिले का पत्र" },
  disability_cert: { en: "Disability certificate / UDID card", hi: "दिव्यांगता प्रमाण पत्र / UDID कार्ड" },
  death_cert: { en: "Death certificate (of spouse / earning member)", hi: "मृत्यु प्रमाण पत्र (पति/पत्नी या कमाने वाले सदस्य का)" },
  job_card: { en: "MGNREGA job card", hi: "मनरेगा जॉब कार्ड" },
  vending_certificate: { en: "Vending certificate or Letter of Recommendation from town body", hi: "वेंडिंग प्रमाण पत्र या नगर निकाय का सिफ़ारिश पत्र" },
  electricity_bill: { en: "Latest electricity bill", hi: "हाल का बिजली बिल" },
  project_report: { en: "Simple business plan (project report)", hi: "व्यवसाय की सरल योजना (प्रोजेक्ट रिपोर्ट)" },
  school_cert: { en: "Bonafide certificate from school / college", hi: "स्कूल / कॉलेज का बोनाफ़ाइड प्रमाण पत्र" },
};
