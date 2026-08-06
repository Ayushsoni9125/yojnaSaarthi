import { SchemeQuery } from "@/validations/query";
import { escapeRegex } from "@/utils/escapeRegex";

export function buildSchemeQuery(query: SchemeQuery) {
  const filter: Record<string, unknown> = {};

  // Category Filter
  if (query.category) {
    filter.category = query.category;
  }

  // Status Filter
  if (query.status) {
    filter.status = query.status;
  }

  // State Filter
  if (query.state) {
    filter.states = query.state;
  }

  // Search
  if (query.search) {
    const escaped = escapeRegex(query.search);
    filter.$or = [
      {
        title: {
          $regex: escaped,
          $options: "i",
        },
      },
      {
        description: {
          $regex: escaped,
          $options: "i",
        },
      },
      {
        ministry: {
          $regex: escaped,
          $options: "i",
        },
      },
    ];
  }

  return filter;
}