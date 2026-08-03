import slugify from "slugify";
import { ScrapedScheme } from "@/types/scraper";
import { mapCategory } from "@/utils/mapCategory";
export function mapMyScheme(item: any): ScrapedScheme {
    const fields = item.fields;

    return {
        title: fields.schemeName ?? "",

        slug:
            fields.slug ||
            slugify(fields.schemeName ?? "", {
                lower: true,
                strict: true,
            }),

        shortDescription: (
            fields.briefDescription ??
            ""
        ).slice(0, 250),

        description:
            fields.description ??
            fields.briefDescription ??
            "",

        category: mapCategory(fields.schemeCategory?.[0]),

        ministry:
            fields.nodalMinistryName ??
            "Unknown",

        benefits: [],

        documents: [],

        tags: fields.tags ?? [],

        states:
            fields.beneficiaryState ?? [],

        officialUrl: `https://www.myscheme.gov.in/schemes/${fields.slug}`,

        source: "MyScheme",

        sourceUrl:
            "https://www.myscheme.gov.in",
    };
}