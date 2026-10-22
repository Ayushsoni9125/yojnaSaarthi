import { z } from "zod";
import {
    SCHEME_CATEGORIES,
    SCHEME_STATUS,
} from "@/constants/scheme";

export const SchemeQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(50).default(10),

    search: z.string().trim().optional(),

    category: z.enum(SCHEME_CATEGORIES).optional(),

    status: z.enum(SCHEME_STATUS).optional(),

    state: z.string().trim().optional(),
    timeFrame: z.string().optional(),
    addedToday: z.union([z.string(), z.boolean()]).optional(),
    sort: z
        .enum(["latest", "oldest", "az", "za"])
        .optional()
        .default("latest"),
});

export type SchemeQuery = z.infer<typeof SchemeQuerySchema>;