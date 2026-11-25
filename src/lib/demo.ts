// Sample people for demos ("Try an example" on the home page). Never saved over the user's own profile.
import type { Profile, Text } from "./core/types";

export const DEMOS: Record<string, { label: Text; summary: Text; profile: Profile }> = {
  farmer: {
    label: { en: "Small farmer, Bihar", hi: "छोटा किसान, बिहार" },
    summary: { en: "35 yrs, OBC, 4 acres, kutcha house", hi: "35 साल, OBC, 4 एकड़, कच्चा घर" },
    profile: {
      answers: { state: "BR", area: "rural", age: 35, gender: "male", maritalStatus: "married", girlChildUnder10: true, category: "obc", minority: false, income: "1to2.5", rationCard: "phh", taxPayer: false, occupation: "farmer", land: "small", education: "none", disability: "none", house: "kutcha", hasLpg: true, hasBankAccount: true, hasToilet: true },
      needs: ["farming"],
      done: true,
    },
  },
  widow: {
    label: { en: "Widow, farm labourer, UP", hi: "विधवा, खेत मज़दूर, उत्तर प्रदेश" },
    summary: { en: "52 yrs, SC, Antyodaya card, no LPG", hi: "52 साल, SC, अंत्योदय कार्ड, गैस नहीं" },
    profile: {
      answers: { state: "UP", area: "rural", age: 52, gender: "female", maritalStatus: "widowed", girlChildUnder10: false, category: "sc", minority: false, income: "below1", rationCard: "aay", taxPayer: false, occupation: "agri_labourer", disability: "none", house: "kutcha", hasLpg: false, hasBankAccount: true, hasToilet: false },
      needs: ["pension", "housing"],
      done: true,
    },
  },
  student: {
    label: { en: "College student, Delhi", hi: "कॉलेज छात्र, दिल्ली" },
    summary: { en: "20 yrs, SC, income under ₹2.5 lakh", hi: "20 साल, SC, आय ₹2.5 लाख से कम" },
    profile: {
      answers: { state: "DL", area: "urban", age: 20, gender: "male", maritalStatus: "unmarried", girlChildUnder10: false, category: "sc", minority: false, income: "1to2.5", rationCard: "none", taxPayer: false, occupation: "student", education: "college", disability: "none", house: "pucca", hasLpg: true, hasBankAccount: true },
      needs: ["education"],
      done: true,
    },
  },
  mother: {
    label: { en: "Expecting mother, Maharashtra", hi: "गर्भवती महिला, महाराष्ट्र" },
    summary: { en: "24 yrs, ST, BPL card, rural", hi: "24 साल, ST, BPL कार्ड, गाँव" },
    profile: {
      answers: { state: "MH", area: "rural", age: 24, gender: "female", maritalStatus: "married", pregnant: true, girlChildUnder10: true, category: "st", minority: false, income: "below1", rationCard: "phh", taxPayer: false, occupation: "homemaker", education: "none", disability: "none", house: "kutcha", hasLpg: false, hasBankAccount: true, hasToilet: false },
      needs: ["women_child", "health"],
      done: true,
    },
  },
};
