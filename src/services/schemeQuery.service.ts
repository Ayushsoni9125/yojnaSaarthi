import Scheme from "@/models/Scheme";

export async function getLatestSchemes(limit = 12) {
    return await Scheme.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
}

export async function getSchemeBySlug(slug: string) {
    return await Scheme.findOne({ slug }).lean();
}