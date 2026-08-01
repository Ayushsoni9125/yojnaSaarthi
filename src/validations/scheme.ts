import { z } from "zod";
import {
  SCHEME_CATEGORIES,
  SCHEME_STATUS,
} from "@/constants/scheme";

export const SchemeValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(150, "Title cannot exceed 150 characters."),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(200),

  shortDescription: z
    .string()
    .trim()
    .min(20)
    .max(250),

  description: z
    .string()
    .trim()
    .min(50),

 category: z.enum(SCHEME_CATEGORIES),

  ministry: z
    .string()
    .trim()
    .min(3),

  officialUrl: z
    .string()
    .url("Please enter a valid official URL."),

 status: z.enum(SCHEME_STATUS),
});

export type SchemeInput = z.infer<
  typeof SchemeValidationSchema
>;