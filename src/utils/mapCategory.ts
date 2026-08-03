import { SchemeCategory } from "@/constants/scheme";

const CATEGORY_MAP: Record<string, SchemeCategory> = {
  "Agriculture": "Agriculture",

  "Business & Entrepreneurship": "Business",
  "Business": "Business",
  "Entrepreneurship": "Business",

  "Education": "Education",
  "Education & Learning": "Education",
  "Scholarship": "Scholarship",

  "Health": "Health",
  "Health & Wellness": "Health",

  "Housing": "Housing",

  "Employment": "Employment",
  "Jobs": "Employment",

  "Women": "Women Empowerment",
  "Women Empowerment": "Women Empowerment",

  "Children": "Children",

  "Senior Citizen": "Senior Citizens",
  "Senior Citizens": "Senior Citizens",

  "Finance": "Finance",
  "Banking": "Finance",

  "Skill Development": "Skill Development",
  "Skills": "Skill Development",

  "Social Welfare": "Social Welfare",

  "Minority": "Minority Welfare",
  "Minority Welfare": "Minority Welfare",

  "SC/ST": "SC/ST Welfare",
  "SC/ST Welfare": "SC/ST Welfare",

  "Environment": "Environment",

  "Digital India": "Digital India",

  "Startup": "Startup",

  "Rural Development": "Rural Development",

  "Urban Development": "Urban Development",

  "Insurance": "Insurance",
};

export function mapCategory(category?: string): SchemeCategory {
  if (!category) return "Social Welfare";

  return CATEGORY_MAP[category] ?? "Social Welfare";
}