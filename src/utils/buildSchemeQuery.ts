import { SchemeQuery } from "@/validations/query";


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
    filter.$or = [
      {
        title: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        ministry: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  return filter;
}