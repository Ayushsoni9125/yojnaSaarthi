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
