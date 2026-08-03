import Scheme from "@/models/Scheme";
import { SchemeInput } from "@/validations/scheme";
import { SchemeQuery } from "@/validations/query";
import { buildSchemeQuery } from "@/utils/buildSchemeQuery";
import { ScrapedScheme } from "@/types/scraper";
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

    const [rawSchemes, total] = await Promise.all([
        Scheme.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),

        Scheme.countDocuments(filter),
    ]);

    const schemes = rawSchemes.map((scheme: any) => ({
        ...scheme,
        _id: scheme._id.toString(),
        createdAt: scheme.createdAt?.toISOString(),
        updatedAt: scheme.updatedAt?.toISOString(),
        lastScrapedAt: scheme.lastScrapedAt?.toISOString() ?? null,
        sources: (scheme.sources ?? []).map((s: any) => ({
            ...s,
            _id: s._id?.toString() ?? null,
            scrapedAt: s.scrapedAt?.toISOString() ?? null,
        })),
    }));
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

    if (!scheme) return null;

    return {
        ...scheme,
        _id: scheme._id.toString(),
        createdAt: scheme.createdAt?.toISOString(),
        updatedAt: scheme.updatedAt?.toISOString(),
        lastScrapedAt: scheme.lastScrapedAt?.toISOString() ?? null,
        sources: ((scheme as any).sources ?? []).map((s: any) => ({
            ...s,
            _id: s._id?.toString() ?? null,
            scrapedAt: s.scrapedAt?.toISOString() ?? null,
        })),
    };
}

export async function updateScheme(
    slug: string,
    data: Partial<SchemeInput>
) {
    const scheme = await Scheme.findOneAndUpdate(
        { slug },
        data,
        {
            new: true,
            runValidators: true,
        }
    ).lean();

    if (!scheme) return null;

    return {
        ...scheme,
        _id: scheme._id.toString(),
        createdAt: scheme.createdAt?.toISOString(),
        updatedAt: scheme.updatedAt?.toISOString(),
        lastScrapedAt: scheme.lastScrapedAt?.toISOString() ?? null,
        sources: ((scheme as any).sources ?? []).map((s: any) => ({
            ...s,
            _id: s._id?.toString() ?? null,
            scrapedAt: s.scrapedAt?.toISOString() ?? null,
        })),
    };
}

export async function deleteScheme(slug: string) {
    const scheme = await Scheme.findOneAndDelete({ slug }).lean();

    if (!scheme) return null;

    return {
        ...scheme,
        _id: scheme._id.toString(),
    };
}


export async function upsertScheme(data: ScrapedScheme) {
    return await Scheme.findOneAndUpdate(
        {
            slug: data.slug,
        },
        {
            title: data.title,
            slug: data.slug,
            shortDescription: data.shortDescription,
            description: data.description,
            category: data.category,
            ministry: data.ministry,
            benefits: data.benefits,
            documents: data.documents,
            tags: data.tags,
            states: data.states,
            officialUrl: data.officialUrl,

            sources: [
                {
                    name: data.source,
                    url: data.sourceUrl,
                    scrapedAt: new Date(),
                },
            ],

            sourceCount: 1,
            lastScrapedAt: new Date(),

            status: "Active",
        },
        {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        }
    );
}
export async function bulkUpsertSchemes(
  schemes: ScrapedScheme[]
) {
  if (!schemes.length) return;

  const operations = schemes.map((scheme) => ({
    updateOne: {
      filter: {
        slug: scheme.slug,
      },
      update: {
        $set: {
          title: scheme.title,
          slug: scheme.slug,
          shortDescription: scheme.shortDescription,
          description: scheme.description,
          category: scheme.category,
          ministry: scheme.ministry,
          benefits: scheme.benefits,
          documents: scheme.documents,
          tags: scheme.tags,
          states: scheme.states,
          officialUrl: scheme.officialUrl,

          sources: [
            {
              name: scheme.source,
              url: scheme.sourceUrl,
              scrapedAt: new Date(),
            },
          ],

          sourceCount: 1,
          lastScrapedAt: new Date(),
          status: "Active",
        },
      },
      upsert: true,
    },
  }));

  return await Scheme.bulkWrite(operations);
}