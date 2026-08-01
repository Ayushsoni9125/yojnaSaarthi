export const SCHEME_STATUS = [
  "Active",
  "Upcoming",
  "Expired",
] as const;

export const SCHEME_CATEGORIES = [
  "Agriculture",
  "Education",
  "Health",
  "Housing",
  "Employment",
  "Women Empowerment",
  "Children",
  "Senior Citizens",
  "Business",
  "Finance",
  "Skill Development",
  "Social Welfare",
  "Minority Welfare",
  "SC/ST Welfare",
  "Environment",
  "Digital India",
  "Startup",
  "Rural Development",
  "Urban Development",
  "Insurance",
  "Scholarship",
] as const;

export type SchemeStatus = typeof SCHEME_STATUS[number];
export type SchemeCategory = typeof SCHEME_CATEGORIES[number];