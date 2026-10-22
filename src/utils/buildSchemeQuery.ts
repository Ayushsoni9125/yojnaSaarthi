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

  // Added Today Filter
  if (query.timeFrame === "today" || query.addedToday === "true" || query.addedToday === true) {
    const now = new Date();
    const istFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const istDateString = istFormatter.format(now);
    filter.createdAt = { $gte: new Date(`${istDateString}T00:00:00+05:30`) };
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