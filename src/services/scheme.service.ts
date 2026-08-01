import Scheme from "@/models/Scheme";
import { SchemeInput } from "@/validations/scheme";
import { SchemeQuery } from "@/validations/query";
import { buildSchemeQuery } from "@/utils/buildSchemeQuery";

export async function createScheme(data: SchemeInput) {
  const scheme = await Scheme.create(data);
  return scheme;
}

export async function getSchemes(query: SchemeQuery) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  const skip = (page - 1) * limit;

  const filter = buildSchemeQuery(query);

  let sort = {};

  switch (query.sort) {
    case "latest":
      sort = { createdAt: -1 };
      break;

    case "oldest":
      sort = { createdAt: 1 };
      break;

    case "az":
      sort = { title: 1 };
      break;

    case "za":
      sort = { title: -1 };
      break;

    default:
      sort = { createdAt: -1 };
  }

  const [schemes, total] = await Promise.all([
    Scheme.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    Scheme.countDocuments(filter),
  ]);

  return {
    schemes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSchemeBySlug(slug: string) {
  const scheme = await Scheme.findOne({ slug }).lean();

  return scheme;
}

export async function updateScheme(
  slug: string,
  data: Partial<SchemeInput>
) {
  return await Scheme.findOneAndUpdate(
    { slug },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).lean();
}

export async function deleteScheme(slug: string) {
  return await Scheme.findOneAndDelete({ slug }).lean();
}